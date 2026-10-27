# Website Redesign — Handover Report (October 2026)

Branch: `claude/vibrant-ritchie-tg7ptv` · Figma: https://www.figma.com/design/3WKZpNCsQUIcVbeS7Mniaa (partial; see §4) · Content guide: [`CONTENT-GUIDE.md`](CONTENT-GUIDE.md) · Questions for the owner: [`OPEN-QUESTIONS.md`](OPEN-QUESTIONS.md) #7–17

**Nothing has been deployed.** Production changes only when someone runs `deploy/deploy.sh` on the server after this branch is merged.

---

## 0. What could and could not be accessed

| Item                      | Status                                                                                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository                | `king-Mudho/mudhotech_website` holds the full project (Next.js 15 + Django 6). There is no `mudhotech/mudhotech_website` repository on the connected GitHub account.                                                                                                             |
| Live site (mudhotech.com) | **Not reachable**: the cloud sandbox's network policy denies the host. The audit is of the code on `main`, built and run locally, so differences between the code and the live site could not be checked. In particular, it is unknown whether PRs #1–#3 have been deployed yet. |
| Figma                     | Connected, but the account is on the **Starter plan with a View seat**. The file was created and partly built before the monthly MCP call limit was reached. Starter also caps a file at 3 pages and variable collections at 1 mode.                                             |
| Logo upload to Figma      | Blocked by the sandbox network policy; the Logo component is an empty slot.                                                                                                                                                                                                      |
| Admin dashboard           | Tested only with a local development account, never production.                                                                                                                                                                                                                  |
| Email delivery            | Not tested against a real inbox; no safe test destination was arranged.                                                                                                                                                                                                          |
| Unsplash (old gallery)    | Blocked in the sandbox, so "before" screenshots show empty gallery tiles. In production they showed stock photos.                                                                                                                                                                |

---

## 1. Summary of the original audit

**Strengths kept:** a clear headline ("We build the software your business runs on — and keep it running"), a problem-led homepage section, careful honesty work already done (invented testimonials, partner logos, and statistics had been hidden), solid form validation, and a security-conscious architecture.

**Problems found (verified):**

1. **Software development was buried.** `/web-software` opened on a "Software Services" tab (Windows installs, Turnitin, CV formatting); the development services sat behind a second tab.
2. **Setup and repair were split across two pages.** Software installation and troubleshooting lived on the development page, not on IT Support.
3. **The portfolio presented stock photos as work.** 30 hot-linked Unsplash photos sat under "Projects, Repairs & Gallery … software we've delivered, hardware we've brought back".
4. **Unverified or inaccurate claims:**
   - "Integrates with" EcoCash, ZimSwitch and Stripe as a flat yes, but Stripe does not onboard Zimbabwe-registered businesses.
   - "You own what we build" stated unconditionally, while the Terms say ownership passes on full payment.
   - A "Fast Turnaround" badge.
   - Free diagnosis repeated about 10 times and "one business day" 5 times, none confirmed.
   - A "Cloud Solutions" footer link with no page behind it.
   - `priceRange: "$$"` in the structured data.
5. **Cookie banner without analytics.** It asked for consent to analytics and "personalised content" even when no analytics were configured.
6. **Accessibility:** serious axe violations on 9 of 13 audited pages: WhatsApp button contrast 2.3:1, process links 4.0:1, and invalid `<dl>` markup.
7. **Performance:**
   - `framer-motion` loaded on every page.
   - Animated sections were server-rendered at opacity 0 until JavaScript ran, so slow connections saw blank sections.
   - `/web-software` loaded 253 kB of JavaScript.
8. **Repetition:** the homepage repeated itself, with the "Who We Are" block and four "Our Services" photo cards restating the problem cards.

---

## 2. Page-by-page changes

**All pages**

- **Navigation:** "Software Development" and "Our Work" replace "Web & Software" and "Portfolio". URLs are unchanged.
- **Footer:** service links point at the matching section; the "Cloud Solutions" link is gone.
- **Cookie banner:** appears only when Google Analytics is configured, and describes what it actually asks.
- **Motion:** a CSS-only scroll reveal (a short slide, never a fade), switched off for reduced-motion and print.
- **Contrast:** WhatsApp green darkened to 4.9:1.

**Home (`/`)**

- **Hero:** the headline stays. Four vague badges are replaced by two path cards, "Websites, systems & apps" and "IT support & repairs".
- **Buttons:** "Get a Free Quote" plus "WhatsApp Us"; the "Explore Services" button is gone.
- **Problem cards:** each now links straight to its section (e.g. `/it-support#networks`).
- **Removed:** the duplicate "Who We Are" and "Our Services" sections. The page is about 15% shorter.

**Software Development (`/web-software`)**

- **Content:** build-only: websites and web systems, e-commerce, and mobile apps.
- **New section:** "What you get, whatever the size" (scope in writing, testing, documentation and training, optional support).
- **Payments:** the caveat sits on the e-commerce card.
- **Cross-link:** for software installation and repairs.
- **Closing button:** goes to the quote form.

**IT Support (`/it-support`)**

