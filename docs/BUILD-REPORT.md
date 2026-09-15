# Build Report — MudhoTech Solutions Website

Final report for the rebuild specified in `docs/CLAUDE_CODE_PROMPT.md`, covering all 13 stages.

**Headline:** the site is functionally complete and verified end-to-end. Every page in the spec is built, every form writes a real database row, and the admin dashboard works against a real backend. Two things are **not** done and are called out plainly below: the pre-commit hook (needs a git repo) and live email delivery (needs a Resend key).

---

## 1. The One Large Deviation: Supabase → Django + SQLite

`docs/CLAUDE_CODE_PROMPT.md §1` lists Supabase as non-negotiable. **The site owner overrode this during orientation**, instructing that Supabase be removed entirely and replaced with **Django REST Framework + SQLite**, keeping Next.js as the frontend (two services).

This was not a judgement call I made — it was an explicit instruction, recorded in full in **`docs/ARCHITECTURE-DEVIATION.md`**, which maps every Supabase concept onto its Django equivalent and explains what was preserved:

| Doc requirement | How it is met without Supabase |
|---|---|
| Postgres + RLS | SQLite + DRF `permission_classes` on every endpoint |
| `app_role` enum + `user_roles` + `private.has_role()` | Django `auth.User.is_staff` (the unscoped-role-lookup bug doc 05 §3 warns about cannot occur — the session resolves to exactly one user) |
| Three-layer protection (05 §2) | **Preserved.** Layer 1 `middleware.ts`; Layer 2 DRF `IsAdminStaff`; Layer 3 `require_admin()` re-check inside each view body |
| Edge Functions `notify-submission` / `send-reply` | `backend/leads/emails.py` — same responsibilities, **plus the HTML-escaping and CORS-lock fixes the legacy versions were missing** |
| Route Handlers as the only public entry point (03 §7) | **Preserved.** Browser → Next.js Route Handler → Django. The browser never calls Django directly. |
| Rate limiting + honeypot (05 §6) | DRF `SubmissionRateThrottle` (10/hour anon) + `website` honeypot checked on both sides |

Everything else in docs 01–13 — page inventory, content model, design tokens, coding standards, testing intent, SEO/compliance — was implemented as written.

**Second, smaller deviation:** I built the content data layer (Stage 7) before the pages (Stage 6), matching doc 01 §9's own roadmap ordering, to avoid writing every page twice.

---

## 2. Stage-by-Stage Status

| Stage | Status | Evidence |
|---|---|---|
| 1 — Project Overview | Done | `docs/OPEN-QUESTIONS.md` created from §8 verbatim |
| 2 — Technology Stack | Done | Next.js 15 App Router + TS strict + Tailwind + shadcn/ui; Django+DRF+SQLite scaffolded; bun lockfiles and Vite tooling deleted; both dev servers verified live |
| 3 — System Architecture | Done | `src/lib/api/{client,server}.ts`, `middleware.ts`, `src/types/api.ts`; typechecks clean |
| 4 — Database Design | Done | 4 models + migrations applied; `manage.py check` clean; anon read of leads returns **401**, admin JWT returns **200** (both verified by request) |
| 5 — Security & RBAC | Done | Login→cookie→access and logout→redirect round-trip verified in a real browser; throttle + honeypot in place |
| 6 — Functional Modules | Done | All 16 modules (M1–M16) built; every route renders; admin tabs verified by screenshot |
| 7 — Content & Data Model | Done | 8 typed modules; pages import from them, no duplicated prose |
| 8 — API Design | Done | 4 public + 6 admin endpoints; shared zod schemas used client- and server-side; **verified: real row written, honeypot writes nothing, invalid input returns per-field 400** |
| 9 — UI/UX Design System | Done | HSL tokens, `next/font` single load path, `PageHero`/`Section`/`ServiceCard`/`SectionBreak`, custom button variants; light/dark via tokens |
| 10 — Project Structure | Done | Entire legacy tree deleted; tsconfig/eslint exclude lists emptied; `tsc --noEmit` clean with **no** exclusions |
| 11 — Coding Standards | **Partial** | ESLint 9 flat config + Prettier + lint-staged configured, **0 lint errors**. Husky pre-commit hook **not installed — see §4.** |
| 12 — Testing | Done | 54 Vitest + 13 Playwright + 15 Django tests, all passing. Lighthouse run — see §3. |
| 13 — SEO / Compliance / Deploy | Done | `generateMetadata` per route, dynamic sitemap (verified to include all 4 blog slugs), robots.txt, JSON-LD, GA4 consent-gated **server-side**, security headers + CSP |

