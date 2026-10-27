import os
import subprocess
import sys
from pathlib import Path

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import RevokedAccessToken

BACKEND_DIR = Path(__file__).resolve().parent.parent


class LoginThrottleTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        get_user_model().objects.create_user("admin", "admin@example.com", "pw12345!", is_staff=True)

    def _login(self, password: str, forwarded_for: str):
        return self.client.post(
            "/api/auth/login/",
            {"username": "admin", "password": password},
            format="json",
            HTTP_X_FORWARDED_FOR=forwarded_for,
        )

    def test_brute_force_is_limited_per_ip_without_locking_out_others(self):
        for _ in range(10):
            self.assertEqual(self._login("wrong", "198.51.100.7").status_code, 401)
        self.assertEqual(self._login("wrong", "198.51.100.7").status_code, 429)

        self.assertEqual(self._login("pw12345!", "203.0.113.9").status_code, 200)


class ProductionSettingsGuardTests(TestCase):
    """settings.py must refuse to boot in production mode with a weak key.
    Run in a subprocess because settings are only evaluated once per process."""

    def _import_settings(self, **env):
        # Explicit variables win over backend/.env (load_dotenv never overrides).
        clean = {k: v for k, v in os.environ.items() if not k.startswith("DJANGO_")}
        return subprocess.run(
            [sys.executable, "-c", "import config.settings"],
            cwd=BACKEND_DIR,
            env={**clean, **env, "PYTHONDONTWRITEBYTECODE": "1"},
            capture_output=True,
            text=True,
        )

    def test_rejects_placeholder_key_when_debug_off(self):
        result = self._import_settings(DJANGO_DEBUG="false", DJANGO_SECRET_KEY="change-me-in-production")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("DJANGO_SECRET_KEY", result.stderr)

    def test_accepts_strong_key_when_debug_off(self):
        result = self._import_settings(DJANGO_DEBUG="false", DJANGO_SECRET_KEY="x7Qp-" * 12)
        self.assertEqual(result.returncode, 0, result.stderr)


class LogoutRevocationTests(TestCase):
    """Uses real tokens from the login endpoint: force_authenticate would
    bypass the authentication class under test."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()
        get_user_model().objects.create_user("admin", "admin@example.com", "pw12345!", is_staff=True)

    def _token(self) -> str:
        response = self.client.post("/api/auth/login/", {"username": "admin", "password": "pw12345!"}, format="json")
        self.assertEqual(response.status_code, 200)
        return response.json()["access"]

    def _get(self, path: str, token: str):
        return self.client.get(path, HTTP_AUTHORIZATION=f"Bearer {token}")

    def _logout(self, token: str):
        return self.client.post("/api/auth/logout/", HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_logged_out_token_is_rejected_everywhere(self):
        token = self._token()
        self.assertEqual(self._get("/api/auth/me/", token).status_code, 200)
        self.assertEqual(self._get("/api/admin/submissions/?type=contact", token).status_code, 200)

        self.assertEqual(self._logout(token).status_code, 200)

        self.assertEqual(self._get("/api/auth/me/", token).status_code, 401)
        self.assertEqual(self._get("/api/admin/submissions/?type=contact", token).status_code, 401)
        self.assertEqual(self._logout(token).status_code, 401)

    def test_other_sessions_stay_signed_in(self):
        laptop, phone = self._token(), self._token()
        self._logout(laptop)
        self.assertEqual(self._get("/api/auth/me/", phone).status_code, 200)

    def test_logout_requires_a_valid_token(self):
        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 401)
        self.assertEqual(self._logout("not-a-jwt").status_code, 401)

    def test_logout_prunes_revocations_that_have_expired(self):
        RevokedAccessToken.objects.create(jti="long-gone", expires_at=timezone.now() - timedelta(minutes=1))
        self._logout(self._token())
        self.assertFalse(RevokedAccessToken.objects.filter(jti="long-gone").exists())
        self.assertEqual(RevokedAccessToken.objects.count(), 1)

    def test_revocation_is_kept_until_the_token_expires(self):
        self._logout(self._token())
        revoked = RevokedAccessToken.objects.get()
        remaining = revoked.expires_at - timezone.now()
        self.assertGreater(remaining, timedelta(hours=7))
        self.assertLessEqual(remaining, timedelta(hours=8))
