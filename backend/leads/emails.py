"""Transactional email.

Two entry points: `notify_submission` (alerts admins about a new lead) and
`send_reply` (an admin replying to one). All user-supplied fields are
HTML-escaped before interpolation — these bodies are assembled as raw HTML,
so an unescaped name or message would be a markup-injection vector into the
admin's inbox.

Three delivery routes, selected by `settings.EMAIL_PROVIDER`:

* ``resend``  — Resend HTTP API (needs RESEND_API_KEY)
* ``smtp``    — any SMTP server, including Gmail or a domain mailbox
* ``console`` — prints the message to the terminal; for local development

The provider is auto-detected from whichever credentials are present, so a
working setup needs no extra configuration. If none are, sending is skipped
and logged as an ERROR rather than silently swallowed — a form that reports
success while quietly sending nothing is the exact failure this project set
out to avoid.
"""

from __future__ import annotations

import logging
from html import escape
from typing import TYPE_CHECKING

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives

from accounts.models import AdminNotificationPreference

if TYPE_CHECKING:
    from .models import ContactSubmission, QuoteRequest

logger = logging.getLogger(__name__)

RESEND_ENDPOINT = "https://api.resend.com/emails"


def _strip_html(html_body: str) -> str:
    """Crude plain-text alternative. Every HTML mail should carry one — some
    clients and most spam filters penalise HTML-only messages."""
    import re

    text = re.sub(r"<br\s*/?>|</p>|</tr>|</h[1-6]>", "\n", html_body, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())


def _send_via_resend(to: str, subject: str, html_body: str) -> bool:
    try:
        res = requests.post(
            RESEND_ENDPOINT,
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.RESEND_FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html_body,
                "text": _strip_html(html_body),
            },
            timeout=10,
        )
    except requests.RequestException as exc:
        logger.error("Resend request failed for %s: %s", to, exc)
        return False

    if not res.ok:
        logger.error("Resend rejected the message for %s (%s): %s", to, res.status_code, res.text)
        return False

    logger.info("Sent via Resend to %s", to)
    return True


def _send_via_django(to: str, subject: str, html_body: str) -> bool:
    """Covers both SMTP and the console backend — Django picks the transport
    from EMAIL_BACKEND, so the code path is identical."""
    try:
        message = EmailMultiAlternatives(
            subject=subject,
            body=_strip_html(html_body),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
    except Exception as exc:  # noqa: BLE001 — any transport error must be logged, not raised
        logger.error("SMTP send failed for %s: %s", to, exc)
        return False

    logger.info("Sent via %s to %s", settings.EMAIL_PROVIDER, to)
    return True


def _send_email(to: str, subject: str, html_body: str) -> bool:
    """Returns whether the message was handed to a transport. Never raises —
    a delivery failure must not roll back the submission that triggered it."""
    provider = settings.EMAIL_PROVIDER

    if provider == "resend":
        return _send_via_resend(to, subject, html_body)
    if provider in {"smtp", "console"}:
        return _send_via_django(to, subject, html_body)

    logger.error(
        "No email provider configured — notification to %s was NOT sent. "
        "Set RESEND_API_KEY, or EMAIL_HOST/EMAIL_HOST_USER/EMAIL_HOST_PASSWORD for SMTP.",
        to,
    )
    return False


def _admin_recipients(event_type: str) -> list[str]:
    User = get_user_model()
    admin_ids = list(User.objects.filter(is_staff=True).values_list("id", flat=True))
    if not admin_ids:
        return []

    disabled_ids = set(
        AdminNotificationPreference.objects.filter(
            event_type=event_type, user_id__in=admin_ids, enabled=False
        ).values_list("user_id", flat=True)
    )
    enabled_ids = [uid for uid in admin_ids if uid not in disabled_ids]
    return list(User.objects.filter(id__in=enabled_ids).exclude(email="").values_list("email", flat=True))


def _contact_email_html(submission: "ContactSubmission") -> str:
    return f"""
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">{escape(submission.name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">{escape(submission.email)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">{escape(submission.phone or "N/A")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">{escape(submission.subject)}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;">{escape(submission.message)}</p>
    """


def _quote_email_html(quote: "QuoteRequest") -> str:
    return f"""
      <h2>New Quote Request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">{escape(quote.name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Business</td><td style="padding:8px;">{escape(quote.business or "N/A")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">{escape(quote.email)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">{escape(quote.phone or "N/A")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Service</td><td style="padding:8px;">{escape(quote.service_type)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Contact Method</td><td style="padding:8px;">{escape(quote.preferred_contact_method or "N/A")}</td></tr>
      </table>
      <h3>Project Description</h3>
      <p style="white-space:pre-wrap;">{escape(quote.description)}</p>
    """


def notify_submission(submission) -> None:
    """Equivalent of the legacy `notify-submission` edge function."""
    from .models import ContactSubmission, QuoteRequest

    if isinstance(submission, ContactSubmission):
        # Software-service requests are contact submissions tagged by
        # `source` (docs/08-api-design.md §3) — there is no separate
        # notification preference for them, so they use "new_contact" too.
        event_type = "new_contact"
        subject = f"New Contact: {submission.subject}"
        html_body = _contact_email_html(submission)
    elif isinstance(submission, QuoteRequest):
        event_type = "new_quote"
        subject = f"New Quote Request: {submission.service_type or 'General'}"
        html_body = _quote_email_html(submission)
    else:
        raise ValueError(f"Unsupported submission type: {type(submission)!r}")

    for recipient in _admin_recipients(event_type):
        _send_email(recipient, subject, html_body)


def notify_newsletter_signup(email: str) -> None:
    subject = "New Newsletter Signup"
    html_body = f"<h2>New Newsletter Signup</h2><p>{escape(email)}</p>"
    for recipient in _admin_recipients("new_newsletter_signup"):
        _send_email(recipient, subject, html_body)


def send_reply(to: str, subject: str, message: str) -> None:
    """Equivalent of the legacy `send-reply` edge function. Caller is
    responsible for the admin re-verification (see leads/views.py)."""
    html_body = f"""
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;">MudhoTech Solutions</h1>
        </div>
        <div style="padding:24px;background:#ffffff;">
          <div style="white-space:pre-wrap;line-height:1.6;color:#333333;">{escape(message)}</div>
        </div>
        <div style="padding:16px;background:#f5f5f5;text-align:center;font-size:12px;color:#888;">
          <p>This email was sent from MudhoTech Solutions</p>
        </div>
      </div>
    """
    _send_email(to, subject, html_body)
