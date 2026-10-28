"""API tests for the submission and admin surfaces (docs/12-testing-plan.md).
Run with: python manage.py test"""

from datetime import timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import AdminNotificationPreference

from .models import ContactSubmission, NewsletterSubscriber, QuoteRequest


class PublicSubmissionTests(TestCase):
    def setUp(self):
        # Throttle counters live in a shared file cache; reset so tests and
        # repeated runs don't eat into each other's budget.
        cache.clear()
        self.client = APIClient()

    def test_valid_contact_submission_creates_row(self):
        response = self.client.post(
            "/api/submissions/contact/",
            {
                "name": "Tendai Moyo",
                "email": "tendai@example.com",
                "subject": "Website enquiry",
                "message": "I would like to discuss a new website.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactSubmission.objects.count(), 1)
        self.assertEqual(ContactSubmission.objects.first().status, "new")

    def test_invalid_contact_submission_returns_400(self):
        response = self.client.post(
            "/api/submissions/contact/",
            {"name": "", "email": "not-an-email", "subject": "", "message": ""},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactSubmission.objects.count(), 0)

    def test_filled_honeypot_is_rejected_and_writes_nothing(self):
        response = self.client.post(
            "/api/submissions/contact/",
            {
                "name": "Spam Bot",
                "email": "bot@spam.example",
                "subject": "Spam",
                "message": "Spam spam spam spam.",
                "website": "http://spam.example",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactSubmission.objects.count(), 0)

    def test_software_service_request_is_tagged_by_source(self):
        response = self.client.post(
            "/api/submissions/software-service/",
            {
                "name": "Farai Dube",
                "email": "farai@example.com",
                "service_category": "Security & Maintenance",
                "details": "Antivirus keeps disabling itself after restart.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        submission = ContactSubmission.objects.get()
        self.assertEqual(submission.source, ContactSubmission.Source.SOFTWARE_SERVICE)
        self.assertIn("[Software Service Request]", submission.subject)
        self.assertIsNone(submission.phone)

    def test_software_service_request_keeps_an_optional_phone(self):
        response = self.client.post(
            "/api/submissions/software-service/",
            {
                "name": "Farai Dube",
                "email": "farai@example.com",
                "phone": "+263 77 123 4567",
                "service_category": "Laptop & Desktop Repairs",
                "details": "Laptop no longer charges after a fall.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactSubmission.objects.get().phone, "+263 77 123 4567")

    def test_software_service_request_records_device_and_handover(self):
        response = self.client.post(
            "/api/submissions/software-service/",
            {
                "name": "Farai Dube",
                "email": "farai@example.com",
                "service_category": "Laptop & Desktop Repairs",
                "device": "HP ProBook 450",
                "handover": "drop-off",
                "details": "Laptop no longer charges after a fall.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        message = ContactSubmission.objects.get().message
        self.assertIn("Device or system: HP ProBook 450", message)
        self.assertIn("Getting to it: Customer will bring it to the Graniteside office", message)
        self.assertTrue(message.endswith("Laptop no longer charges after a fall."))

    def test_software_service_request_without_booking_details_keeps_the_message_as_written(self):
        self.client.post(
            "/api/submissions/software-service/",
            {
                "name": "Farai Dube",
                "email": "farai@example.com",
                "service_category": "Laptop & Desktop Repairs",
                "device": "",
                "handover": None,
                "details": "Laptop no longer charges after a fall.",
            },
            format="json",
        )
        self.assertEqual(ContactSubmission.objects.get().message, "Laptop no longer charges after a fall.")

    def test_software_service_request_rejects_an_unknown_handover(self):
        response = self.client.post(
            "/api/submissions/software-service/",
            {
                "name": "Farai Dube",
                "email": "farai@example.com",
                "service_category": "Laptop & Desktop Repairs",
                "handover": "courier",
                "details": "Laptop no longer charges after a fall.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactSubmission.objects.count(), 0)

    def test_valid_quote_creates_row(self):
        response = self.client.post(
            "/api/submissions/quote/",
            {
                "name": "Rumbi Chikwanha",
                "email": "rumbi@example.com",
                "service_type": "Web Development",
                "description": "We need an online store with local payments.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(QuoteRequest.objects.count(), 1)

    def test_duplicate_newsletter_signup_is_friendly_not_500(self):
        payload = {"email": "reader@example.com"}
        first = self.client.post("/api/newsletter/", payload, format="json")
        second = self.client.post("/api/newsletter/", payload, format="json")

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertTrue(second.json()["success"])
        self.assertEqual(NewsletterSubscriber.objects.count(), 1)


class AdminAccessTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        User = get_user_model()
        self.admin = User.objects.create_user("admin", "admin@example.com", "pw12345!", is_staff=True)
        self.non_admin = User.objects.create_user("regular", "regular@example.com", "pw12345!")
        ContactSubmission.objects.create(
            name="Existing", email="existing@example.com", subject="Hi", message="Hello there."
        )

    def test_anonymous_cannot_list_submissions(self):
        response = self.client.get("/api/admin/submissions/?type=contact")
        self.assertEqual(response.status_code, 401)

    def test_non_admin_cannot_list_submissions(self):
        self.client.force_authenticate(self.non_admin)
        response = self.client.get("/api/admin/submissions/?type=contact")
        self.assertEqual(response.status_code, 403)

    def test_admin_can_list_submissions(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/admin/submissions/?type=contact")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["total"], 1)

    def test_admin_can_change_status(self):
        self.client.force_authenticate(self.admin)
        submission = ContactSubmission.objects.get()
        response = self.client.patch(
            f"/api/admin/submissions/{submission.pk}/?type=contact", {"status": "read"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        submission.refresh_from_db()
        self.assertEqual(submission.status, "read")

    def test_invalid_status_is_rejected(self):
        self.client.force_authenticate(self.admin)
        submission = ContactSubmission.objects.get()
        response = self.client.patch(
            f"/api/admin/submissions/{submission.pk}/?type=contact", {"status": "bogus"}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_login_rejects_non_staff(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "regular", "password": "pw12345!"}, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_login_issues_token_for_staff(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "admin", "password": "pw12345!"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertTrue(response.json()["user"]["is_staff"])

    def test_notification_preferences_default_to_enabled(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/admin/notification-preferences/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(all(response.json().values()))

    def test_notification_preferences_persist_per_user(self):
        self.client.force_authenticate(self.admin)
        self.client.put("/api/admin/notification-preferences/", {"new_contact": False}, format="json")

        pref = AdminNotificationPreference.objects.get(user=self.admin, event_type="new_contact")
        self.assertFalse(pref.enabled)

        response = self.client.get("/api/admin/notification-preferences/")
        self.assertFalse(response.json()["new_contact"])
        self.assertTrue(response.json()["new_quote"])


class SubmissionThrottleTests(TestCase):
    """Every request reaches Django from the Next.js server, so the limit has
    to key on the forwarded visitor IP rather than on REMOTE_ADDR."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def _subscribe(self, n: int, forwarded_for: str):
        return self.client.post(
            "/api/newsletter/", {"email": f"reader{n}@example.com"}, format="json", HTTP_X_FORWARDED_FOR=forwarded_for
        )

    def test_limit_applies_per_forwarded_ip(self):
        for n in range(10):
            self.assertEqual(self._subscribe(n, "198.51.100.7").status_code, 201)
        self.assertEqual(self._subscribe(10, "198.51.100.7").status_code, 429)

        # A different visitor behind the same Next.js server is unaffected.
        self.assertEqual(self._subscribe(11, "203.0.113.9").status_code, 201)

    def test_spoofed_left_hand_hops_do_not_mint_fresh_buckets(self):
        for n in range(10):
            self._subscribe(n, f"10.0.0.{n}, 198.51.100.7")
        self.assertEqual(self._subscribe(10, "10.0.0.99, 198.51.100.7").status_code, 429)


class AdminInputValidationTests(TestCase):
    """Malformed admin input must be a 400, not an unhandled 500."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()
        admin = get_user_model().objects.create_user("admin", "admin@example.com", "pw12345!", is_staff=True)
        self.client.force_authenticate(admin)
        self.submission = ContactSubmission.objects.create(
            name="Existing", email="existing@example.com", subject="Hi", message="Hello there."
        )

    def test_unknown_type_is_rejected(self):
        self.assertEqual(self.client.get("/api/admin/submissions/?type=bogus").status_code, 400)
        response = self.client.patch(
            f"/api/admin/submissions/{self.submission.pk}/?type=bogus", {"status": "read"}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_malformed_date_is_rejected(self):
        self.assertEqual(self.client.get("/api/admin/submissions/?type=contact&from=yesterday").status_code, 400)
        self.assertEqual(self.client.get("/api/admin/submissions/?type=contact&to=2026-02-30").status_code, 400)

    def test_to_date_includes_the_whole_day(self):
        today = timezone.now().date().isoformat()
        response = self.client.get(f"/api/admin/submissions/?type=contact&from={today}&to={today}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["total"], 1)

        yesterday = (timezone.now() - timedelta(days=1)).date().isoformat()
        response = self.client.get(f"/api/admin/submissions/?type=contact&to={yesterday}")
        self.assertEqual(response.json()["total"], 0)

    def test_bulk_rejects_non_integer_ids(self):
        for ids in (["abc"], "1,2", [True], []):
            response = self.client.post(
                "/api/admin/submissions/bulk/", {"ids": ids, "action": "markRead", "type": "contact"}, format="json"
            )
            self.assertEqual(response.status_code, 400, ids)

    def test_bulk_updates_valid_ids(self):
        response = self.client.post(
            "/api/admin/submissions/bulk/",
            {"ids": [self.submission.pk], "action": "markRead", "type": "contact"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["affected"], 1)

    def test_analytics_clamps_out_of_range_days(self):
        response = self.client.get("/api/admin/analytics/?days=99999999999")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["range_days"], 366)

    def test_analytics_groups_by_day(self):
        response = self.client.get("/api/admin/analytics/?days=7")
        self.assertEqual(response.json()["contacts_daily"], {timezone.now().date().isoformat(): 1})


class AdminReplyTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        admin = get_user_model().objects.create_user("admin", "admin@example.com", "pw12345!", is_staff=True)
        self.client.force_authenticate(admin)
        self.submission = ContactSubmission.objects.create(
            name="Lead", email="lead@example.com", subject="Hi", message="Hello there."
        )

    def _reply(self, **overrides):
        payload = {
            "to": "lead@example.com",
            "subject": "Re: Hi",
            "message": "Thanks for getting in touch.",
            "submissionType": "contact",
            "submissionId": self.submission.pk,
        }
        payload.update(overrides)
        return self.client.post("/api/admin/reply/", payload, format="json")

    @mock.patch("leads.admin_views.send_reply", return_value=True)
    def test_successful_reply_marks_submission_replied(self, send):
        self.assertEqual(self._reply().status_code, 200)
        send.assert_called_once()
        self.submission.refresh_from_db()
        self.assertEqual(self.submission.status, "replied")

    @mock.patch("leads.admin_views.send_reply", return_value=False)
    def test_failed_send_is_reported_and_status_unchanged(self, _send):
        self.assertEqual(self._reply().status_code, 502)
        self.submission.refresh_from_db()
        self.assertEqual(self.submission.status, "new")

    @mock.patch("leads.admin_views.send_reply", return_value=True)
    def test_invalid_input_is_rejected_without_sending(self, send):
        cases = [
            {"to": "not-an-email"},
            {"subject": "Line one\nBcc: victim@example.com"},
            {"subject": "x" * 201},
            {"submissionType": "bogus"},
            {"submissionId": "1; DROP TABLE"},
        ]
        for case in cases:
            self.assertEqual(self._reply(**case).status_code, 400, case)
        self.assertEqual(self._reply(submissionId=999999).status_code, 404)
        send.assert_not_called()