### Test totals
- **54** Vitest unit/component tests
- **13** Playwright e2e (all 7 spec'd journeys plus extras)
- **15** Django API tests
- `npm run lint`: **0 errors** (4 warnings, all in generated shadcn files)
- `npx tsc --noEmit`: **clean**

---

## 3. Lighthouse — Honest Numbers

Final run against a production build (`next build && next start`):

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 81–85 | **100** | **100** | **100** |
| `/web-software` | 82–84 | **99** | **100** | **100** |
| `/blog` | 81–91 | **100** | **100** | **100** |

**Accessibility, Best Practices, and SEO meet the ≥90 target with room to spare** — Lighthouse reports zero accessibility failures on `/` and `/blog`.

**Performance does not reliably clear 90, and I am reporting the range rather than a single flattering number.** Identical builds measured up to 10 points apart run-to-run, so part of the spread is noise from a developer machine running builds and test suites concurrently. It is genuinely better than it was, but it is not at target.

Measured improvement on `/` over the course of the work:

| Metric | Before | After |
|---|---|---|
| Largest Contentful Paint | 5.1 s | **3.9 s** |
| Total Blocking Time | 290 ms | **130 ms** |
| Speed Index | 4.7 s | **2.5 s** |

What actually landed:
- **Replaced the photographic hero with a CSS gradient system** (`src/components/layout/HeroBackground.tsx`). A viewport-filling `<img>` was the LCP element and the single slowest thing on the page; gradients cost zero bytes and paint immediately. This also fixed the legibility complaint that prompted it — see §9.
- Removed the opacity-0 entrance animation from the LCP headline, which was deferring the largest paint by the animation's full duration
- Code-split below-fold framer-motion/embla sections off the homepage critical path
- **Favicon 36 KB → 3 KB** (it was a full-resolution logo being served as an icon)
- **Font files 9 → 6** by requesting only the weights the markup actually uses
- Service-card imagery made genuinely lazy, quality-tuned
- Fixed every WCAG AA contrast failure by darkening `--accent`, adding `--hero-accent` for text over dark hero surfaces (the darkening alone would have broken those), and correcting a footer heading-order violation

**Recommendation:** re-measure on a Vercel preview deployment before treating this as a blocker — doc 12 §4 anticipates exactly that. The remaining weight is the JS bundle (framer-motion, recharts, embla), which doc 09 §4 mandates; if it still falls short on real hosting, deferring `recharts` off the public bundle is the next lever.

---

## 4. What Is NOT Done

**1. Husky pre-commit hook (Stage 11).** This project is not a git repository (`git rev-parse` fails). Husky installs its hooks into `.git/hooks`, so it cannot be set up. Everything the hook would run is configured and working (`lint-staged` block in `package.json`, Prettier config, ESLint passing). I did not run `git init` because creating version control history — and the first commit — is a decision that should be yours, not a side effect of a build step.

To finish this stage:
```bash
git init && npm run prepare && npx husky add .husky/pre-commit "npx lint-staged"
```
`.gitignore` is already correct and covers `.env*.local`, `node_modules`, `.next`, and `backend/db.sqlite3`, so the first commit will be clean.

**2. Live email delivery.** `RESEND_API_KEY` is not set. The full send path is built and escaped, but with no key `backend/leads/emails.py` logs a warning and skips sending. Until a key is set, form submissions create database rows but **do not send notification emails** — which is precisely the "no-op success state" the build prompt calls out as a bug. The code path is real; only the credential is missing.

**3. Django API production hosting is undecided** — see `docs/OPEN-QUESTIONS.md` #6. This matters more than it sounds: Vercel does not run long-lived Python processes, so the backend needs a separate host, and **SQLite is a genuine risk in production** (most PaaS hosts lack persistent disk, and SQLite handles concurrent writes poorly). Confirm this before go-live; a swap to Postgres is a settings-level change if needed.

---

## 5. Open Questions (full contents of `docs/OPEN-QUESTIONS.md`)

Business facts that were **not guessed anywhere in the code** — each is a marked placeholder pointing at that file:

1. **Final canonical domain** (`.co.zw` vs `.com`) — affects `NEXT_PUBLIC_SITE_URL`, canonical URLs, JSON-LD, sitemap, Vercel domain config.
2. **Permanent contact email** (Gmail vs domain email) — affects the Resend verified sender, footer, contact cards, JSON-LD.
3. **Company registration / VAT number** — blank in `src/data/company.ts`; needed for footer and letterhead.
4. **Real team, testimonials, partner logos, portfolio and repair case studies** — all currently placeholder, marked `// TODO(content):`. Grep for that string to find every instance. **These must not go live as real claims to procurement or investor audiences.**
5. **`RESEND_API_KEY`** — see §4 above.
6. **Django API production host** — see §4 above.

---

## 6. Legacy Files — All Removed

Nothing from the legacy build remains. Deleted only after verified replacements existed and passed their tests, per the prompt's incremental rule:

- `src/pages/` (15 React Router pages) → `app/**/page.tsx`
- All 17 top-level `src/components/*.tsx` → rewritten under `layout/`, `marketing/`, `admin/`, `forms/`
- `src/integrations/supabase/`, `supabase/` (migrations, edge functions, config) → `backend/`
- `AnimatedRoutes.tsx`, `SEOHead.tsx`, `NavLink.tsx`, `GoogleAnalytics.tsx` → `generateMetadata`, Next `<Link>`, `@next/third-parties`
- Duplicate toast system (`use-toast.ts`, `ui/toast.tsx`, `ui/toaster.tsx`) → Sonner only, per doc 09 §6
- `vite.config.ts`, `vitest.config.ts` (Vite form), `index.html`, `tsconfig.app.json`, `tsconfig.node.json`, `bun.lock`, `bun.lockb`, `lovable-tagger`, unused `ui/sidebar.tsx`, `src/assets/` (moved to `public/images/`)
- Stale `public/robots.txt` and `public/sitemap.xml` — these were **shadowing the generated routes** and silently breaking them

**No legacy file was left behind for lack of a replacement.**

---

## 7. Launch Checklist (doc 13 §11)

| Item | Status |
|---|---|
| Canonical domain decided and configured | **Blocked on client** (Open Question #1) |
| Real GA4 measurement ID set | **Blocked on client** — wiring done and consent-gated; `NEXT_PUBLIC_GA_MEASUREMENT_ID` empty, so GA renders nothing |
| `.env` not committed; secrets only in host settings | Done — `.gitignore` covers `.env*.local`; no secrets in code or `NEXT_PUBLIC_*` |
| All forms submit successfully end-to-end | **Done for the database path** (verified by request and by e2e). Email path blocked on `RESEND_API_KEY` |
| Admin login works; role checks correctly scoped | Done — verified 401 anon / 200 admin, and non-staff login rejected by test |
| `sitemap.xml` includes all blog slugs | Done — verified in browser and asserted by an e2e test |
| Resend sender is a verified domain address | **Blocked on client** (Open Questions #2, #5) |
| CORS locked to production origin | Done — `CORS_ALLOWED_ORIGINS`, never `*` |
| Rate limiting active on public POST endpoints | Done — `SubmissionRateThrottle`, 10/hour anon |
| Lighthouse ≥ 90 on key pages | **A11y / Best Practices / SEO: yes. Performance: not reliably — see §3** |
| Real team/testimonial/partner/portfolio content | **Blocked on client** (Open Question #4) |

---

## 9. Visual Design Revision (post-build, at owner's request)

The owner asked for a better hero background and a site that "looks more visible". Rather than swapping in a different stock photo, the hero photography was **replaced with a designed gradient system** — `src/components/layout/HeroBackground.tsx`, used by the homepage hero and every `PageHero`.

Reasoning, in order of weight:
1. **Legibility** — the original circuit-board photo competed with the headline for attention, which was the actual complaint. A controlled gradient gives consistent, WCAG-safe contrast for white text across the whole surface.
2. **Speed** — the full-bleed photo *was* the LCP element. Removing it is what moved LCP from 5.1 s to 3.9 s.
3. **Ownership** — the hero photography was placeholder stock (`docs/OPEN-QUESTIONS.md` #4). The gradient system is owned outright, removing heroes from that open licensing question entirely.

Composition: deep-navy vertical gradient, two soft accent glows (brand blue + cyan) for colour, and a fine masked grid that reads as "engineering" without photographic noise. Each page passes an optional `hueShift` so sections feel distinct while staying on-brand.

Also changed:
- **Brand logo** (`MudhoTech Logo.png`) now used in the navbar and footer, replacing the "M" tile and "MudhoTech" text mark. Its white background was made transparent programmatically so it can invert to white over dark surfaces and show in brand blue on the light scrolled navbar. It is also the favicon.
- Blog post heroes keep their photo — there the image is editorial content — but with a directional gradient instead of a flat dark wash, so the photo stays visible while the headline stays readable.
- Lighter page surface (`--background`), cool-tinted alternating sections (`--secondary`), and card shadow/hover depth so content separates clearly from the page.

`src/components/layout/SectionBreak.tsx` still uses photography deliberately — mid-page parallax bands are where photos add value without fighting a headline.

**Still placeholder:** portfolio/team/testimonial imagery and the Unsplash gallery photos (Open Question #4). Only the *hero* imagery question is now closed.

---

## 10. Repository Restructure & Final Cleanup

At the owner's request the repo was reorganised into two clearly separated services, and the last Supabase traces removed.

**Layout** — the Next.js app moved from the repo root into `frontend/`, alongside the existing `backend/`:

```
mudhotech_website/
├── frontend/   # Next.js app, its own package.json, configs, tests, node_modules
├── backend/    # Django API, its own venv and requirements.txt
├── docs/       # Specification and build notes
├── logo/       # Source brand asset
└── README.md
```

Updated to match: `.claude/launch.json`, root `.gitignore` (now per-service), `tsconfig.json`, `eslint.config.js`, `.prettierignore`.

**Supabase is fully gone.** `grep -rn -i supabase` across `frontend/src`, `frontend/app`, and `backend` returns nothing. Only the historical spec documents (`docs/01`–`13`) still mention it — those are the original brief and are deliberately preserved as the record of what was asked for; `docs/ARCHITECTURE-DEVIATION.md` explains the override.

**README rewritten.** The previous 754-line file still described the deleted Vite + Supabase app. Replaced with a guide to the actual project: prerequisites, first-time setup and daily run commands for both services, a health check to confirm the backend is up, architecture, structure, env vars, test commands, and deployment.

**Two real bugs found and fixed during this pass:**

1. **A broken image was live on the Portfolio gallery.** One Unsplash URL had started returning 404 and rendered as an empty tile — no console error, no failing test. Every URL is now verified to return HTTP 200 before use, and `tests/e2e/gallery.spec.ts` asserts `naturalWidth > 0` on every gallery image so a future dead link fails the build rather than shipping silently.
2. **The documented Django test command found zero tests and still exited successfully.** `backend/.venv/.../python.exe backend/manage.py test` reports "NO TESTS RAN" because Django discovers tests relative to the working directory. Corrected everywhere to `cd backend && .venv/Scripts/python.exe manage.py test`, which runs all 15.

**Test-suite reliability also fixed.** The admin e2e tests seeded a fixed-name record and never cleaned up, so a second run hit multiple matching rows and failed on locator ambiguity — a test bug that looked like a product bug. Seeded records now carry a per-run unique identity, and the admin spec runs serially since those tests share one account and one set of rows. Verified stable across repeat runs.

**Gallery expanded** from 12 images to **30 — five in each of the six categories** (Laptops, Desktops, Smartphones, Hardware Repairs, Software Setup, Networking), confirmed in-browser as 30 loaded / 0 broken. Still placeholder stock pending Open Question #4.

---

## 11. Light Redesign (final visual pass)

The owner reported the dark navy heroes were hard to read and asked for the brightness of the gallery photos, plus a more modern look, less copy on service cards, and better-fitting cards.

**The heroes were inverted from dark to light.** This was the root fix, not a tweak: white text on navy caps out at moderate contrast, while navy text on a near-white surface is several times higher. Dark surfaces were also what made every element on top fight to be seen. The hero is now a near-white base with soft accent washes and a faint grid; colour comes from the accent, not a flooded background.

Everything downstream of that decision:

- **Navbar** no longer swaps to white text and an inverted logo over a dark hero — it stays light throughout, with scrolling adding only a separating shadow.
- **Homepage service cards** dropped the flat `bg-hero/75` wash that dimmed the whole photo. A gradient now sits only behind the caption, so the photography is as bright as the gallery while the text keeps its contrast.
- **Partner logos** were full-grayscale at 70% opacity — nearly invisible on a light page. Now 65% grayscale at 90% opacity, resolving to full colour on hover.
- **Headline rewritten** to state the offer plainly — "We build the software your business runs on — and keep it running" — above a badge reading *Software Development · IT Support · Harare*. A visitor now learns what the company does and where, without scrolling.
- **Service cards shortened.** Cards were printing up to nine raw list items. They now show the description plus four items and a "+N more included" line, and use `h-full` flex so every card in a row matches height regardless of copy length.

**Two defects found while verifying, both fixed:**

1. **Dark mode was broken by the redesign.** The hero gradient used a hardcoded light colour, so the dark theme rendered a grey wash across the hero, and the navy logo sat invisible on the dark bar. Both now use theme tokens, with the logo inverting under `dark:`. This also removed the last hardcoded colours, restoring compliance with `docs/11-coding-standards.md` §3.
2. **The e2e suite could only run once an hour.** The 10/hour submission limit — correct for production — is exhausted by a single full run, which surfaced as three "form" failures that looked like product bugs. Throttle rates are now environment-configurable (`THROTTLE_ANON`, `THROTTLE_USER`, `THROTTLE_SUBMISSION`), **defaulting to the production values** so nothing changes on the live deployment. The README documents raising them for test runs.

Verified after the change: **54 unit + 16 e2e + 15 Django tests passing**, zero lint errors, clean typecheck, and Lighthouse holding **Accessibility 100 / Best Practices 100 / SEO 100** with no accessibility failures. Both light and dark themes checked in-browser.

---

## 12. UI/UX Consistency Pass (final)

A refinement pass across every page, after the owner confirmed the direction was right.

**Section headings consolidated.** The same eyebrow-plus-title block had been hand-written in **eleven places across eight files**, and had already drifted into two different title sizes. All of it now renders through one `SectionHeading` component with a pill-style eyebrow. `grep "uppercase tracking-widest"` returns nothing — there is no longer a second way to write a section header.

**Page-appropriate imagery.** Two images shipped in the repo, `section-blog-insights.jpg` and `section-contact-support.jpg`, were named for specific pages but never used. Parallax bands now appear on Blog, Contact, Portfolio, and Capability Statement with imagery matched to each. `SectionBreak` itself was redesigned: taller, left-aligned text, and a **directional gradient instead of a flat 70% wash**, so the photograph stays bright — the same correction applied to the homepage service cards.

**Motion made accessible.** Nothing respected `prefers-reduced-motion`. Framer Motion is now wrapped in `<MotionConfig reducedMotion="user">`, and a CSS media query neutralises CSS-driven animation — durations collapse rather than animations being removed, so anything that relies on an animation to become visible still ends up visible. Entrance animations also start marginally before an element scrolls into view, and `fadeUpDelayed()` caps its stagger so late items in a long grid are never left waiting.

**Result:** Performance improved materially — `/about` **95** and `/blog` **90** now clear the ≥90 target, with `/` at 87. Accessibility, Best Practices, and SEO are **100 across all three**, with zero accessibility failures.

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 87 | **100** | **100** | **100** |
| `/about` | **95** | **100** | **100** | **100** |
| `/blog` | **90** | **100** | **100** | **100** |

**One defect caught by the test suite:** changing `fadeUp` broke a unit test asserting its exact shape. The test was right to fail — but it was asserting object identity rather than behaviour, so it now checks the property that actually matters (`once: true`, so content never re-hides on scroll-back) plus new coverage for `fadeUpDelayed`. Unit tests went 54 → **58**.

---

## 13. Contact Channels Made Fully Functional

The owner asked for the contact page to genuinely work across WhatsApp, calls, and email.

**Calls and email already worked** — `tel:` and `mailto:` links were correctly formed and verified against the live page. **Email sending did not**, and its failure mode was the dangerous kind: with no `RESEND_API_KEY`, the form reported success while quietly sending nothing.

**Email now works without Resend.** Delivery supports three routes, auto-detected from whichever credentials are present:

| Credentials present | Provider |
|---|---|
| `RESEND_API_KEY` | Resend HTTP API |
| `EMAIL_HOST` + user/password | **SMTP — Gmail or any domain mailbox** |
| neither, `DEBUG=true` | Console (printed to the terminal) |
| neither, `DEBUG=false` | None — logged as an **ERROR** |

The SMTP path matters practically: this business already has a Gmail address, and can now send through it with an App Password rather than signing up for a new service. Messages are also sent as proper `multipart/alternative` with a plain-text part alongside the HTML — HTML-only mail is penalised by spam filters. Delivery failures are logged and never raise, so a mail outage cannot roll back the submission that triggered it.

Verified end to end: a real enquiry posted through the site produced both a database row and a correctly formatted notification addressed to the admin.

**WhatsApp was consolidated and extended.** The `wa.me` URL had been assembled three different ways across the codebase. It now goes through one helper that strips every non-digit — `wa.me` silently opens a *blank chat* rather than the business account if a `+` or space survives, with no visible error. The contact card and footer links now also arrive pre-filled, and the contact form gained a **"Send via WhatsApp"** option that carries the typed enquiry across, giving visitors an instant reply route that does not depend on mail delivery at all.

**Two defects found while building this:**

1. **`window.open()` was the wrong mechanism** for the WhatsApp send action — the popup never opened under test, and popup blockers would have hit real users. Replaced with a real anchor, which also supports middle-click and "open in new tab".
2. **A WCAG 2.5.3 "Label in Name" violation I introduced** — the button's `aria-label` ("Send this enquiry via WhatsApp instead") did not contain its visible text ("Send via WhatsApp"), which breaks voice control: a user saying "click Send via WhatsApp" would not match. The redundant label was removed; the visible text is already a good accessible name.

Coverage added: `tests/unit/whatsapp.test.ts` (link builders) and `tests/e2e/contact-channels.spec.ts`, which asserts every `tel:`/`mailto:`/`wa.me` link on the live page is correctly formed. Totals: **70 unit, 23 e2e, 15 Django** — all passing.

---

## 14. Running the Project

Both services must run — the frontend alone renders pages, but no form submits and the admin dashboard loads no data. Full setup is in the [README](../README.md).

```bash
backend/.venv/Scripts/python.exe backend/manage.py runserver 8000
```
```bash
npm --prefix frontend run dev
```

Frontend on `:3000`, API on `:8000`. Confirm the backend is reachable:

```bash
curl -s -o /dev/null -w "backend %{http_code}\n" http://localhost:8000/api/health/
```

A local admin account exists for development (`admin` / `DevAdmin123!`) — **this is a development credential and must not be carried into production.** Create the real admin with `manage.py createsuperuser`.

Test commands:
```bash
npm --prefix frontend run lint && npm --prefix frontend run typecheck && npm --prefix frontend test && npm --prefix frontend run e2e
```
```bash
cd backend && .venv/Scripts/python.exe manage.py test
```
