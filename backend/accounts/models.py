from django.conf import settings
from django.db import models


class AdminNotificationPreference(models.Model):
    """Per-admin toggle for which submission events trigger an email.

    A missing row for a given (user, event_type) means "enabled" —
    matches docs/08-api-design.md's notify-submission default.
    """

    class EventType(models.TextChoices):
        NEW_CONTACT = "new_contact", "New Contact"
        NEW_QUOTE = "new_quote", "New Quote"
        NEW_NEWSLETTER_SIGNUP = "new_newsletter_signup", "New Newsletter Signup"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences",
    )
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "event_type")

    def __str__(self) -> str:
        return f"{self.user} — {self.event_type}: {'on' if self.enabled else 'off'}"


class RevokedAccessToken(models.Model):
    """An admin access token that was signed out before it expired.

    The JWT is otherwise valid until `exp` (8 hours), so deleting the cookie
    on logout does not stop a copy of the token from working. Every
    authenticated request checks its `jti` against this table
    (accounts/authentication.py). Rows are only needed until the token would
    have expired anyway; logout prunes the expired ones.
    """

    jti = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.jti} (until {self.expires_at:%Y-%m-%d %H:%M})"
