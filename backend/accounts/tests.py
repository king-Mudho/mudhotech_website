import os
import subprocess
import sys
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

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