- **Layout:** every keep-it-working service in three anchored groups (Repairs & Hardware, Networks & Devices, Software Setup & Troubleshooting), with in-page navigation.
- **Request support form:** moved here, with an optional phone/WhatsApp field and grouped categories, next to WhatsApp and call buttons.

**Our Work (`/portfolio`)**

- **Stock gallery:** removed.
- **Case studies:** only those with the client's permission are shown (an honest empty state for now).
- **Illustrative examples:** five, each labelled "Illustrative example", drawn from the service list, with no outcomes.

**Contact, Quote, forms**

- **Promise wording:** response time and free-assessment text come from `data/commitments.ts`.
- **Phone field:** the support form stores an optional phone number (Django serializer updated, with a test).

**SEO**

- **Homepage title:** "Software Development & IT Support in Harare".
- **Descriptions:** new for the service and work pages; the portfolio description no longer promises case studies that don't exist.
- **Structured data:** `knowsAbout` lists real services, and `priceRange` is removed.
- **Sitemap and canonical URLs:** unchanged.

---

## 3. Measured results

### Accessibility (axe-core, WCAG 2.2 AA tags; 13 routes × desktop and mobile)

|                               | Before  | After                                |
| ----------------------------- | ------- | ------------------------------------ |
| Pages with serious violations | 9 of 13 | **0 of 13** (with motion on and off) |

### Lighthouse

Conditions: median of 3 runs, Lighthouse 12 default mobile emulation (simulated slow 4G, 4× CPU slowdown), production builds, served locally.

| Page                 | Performance | Accessibility | Best practices | SEO       | LCP         | Total blocking time | Page weight  |
| -------------------- | ----------- | ------------- | -------------- | --------- | ----------- | ------------------- | ------------ |
| Home                 | 88 → **93** | 90 → **100**  | 100 → 100      | 100 → 100 | 3.3 → 2.9 s | 238 → 167 ms        | 447 → 373 KB |
| Software Development | 83 → **94** | 100 → 100     | 100 → 100      | 100 → 100 | 3.4 → 3.0 s | 397 → 87 ms         | 456 → 335 KB |
| IT Support           | 90 → 90     | 90 → **100**  | 100 → 100      | 100 → 100 | 3.5 → 3.3 s | 144 → 193 ms        | 442 → 419 KB |
| Our Work             | 93 → 93     | 90 → **100**  | 96 → **100**   | 100 → 100 | 3.1 → 3.0 s | 101 → 153 ms        | 373 → 344 KB |
| Contact              | 89 → **93** | 96 → **100**  | 100 → 100      | 100 → 100 | 3.3 → 3.2 s | 196 → 91 ms         | 456 → 338 KB |

Notes:

- **LCP is still above 2.5 s** in this simulation. Locally, unthrottled, LCP equals first paint at about 0.2 s. What remains is mostly Next.js's shared 103 kB framework bundle. Real-visitor (field) data was not available.
- **IT Support** blocking time rose because the support form moved there.
- **First-load JavaScript per page:** `/web-software` 253 → 130 kB, `/contact` 203 → 161 kB, `/blog` 208 → 163 kB, `/portfolio` 166 → 112 kB.
- **Layout shift (CLS)** was 0 before and after.

Before/after screenshots are in [`redesign-2026-10/`](redesign-2026-10/).

---

## 4. Figma

File: https://www.figma.com/design/3WKZpNCsQUIcVbeS7Mniaa

**Built**

- **Foundations specimen:** colour in light and dark (separate collections, because Starter allows one mode per collection); 14 base colours plus 15 alpha tints per theme; spacing and radius variables with CSS code syntax; 13 text styles in Poppins and Open Sans; 2 shadow styles.
- **Components:** 18 Lucide icons; Button (Primary, WhatsApp, Outline × Default, Hover, Focus); Field (Default, Focus, Error, Filled); Badge; Chip; Section Heading; Logo slot; Path Card; Problem Card; Service Card (with a "Show note" toggle); Example Card; Empty State; CTA Band; Navigation and Footer, desktop and mobile.
- **Review frame:** every button and field state shown as instances.
- **Page:** Home at desktop width (1440).

**Known defects (not fixed, blocked by the monthly call limit)**

- **Hero badge:** renders solid blue instead of a 10% tint.
- **"How We Work" cards:** the four cards render solid white instead of 5% white, which hides their text.
- **Logo:** the slot is empty.

**Not built:** Software Development, IT Support and Our Work at desktop width, and all mobile pages.

**To finish:** wait for the monthly MCP limit to reset or upgrade the seat, then:

1. Re-tint the two defects. Bind the `color/*-NN` tint variables and set the paint's opacity to NN%, because a bound paint takes its opacity from the variable's alpha.
2. Drop `public/images/mudhotech-logo.png` onto `Logo → logo-image`.
3. Compose the remaining frames from the existing components.

The live, coded pages (preview below) are the reviewable design in the meantime.

---

## 5. Preview locally

