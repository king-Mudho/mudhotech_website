"""
Django settings for the MudhoTech Solutions API.

Backend for the Next.js frontend in ../frontend. Uses SQLite locally.

The browser never calls this service directly: all traffic arrives
server-to-server from Next.js Route Handlers, which hold the session
token and re-validate input before forwarding. See the README's
Architecture section.
"""

import os
from datetime import timedelta
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

# DEBUG fails closed: a missing or mistyped DJANGO_DEBUG means production
# behaviour, never a traceback page. Local development opts in through
# backend/.env (copied from .env.example, which sets it to true).
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"

_DEV_SECRET_KEY = "django-insecure-dev-only-key-change-me"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "").strip() or _DEV_SECRET_KEY
if not DEBUG and (SECRET_KEY == _DEV_SECRET_KEY or SECRET_KEY == "change-me-in-production" or len(SECRET_KEY) < 50):
    # The JWTs that gate the admin dashboard are signed with this key. With
    # the public dev default, anyone can mint a staff token.
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY must be set to a long random value when DJANGO_DEBUG is false. Generate one with: "
        'python -c "import secrets; print(secrets.token_urlsafe(64))"'
    )
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "leads",
    "accounts",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Cache ---------------------------------------------------------------
# Backs the DRF rate limits. Django's default LocMemCache is per-process, so
# under Gunicorn's three workers each one kept its own counter and the real
# limit was three times the configured one, depending on which worker a
# request happened to land on. A file cache is shared by every worker on the
# box and needs no extra service or migration.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": os.environ.get("DJANGO_CACHE_DIR", str(BASE_DIR / ".django_cache")),
    }
}

# --- Logging -------------------------------------------------------------
# Without this, the INFO lines in leads/emails.py ("Sent via Resend to ...")
# are dropped, so the journal only ever shows failures and there is no way to
# confirm a notification actually went out.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {
        "leads": {"handlers": ["console"], "level": os.environ.get("DJANGO_LOG_LEVEL", "INFO"), "propagate": False},
    },
}

# --- CORS: locked to the Next.js origin(s), never "*" (docs/05-security-rbac.md §6) ---
CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]
CORS_ALLOW_CREDENTIALS = True

# --- DRF ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # SimpleJWT plus a check against tokens revoked at logout.
        "accounts.authentication.RevocableJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    # Configurable so an e2e run isn't blocked by the production limit.
    # The defaults ARE the production values — override only in local/CI
    # environments, never on the live deployment.
    "DEFAULT_THROTTLE_RATES": {
        "anon": os.environ.get("THROTTLE_ANON", "20/hour"),
        "user": os.environ.get("THROTTLE_USER", "1000/day"),
        "submission": os.environ.get("THROTTLE_SUBMISSION", "10/hour"),
        "login": os.environ.get("THROTTLE_LOGIN", "10/hour"),
    },
    # Every request reaches Django from the Next.js server on loopback, so
    # REMOTE_ADDR is always 127.0.0.1. The Route Handlers forward the real
    # visitor IP as X-Forwarded-For (src/lib/api/server.ts); trusting exactly
    # one hop makes DRF key each rate limit on that IP. Without it, every
    # visitor shared ONE bucket: ten form submissions an hour for the whole
    # site, and a single attacker could lock everyone out of the admin login.
    # Safe only because Django binds to 127.0.0.1 (deploy/mudhotech-api.service).
    "NUM_PROXIES": int(os.environ.get("DRF_NUM_PROXIES", "1")),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": True,
}

# --- Transactional email -------------------------------------------------
# Server-only secrets; never exposed to the frontend.
#
# Provider is auto-detected from whichever credentials are present, so a
# working setup needs no extra configuration:
#   RESEND_API_KEY set                -> resend
#   EMAIL_HOST set                    -> smtp  (Gmail, a domain mailbox, anything)
#   neither, and DEBUG on             -> console (printed to the terminal)
#   neither, and DEBUG off            -> none   (logged as an ERROR, never silent)
# Set EMAIL_PROVIDER explicitly to override the detection.
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "MudhoTech Forms <onboarding@resend.dev>")

EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "true").lower() == "true"
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", "false").lower() == "true"
EMAIL_TIMEOUT = 15

DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL") or EMAIL_HOST_USER or RESEND_FROM_EMAIL


def _detect_email_provider() -> str:
    explicit = os.environ.get("EMAIL_PROVIDER", "").strip().lower()
    if explicit:
        return explicit
    if RESEND_API_KEY:
        return "resend"
    if EMAIL_HOST:
        return "smtp"
    return "console" if DEBUG else "none"


EMAIL_PROVIDER = _detect_email_provider()

if EMAIL_PROVIDER == "console":
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
