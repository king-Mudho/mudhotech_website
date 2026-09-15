"""API tests for the submission and admin surfaces (docs/12-testing-plan.md).
Run with: python manage.py test"""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import AdminNotificationPreference

from .models import ContactSubmission, NewsletterSubscriber, QuoteRequest


class PublicSubmissionTests(TestCase):
    def setUp(self):
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
