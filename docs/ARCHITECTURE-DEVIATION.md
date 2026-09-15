# Architecture Deviation — Supabase Removed, Replaced With Django + SQLite

`docs/01-13` mandate Supabase (Postgres + Auth + Edge Functions) as the backend — `CLAUDE_CODE_PROMPT.md §1` even calls this non-negotiable. The site owner explicitly overrode that during Stage 0/1 orientation: **Supabase is removed entirely**; the backend is now **Django (Django REST Framework) + SQLite**, as a separate service, with **Next.js remaining the frontend**, calling the Django API instead of Supabase. This doc is the record of that decision and how every doc that assumed Supabase is reinterpreted. It supersedes the Supabase-specific parts of `docs/02`, `03`, `04`, `05`, `08`, and the Supabase references in `06`, `10`, `13`. Everything else in `docs/01-13` (pages, content model, design system, coding standards, testing intent) still applies unchanged.

## Why this is recorded here instead of silently reinterpreted
Per `CLAUDE_CODE_PROMPT.md §4`, deviations from the docs must be "explicitly called out and justified" in the final report. This is the largest one in the build, so it gets its own file rather than being buried in `MIGRATION-NOTES.md`.

## New Architecture

```
mudhotech_website/
├── app/, src/...          # Next.js frontend (unchanged role — public pages, admin UI, Route Handlers)
└── backend/                # NEW — Django REST API, replaces Supabase entirely
    ├── manage.py
    ├── config/              # Django project settings/urls/wsgi
    ├── leads/                # app: ContactSubmission, QuoteRequest, SoftwareServiceRequest, NewsletterSubscriber
    ├── accounts/              # app: AdminNotificationPreference, admin auth (Django's built-in User + is_staff)
    └── db.sqlite3            # gitignored — local SQLite file
```

- **Database:** SQLite (`backend/db.sqlite3`), managed by Django's own ORM + migrations (`python manage.py makemigrations` / `migrate`) — replaces the Supabase Postgres + SQL migration files under `supabase/migrations/`.
- **Auth / RBAC:** Django's built-in `auth.User` with `is_staff=True` standing in for the `admin` role (doc 05's `app_role` enum collapses to this single flag — there is no public sign-up in v1 either way, so `user`/`authenticated` stays unused exactly as doc 05 already specified). No separate `user_roles` table is needed; `is_staff` is the role check.
- **RLS equivalent:** SQLite/Django has no Postgres RLS. The equivalent protection is DRF `permission_classes` on every view (`IsAdminUser` for anything reading/mutating leads) plus the same **three-layer model** doc 05 describes, reinterpreted:
  - Layer 1 — `middleware.ts` in Next.js still gates `/admin/**` by checking a session cookie.
  - Layer 2 — Django DRF permission classes on every endpoint (the "always enforced at the data layer" layer, replacing Postgres RLS).
  - Layer 3 — Every Django admin view still independently re-checks `request.user.is_staff` (defense in depth, same principle as doc 05 §2 Layer 3), not just `@login_required`.
- **`private.has_role()` equivalent:** N/A — collapses to `request.user.is_authenticated and request.user.is_staff`, checked directly in DRF permission classes. There is nothing to scope by `user_id` the way doc 05 §3 warns about, because Django's session/token already resolves to exactly one user — the bug class doc 05 warns about (unscoped role lookup returning multiple rows) doesn't exist in this model.
- **Session between Next.js and Django:** Django issues a JWT pair (`djangorestframework-simplejwt`) from a `/api/auth/login/` endpoint. A Next.js Route Handler (`/app/api/admin/login`) calls that endpoint server-side and sets the access token as an **httpOnly, secure cookie** on the Next.js response — the token itself never reaches client-side JS. `middleware.ts` checks for the presence/validity of that cookie. Admin Route Handlers forward it as a `Bearer` token to Django on every request (Layer 3 re-verification happens Django-side on every call, not just by trusting the cookie's presence).
- **Email:** Resend is still the transactional email provider (doc 02 §3, doc 13 keep this), but it's called directly from Django (`leads/emails.py`, using `requests`) instead of from a Supabase Edge Function. `notify-submission` and `send-reply` become two Django functions with the same responsibilities: `notify_submission(submission)` (resolve admin recipients via `AdminNotificationPreference`, send via Resend, HTML-escaped) and `send_reply(to, subject, message, submission)` (admin-only, called from a DRF `AdminReplyView`).
- **Route Handlers stay the front door:** doc 03's core principle — "browser code never talks to the backend's privileged layer directly" — is preserved. Public forms still post to Next.js Route Handlers (`/app/api/submissions/*`), which re-validate with the shared `zod` schema and then forward server-to-server to the Django API (which does its own re-validation, rate limiting via DRF throttle classes, and honeypot check). Two validation layers, same as the original doc 08 design, just with Django instead of Supabase on the far end.
- **CORS:** `django-cors-headers`, locked to the production Next.js origin (doc 05 §6 requirement, unchanged intent).
- **Rate limiting:** DRF's `AnonRateThrottle` on public endpoints, configurable scope per endpoint — replaces the "basic IP-based limiter" doc 05 describes generically.

## Table → Model Mapping

| Doc 04 table | Django model | Notes |
|---|---|---|
| `contact_submissions` | `leads.ContactSubmission` | Same fields; `status` choices `new`/`read`/`replied`. |
| `quote_requests` | `leads.QuoteRequest` | Same fields. |
| `newsletter_subscribers` | `leads.NewsletterSubscriber` | Same fields; `email` unique. |
| (software service request — doc 08 tags it `[Software Service Request]` inside contact) | `leads.ContactSubmission` with `source="software_service"` | Kept as a tagged contact submission per doc 08 §3, not a separate table — matches the original design intent. |
| `user_roles` / `app_role` enum | `auth.User.is_staff` | Collapsed, see above. |
| `profiles` | `auth.User` (`email` field already built in) | No separate table needed — Django's User model already has `email`. |
| `admin_notification_preferences` | `accounts.AdminNotificationPreference` | Same shape: `user` FK, `event_type`, `enabled`, unique together. |

## What stays exactly as specified in docs 01-13
Page inventory (06), content data model (07), design tokens/typography/components (09), project structure conventions for the **frontend** (10, `app/`/`src/` layout unchanged), coding standards (11), the *intent* of the testing plan (12 — Playwright/Vitest targets unchanged, only the mocked backend changes from "mocked Supabase client" to "mocked Django API"), and SEO/compliance/deployment content (13) — except deployment now has two services to provision (Vercel for Next.js, plus a host for the Django API — see `docs/OPEN-QUESTIONS.md` for the hosting decision still needed).

## Consequence for `docs/OPEN-QUESTIONS.md`
Items 5–6 (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY) are revised: the Supabase key is no longer applicable at all; `RESEND_API_KEY` is still needed, now as a Django-side secret. A new open item is added: where the Django API is hosted in production (Vercel serves Next.js natively but does not run long-lived Python/Django processes — needs a separate host, e.g. Railway/Render/Fly.io).
