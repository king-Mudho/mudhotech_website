# Open Questions — Needed From the Site Owner Before Launch

Verbatim from `docs/01-project-overview.md §8` ("Information Still Needed Before Launch"). These are not guessed anywhere in the codebase — every place they'd be needed uses a clearly marked placeholder that references this file.

1. **Final canonical domain** (`.co.zw` vs `.com`) — `docs/01-project-overview.md` §4 lists `www.mudhotech.co.zw` as primary but also references `mudhotech.com` elsewhere; one canonical domain must be picked before launch. Affects `NEXT_PUBLIC_SITE_URL`, canonical URLs, JSON-LD, sitemap, Vercel domain config, and any redirect from the non-canonical domain.
2. **Permanent contact email** (Gmail `mudhotechsolutions@gmail.com` vs a domain email) — affects the Resend "from" sender identity (doc 13 §8 requires swapping to a verified domain address before go-live), footer/contact-card content, and JSON-LD `email` field.
3. **Company registration number / VAT number** — needed for the footer and the letterhead (`docs/06-functional-modules.md §M10`). Currently blank placeholders in `src/data/company.ts` (`registrationNumber`, `vatNumber`).
4. **Real team member names/photos, testimonials, partner logos, and portfolio/repair case studies** — current placeholders must not go live as real claims (`docs/07-content-data-model.md §9`). Marked `// TODO(content):` throughout the codebase; see that grep pattern for every instance.

## Also Needed to Make the Forms Functionally Real (not blocking code structure, but blocking a genuine end-to-end test)

Superseded by `docs/ARCHITECTURE-DEVIATION.md` (Supabase removed, Django + SQLite backend). `SUPABASE_SERVICE_ROLE_KEY` no longer applies to anything.

5. **`RESEND_API_KEY`** — required (Django-side now, not Supabase Edge Function-side) for `notify_submission` / `send_reply` to actually send email. Not present in this checkout — until it's set, email sending is skipped, which is exactly the "no-op success state" the prompt calls out as a bug to fix. Needed to verify real delivery, not just the code path.
6. **Where the Django API is hosted in production** — Vercel runs Next.js natively but does not run long-lived Python/Django processes, so the Django REST API needs a separate host (e.g. Railway, Render, Fly.io, a VPS). Not decided yet; affects `NEXT_PUBLIC_API_URL` / the Next.js → Django server-to-server URL, and whether SQLite (single-file, not safely shared across serverless instances) is even viable in production vs. needing a swap to Postgres at deploy time. **Flagging this explicitly: SQLite is fine for local dev, but most production PaaS hosts either don't offer persistent disk or make SQLite risky under concurrent writes — this should be confirmed with the site owner before go-live, not assumed.**

Every placeholder in code that stands in for one of items 1–4 above must reference this file (`// TODO(content): see docs/OPEN-QUESTIONS.md #N`).
