# MudhoTech Solutions — Website & Admin Portal

Public marketing website and internal lead-management dashboard for **MudhoTech Solutions (Private) Limited**, a Zimbabwean registered ICT company based in Harare.

The site explains the company's services, captures leads through four forms, emails staff when a lead arrives, and gives them a private dashboard to triage, reply to, analyse, and export those leads.

---

## Contents

- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Running the tests](#running-the-tests)
- [Admin accounts](#admin-accounts)
- [Deployment](#deployment)
- [Before going live](#before-going-live)

---

## Quick start

**Prerequisites:** Node.js 18+ and Python 3.10+

The app is two services that run side by side. **You need both running** — the frontend alone will render pages, but no form will submit and the admin dashboard will not load data.

### 1. Backend (Django API) — port 8000

First time only:

```bash
cd backend && python -m venv .venv && .venv/Scripts/python.exe -m pip install -r requirements.txt && .venv/Scripts/python.exe manage.py migrate
```

Every time:

```bash
backend/.venv/Scripts/python.exe backend/manage.py runserver 8000
```

On macOS/Linux the interpreter is at `backend/.venv/bin/python` instead.

### 2. Frontend (Next.js) — port 3000

First time only:

```bash
cd frontend && npm install
```

Every time:

```bash
npm --prefix frontend run dev
```

Then open **http://localhost:3000**.

### Verify both are up

```bash
curl -s -o /dev/null -w "backend %{http_code}\n" http://localhost:8000/api/health/
```

A `200` means the API is reachable. If you get `000`, the backend is not running — start it before using any form.

---

## Architecture

Two services, with a deliberate rule: **the browser never talks to Django directly.**

```
Browser
   │  (same-origin fetch)
   ▼
Next.js Route Handlers  ── app/api/**
   │  • re-validate with the same zod schema the form used
   │  • check the honeypot
   │  • attach the admin session token (httpOnly cookie, never readable by JS)
   │  (server-to-server)
   ▼
Django REST API  ── backend/
   │  • validates again with DRF serializers
   │  • throttles anonymous submissions
   │  • enforces admin permissions on every endpoint
   ▼
SQLite  +  Resend (transactional email)
```

Everything user-supplied is validated twice — once in the browser for fast feedback, once on the server because client-side validation is a convenience, not a control.

**Admin access is gated in three independent layers**, so no single bypass grants access:

1. `frontend/middleware.ts` redirects unauthenticated `/admin/**` requests to the login page.
2. Django DRF `permission_classes` reject non-staff callers at the API boundary.
3. Each admin view re-checks `request.user.is_staff` in its own body, rather than trusting the layers above.

---

## Project structure

```
mudhotech_website/
├── frontend/                  # Next.js 15 (App Router) + TypeScript + Tailwind
│   ├── app/                   # Routes, layouts, and API Route Handlers
│   │   ├── api/               # Server-only proxy to the Django API
│   │   ├── admin/             # Lead dashboard (auth-gated)
│   │   └── */page.tsx         # Public marketing pages
│   ├── src/
│   │   ├── components/        # ui/ layout/ marketing/ forms/ admin/ seo/
│   │   ├── data/              # All site content as typed TS modules
│   │   ├── lib/               # API clients, zod schemas, helpers
│   │   └── types/
│   ├── public/images/         # Static imagery and brand logo
│   ├── tests/                 # unit/ (Vitest) and e2e/ (Playwright)
│   └── middleware.ts          # /admin/** auth gate
│
├── backend/                   # Django 6 + Django REST Framework
│   ├── config/                # settings, urls, wsgi
│   ├── leads/                 # Submissions, admin API, email sending
│   ├── accounts/              # Admin auth (JWT) + notification preferences
│   ├── requirements.txt
│   └── db.sqlite3             # gitignored
│
├── docs/                      # Original specification + build notes
└── logo/                      # Source brand asset
```

**Site content lives in `frontend/src/data/`, not inside the pages.** Services, blog posts, FAQ, company details, roadmap, and portfolio entries are typed TypeScript modules. To change copy, edit the data module — the pages, the PDF export, the sitemap, and the JSON-LD all read from the same source.

---

## Environment variables

### `frontend/.env`

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GA_MEASUREMENT_ID=
INTERNAL_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_*` values are visible in the browser — never put a secret in one. `INTERNAL_API_URL` is server-only and is what Route Handlers use to reach Django.

Google Analytics only loads if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set **and** the visitor accepted cookies. Declining means the script is never sent to the browser at all.

### `backend/.env`

```env
DJANGO_SECRET_KEY=change-me-in-production
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM_EMAIL=MudhoTech Forms <onboarding@resend.dev>
```

Copy `.env.example` in each folder as your starting point. Never commit a real `.env`.

### Email delivery

The provider is **auto-detected** from whichever credentials are present — pick one:

| You set | Provider used |
|---|---|
| `RESEND_API_KEY` | Resend HTTP API — best deliverability |
| `EMAIL_HOST` (+ user/password) | Plain SMTP — Gmail, or any domain mailbox |
| neither, with `DEBUG=true` | Console — the email is printed to the terminal |
| neither, with `DEBUG=false` | None — logged as an **ERROR**, never silently skipped |

For Gmail, use an **App Password**, not the account password (Google Account → Security → 2-Step Verification → App passwords):

```bash
EMAIL_HOST=smtp.gmail.com EMAIL_PORT=587 EMAIL_HOST_USER=you@gmail.com EMAIL_HOST_PASSWORD=app-password backend/.venv/Scripts/python.exe backend/manage.py runserver 8000
```

> **Right now no mail credentials are set**, so emails print to the terminal instead of being delivered. Submissions still save to the database and the admin dashboard still shows them. Add either option above to switch on real delivery — no code change needed.

Notifications go to every staff user who has an email address and hasn't switched that event off under **Admin → Settings**.

### Contact channels

Phone, WhatsApp, and email links are plain `tel:` / `wa.me` / `mailto:` links, so they work without any configuration — they open the visitor's dialler, WhatsApp, or mail app. They read from `frontend/src/data/company.ts`; change the number there and every link across the site updates. WhatsApp numbers are normalised to digits-only automatically (wa.me silently opens an empty chat if a `+` or space survives).

---

## Running the tests

```bash
npm --prefix frontend run lint && npm --prefix frontend run typecheck && npm --prefix frontend test
```

Django API tests — **run these from inside `backend/`**. Django discovers tests relative to the working directory, so invoking it from the repo root silently finds zero tests and still exits successfully:

```bash
cd backend && .venv/Scripts/python.exe manage.py test
```

End-to-end (Playwright). **Start the Django backend first** — these tests submit real forms and log into the admin:

```bash
npm --prefix frontend run e2e
```

The public endpoints are rate-limited to 10 submissions/hour, which a full e2e run exhausts. Start the backend with raised limits when testing — production keeps the defaults:

```bash
THROTTLE_SUBMISSION=500/hour THROTTLE_ANON=500/hour backend/.venv/Scripts/python.exe backend/manage.py runserver 8000
```

A `429` with "Request was throttled" from a form is the limiter doing its job, not a bug.

Playwright builds and serves a production bundle itself. Run it against an already-running server with `PLAYWRIGHT_BASE_URL=http://localhost:3000` if you prefer.

Current state: **54 unit/component tests, 13 end-to-end journeys, 15 Django API tests**, zero lint errors, clean typecheck.

---

## Admin accounts

There is no public sign-up. The dashboard lives at `/admin` and requires a Django staff account.

```bash
backend/.venv/Scripts/python.exe backend/manage.py createsuperuser
```

A development account (`admin` / `DevAdmin123!`) exists in the local SQLite database. **It is a development credential — do not carry it into production.**

---

## Deployment

The two services deploy separately.

**Frontend → Vercel.** Connect the repo, set the root directory to `frontend`, add the environment variables above, and deploy.

**Backend → needs a host that runs long-lived Python processes** (Railway, Render, Fly.io, or a VPS). Vercel cannot host it.

Two things to settle before production:

- **SQLite is a real risk in production.** Many managed hosts have no persistent disk, and SQLite handles concurrent writes poorly. Switching to Postgres is a `DATABASES` settings change plus a migration run — worth doing if the host does not guarantee a persistent volume.
- **Lock down Django:** set `DJANGO_DEBUG=false`, a strong `DJANGO_SECRET_KEY`, the real domain in `DJANGO_ALLOWED_HOSTS`, and the deployed frontend origin in `CORS_ALLOWED_ORIGINS`.

---

## Before going live

Details and the full launch checklist are in [`docs/BUILD-REPORT.md`](docs/BUILD-REPORT.md); the outstanding business decisions are in [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md).

The short version — these are **not** code tasks, they need answers from the business:

1. **Pick one canonical domain** (`.co.zw` vs `.com`) and set `NEXT_PUBLIC_SITE_URL` to match exactly.
2. **Confirm the permanent contact email**, then verify that domain with Resend so mail sends from a real address.
3. **Supply the company registration / VAT number** — currently blank in `frontend/src/data/company.ts`.
4. **Replace all placeholder content** — team profiles, testimonials, partner logos, portfolio projects, repair case studies, and gallery photography are illustrative stock, not real claims. Find every instance with:

   ```bash
   grep -rn "TODO(content)" frontend/src frontend/app
   ```

   These must not be presented as genuine to procurement or investor audiences.
5. **Set a real GA4 measurement ID** if you want analytics.