See [`CONTENT-GUIDE.md` → Preview locally](CONTENT-GUIDE.md#preview-locally). To compare against the current site, check out `main` in a second folder and run it on another port (`npx next start -p 3001`).

---

## 6. Files changed (this branch, on top of `main`)

- **Pages:** `app/page.tsx`, `app/web-software/page.tsx`, `app/it-support/page.tsx`, `app/portfolio/page.tsx`, `app/contact/page.tsx`, `app/not-found.tsx`, `app/capability-statement/page.tsx`, `app/layout.tsx`, `app/globals.css`, `next.config.ts`.
- **Data:**
  - New: `src/data/commitments.ts`.
  - Restructured: `src/data/services.ts` (adds `supportGroups`; gallery removed) and `src/data/portfolio.ts` (case-study model; invented projects deleted).
  - Updated: `src/data/faq.ts`, `src/data/processes.ts`.
- **Components:**
  - Updated: `HomeHero`, `NeedsFinder`, `WhyMudhoTech`, `ContactCta`, `ServiceCard`, `ProcessSteps`, `FAQ`, `IndustriesServed`, `SectionBreak`, `ThemeProvider`, `Navbar`, `Footer`, `CookieConsent`, `JsonLd`, `SoftwareServiceForm`, `QuoteForm`, `ContactForm`.
  - Removed: `ServiceTabs`, `PortfolioTabs`, `ServiceCategoryCards`, `WorksWith`, `SkeletonImage`.
- **Backend:** `leads/serializers.py` (optional phone on support requests), `leads/tests.py`.
- **Tests:** `tests/unit/data.test.ts`, the new `tests/e2e/site-structure.spec.ts`; `tests/e2e/gallery.spec.ts` removed.
- **Docs:** this report, `CONTENT-GUIDE.md`, `OPEN-QUESTIONS.md` (#7–17), `redesign-2026-10/` screenshots.

---

## 7. Test results

| Suite                 | Result                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ESLint / TypeScript   | 0 errors (4 pre-existing warnings: `postcss.config.js` and two shadcn `ui/` files)                                                                                                                                                                                                                                                               |
| Vitest unit/component | **94 / 94** pass. New tests cover: support services all grouped, no setup services on the build page, payment claims always caveated, case studies hidden without permission, illustrative examples free of figures.                                                                                                                             |
| Playwright e2e        | **31 / 31** pass. New tests cover: both hero paths; problem card → section anchor; the build/support split; payment caveat visible; portfolio has no external images and labels its examples; optional phone field; no cookie banner without analytics; mobile menu opens, navigates and closes; no horizontal scrolling at 390 px on six pages. |
| Django                | **36 / 36** pass                                                                                                                                                                                                                                                                                                                                 |
| `next build`          | passes                                                                                                                                                                                                                                                                                                                                           |
| Internal links        | all 16 unique internal URLs return 200                                                                                                                                                                                                                                                                                                           |
| Browser console       | no errors on any route (other than the expected 404 for the not-found test)                                                                                                                                                                                                                                                                      |

**Not tested:**

- real email delivery
- the production admin dashboard
- the live site
- Safari and Firefox (only Chromium was available)
- a real device on a real Zimbabwean network

---

## 8. Deployment plan

Hosting is the AlmaLinux VPS described in `deploy/README.md`: nginx, then Next.js on 127.0.0.1:3200 and Django on 127.0.0.1:8200, with SQLite.

1. Review the PR, the screenshots, and `OPEN-QUESTIONS.md` #7–17. Correct any wording in `src/data/commitments.ts` first if a promise is wrong.
2. Merge to `main`.
3. On the server, as root, run `bash /srv/mudhotech/deploy/deploy.sh`. This branch adds **no migrations and no environment variables**. The script backs up the database, builds into the idle slot while the site stays up, switches, health-checks, and rolls back automatically if Next.js doesn't come up.
4. Smoke test on https://mudhotech.com:
   - Homepage path cards lead to both service pages.
   - `/it-support#networks` jumps to its section.
   - `/portfolio` shows no stock photos.
   - Send one support request with your own email and phone, and check it appears in `/admin`.
   - The WhatsApp and call buttons open correctly on a phone.

**Rollback**

- **Immediate (seconds):** write the previous slot into `/srv/mudhotech/frontend/.next-slot.env` and `systemctl restart mudhotech-web` (see `deploy/README.md` → Routine deploys).
- **Full:** `git revert` the merge commit on `main` and run `deploy.sh` again. No database changes need reverting.

---

## 9. Remaining work, by priority

1. **Confirm the business details** in `OPEN-QUESTIONS.md` #7–17, especially free diagnosis, reply time, payment integrations, and the academic "plagiarism correction" service.
2. **Add the first real case study**, with written permission (`CONTENT-GUIDE.md` → Portfolio).
3. **Finish the Figma file** once the call limit allows (§4).
4. **Tackle LCP:** move rarely used layout client components (theme toggle, toaster) out of the shared bundle; consider a lighter icon import.
5. **Review the open security items:**
   - The SonarCloud finding from PR #1 is still unread.
   - Content-Security-Policy still allows `unsafe-eval`.
   - The HSTS preload decision is pending.
6. **Get real photography:** office, team, and work in progress, to replace the remaining stock section photos.
7. **Test on real devices** over typical local mobile connections, in Safari and Firefox.
