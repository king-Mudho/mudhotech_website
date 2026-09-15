# MudhoTech Solutions — Full Rebuild Execution Prompt (for Claude Code)

You are rebuilding the MudhoTech Solutions corporate website. The full specification lives in the `docs/` folder of this repository, in 13 files, numbered `01` through `13`. Read every one of them before writing any code — they are the contract for this build, not background reading.

## 0. Orientation (do this first, before any code changes)

1. Run `ls docs/` and read `docs/01-project-overview.md` through `docs/13-deployment-launch.md` in numeric order.
2. Inspect the current repository. It contains a **legacy Lovable-built site**: a Vite + React + TypeScript SPA using React Router, Tailwind, shadcn/ui, and Supabase. Locate it (likely at the repo root, or in a subfolder — check for `vite.config.ts`, `src/pages/`, `src/components/AnimatedRoutes.tsx`, and `supabase/`).
3. Produce a short written migration plan (as a markdown file at `docs/MIGRATION-NOTES.md`) before touching code, covering:
   - Which legacy files/logic are being **ported as-is** (Supabase migrations, edge functions, `src/data/services.ts`, `src/data/blogPosts.ts`, design tokens, `exportUtils.ts`)
   - Which legacy files/logic are being **rewritten** (all routing/pages, all page-level components, forms, admin dashboard)
   - Which legacy files/logic are being **deleted outright** (`lovable-tagger`, `AnimatedRoutes.tsx`, `SEOHead.tsx`, `NavLink.tsx`, duplicate lockfiles, the duplicate toast system, any Vite-specific config)
   - Confirm this plan matches `docs/10-project-structure.md`'s "Legacy → v2 File Mapping"-style guidance before proceeding (if that section isn't present verbatim, infer the mapping from `docs/03-system-architecture.md` and `docs/10-project-structure.md`).

Do not proceed to Phase 1 until this migration plan file exists and is internally consistent with the docs.

## 1. Non-Negotiable Constraints

- Final stack: **Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui**, per `docs/02-technology-stack.md`. Do not substitute the Pages Router, a different CSS framework, or a different component system.
- Backend stays **Supabase** (Postgres + Auth + Edge Functions), per `docs/04-database-design.md` and `docs/08-api-design.md`. Do not propose a backend rewrite.
- Every security/RLS requirement in `docs/05-security-rbac.md` and `docs/04-database-design.md` is implemented **from the first migration**, not retrofitted later.
- Every form must actually submit to a real, validated endpoint and trigger a real email notification — no placeholder/no-op success states, anywhere.
- No secrets in client-side code or committed to git. `.env*.local` must be gitignored from the very first commit.
- Placeholder content (team, testimonials, stats, partner logos, portfolio case studies) must be implemented but clearly marked `// TODO(content):` in code, per `docs/07-content-data-model.md §9`.
- Do not silently invent business-critical facts (registration numbers, canonical domain, permanent email) that the docs flag as unresolved in `docs/01-project-overview.md §8`. Use a clearly marked placeholder and list these in your final report instead.

## 2. Execution Order — Work Through Stages 1–13 Sequentially

Treat each numbered doc as a stage. Do not begin a later stage until the previous stage's output is in place, since later stages depend on earlier scaffolding. After completing each stage, run `npm run lint` and `npm run build` (once the project exists) to confirm nothing is broken before moving on.

### Stage 1 — Project Overview (`docs/01-project-overview.md`)
- Confirm you understand the business, goals, and success criteria.
- Create `docs/OPEN-QUESTIONS.md` listing every unresolved item from `§8` verbatim, so it's easy for the site owner to answer later. Reference this file wherever a placeholder is used in code.

### Stage 2 — Technology Stack (`docs/02-technology-stack.md`)
- Scaffold a fresh Next.js 15 (App Router, TypeScript, Tailwind, ESLint) project.
- Install and initialize shadcn/ui (`components.json`: style `default`, base color `slate`, CSS variables on).
- Install every supporting library listed in the doc (`react-hook-form`, `zod`, `@hookform/resolvers`, `@tanstack/react-query`, `recharts`, `sonner`, `next-themes`, `embla-carousel-react`, `date-fns`, `jspdf`, `jspdf-autotable`, `@next/third-parties`, `@supabase/supabase-js`, `@supabase/ssr`, `vitest`, `@testing-library/react`, `@playwright/test`).
- Standardize on **npm** as the only package manager; if the legacy repo has `bun.lock`/`bun.lockb`, delete them.
- **Definition of done:** `npm run dev` serves a blank Next.js app with Tailwind and one working shadcn component.

### Stage 3 — System Architecture (`docs/03-system-architecture.md`)
- Set up the rendering strategy: static generation for marketing pages, a Client Component "island" pattern for form pages, and a dynamic, middleware-gated section for `/admin`.
- Set up the Supabase browser client, server client, and SSR middleware helper under `src/lib/supabase/`.
- **Definition of done:** the architectural skeleton (folders, client instances, middleware stub) exists and typechecks, even before pages are built.

### Stage 4 — Database Design (`docs/04-database-design.md`)
- Write and apply the Supabase migrations in the exact order specified: `contact_submissions` + `quote_requests` (RLS on, no public INSERT policy) → `app_role` enum + `user_roles` + `profiles` + `private.has_role()` + trigger + admin policies → `admin_notification_preferences` → `newsletter_subscribers`.
- Port the two existing Edge Functions (`notify-submission`, `send-reply`) from the legacy `supabase/functions/` folder, applying the hardening fixes required in later stages (escaping, CORS).
- **Definition of done:** migrations apply cleanly to a fresh Supabase project; a manual anon INSERT attempt against `contact_submissions` fails as expected.

### Stage 5 — Security & RBAC (`docs/05-security-rbac.md`)
- Implement `middleware.ts` guarding `/admin/**`.
- Implement the role-check helper with the mandatory `.eq("user_id", session.user.id)` scoping — do not reproduce the legacy bug where role lookups weren't scoped per-user.
- Implement rate limiting and a honeypot field pattern reusable across all public forms.
- **Definition of done:** an unauthenticated visit to `/admin` redirects to `/admin/login`; a second admin account does not break any role check.

### Stage 6 — Functional Modules (`docs/06-functional-modules.md`)
Build every module listed, in this order: Home → About (incl. Client Engagement Model & Service Level Commitment sub-sections) → Web & Software Services → IT Support → Portfolio → Blog (list + detail) → Contact → Quote → Capability Statement → Legal pages → Global components (Navbar, Footer, WhatsApp button, cookie consent, section breaks, etc.) → Admin Login/Reset → Lead Dashboard (Contacts/Quotes tabs) → Analytics tab → Settings tab.
- Port legacy component logic where it's still correct (animated counters, testimonial carousel, FAQ accordion, skeleton image loader) but rewrite them as Next.js Server/Client Components appropriately per `docs/03-system-architecture.md`.
- Every form (`Request Software Service`, blog newsletter, Contact, Quote) must be wired to a real submission — the legacy no-op forms are explicitly called out as bugs to fix, not behavior to preserve.
- **Definition of done:** every route in `docs/10-project-structure.md`'s folder tree exists and renders real content (or clearly marked placeholder content).

### Stage 7 — Content & Data Model (`docs/07-content-data-model.md`)
- Create every typed data module (`company.ts`, `services.ts`, `engagementModel.ts`, `serviceCommitments.ts`, `faq.ts`, `partnerships.ts`, `roadmap.ts`, `blogPosts.ts`) exactly as specified, porting real content from the legacy `src/data/services.ts` and `src/data/blogPosts.ts` where it already exists correctly.
- Wire the pages built in Stage 6 to import from this data layer rather than containing hard-coded prose.
- **Definition of done:** no page in the app contains large blocks of hard-coded copy that duplicates something already expressible in `src/data/`.

### Stage 8 — API Design (`docs/08-api-design.md`)
- Implement every Route Handler listed (public submission endpoints, newsletter, and the full admin API surface).
- Implement the shared `zod` schemas in `src/lib/schemas.ts` and use them on both the client forms (via `zodResolver`) and server-side re-validation in each Route Handler.
- Ensure every public POST endpoint is rate-limited and honeypot-checked, with the consistent error shape specified in the doc.
- **Definition of done:** submitting each form end-to-end creates the correct database row and triggers a real notification email in a test environment.

### Stage 9 — UI/UX Design System (`docs/09-ui-ux-design.md`)
- Port the exact HSL design tokens into `app/globals.css` and `tailwind.config.ts`.
- Configure `next/font/google` for Poppins + Open Sans (single load path — do not duplicate via `<link>` + `@import`).
- Build the shared layout primitives (`<PageHero>`, `<Section>`, `<ServiceCard>`, `<SectionBreak>`) and the custom shadcn `button.tsx` variants (`accent`, `heroOutline`, `whatsapp`, `lg`, `xl`).
- Retrofit every page built in Stage 6 to use these shared primitives instead of ad hoc per-page markup, if you didn't already build them this way.
- **Definition of done:** light/dark theme toggling works site-wide using only token-based classes; no page defines its own one-off hero/card markup.

### Stage 10 — Project Structure (`docs/10-project-structure.md`)
- Do a structural audit: confirm the repo matches the folder tree in this doc exactly.
- Delete every item flagged as dead code in the legacy project (`lovable-tagger`, `AnimatedRoutes.tsx`, `SEOHead.tsx`, `NavLink.tsx`, the unused shadcn `sidebar` primitive if not needed, duplicate lockfiles, the duplicate toast system).
- **Definition of done:** `git status`/directory listing matches the target structure; no orphaned legacy Vite/React-Router files remain anywhere in the repo.

### Stage 11 — Coding Standards (`docs/11-coding-standards.md`)
- Configure ESLint 9 flat config + `typescript-eslint` + `eslint-config-next`, Prettier, and a `husky` + `lint-staged` pre-commit hook.
- Sweep the codebase for standards violations introduced in earlier stages (implicit `any`, inline animation object redeclaration, hardcoded colors, unscoped role checks, missing `aria-label`s) and fix them.
- **Definition of done:** `npm run lint` passes with zero errors; a pre-commit hook blocks a deliberately broken test commit.

### Stage 12 — Testing Plan (`docs/12-testing-plan.md`)
- Write the unit tests, component tests, and integration tests specified.
- Write the 7 Playwright e2e journeys specified (contact submission, quote submission, admin auth redirect, admin auth success, lead status change, reply flow, blog navigation, 404 handling).
- Run a Lighthouse pass on `/`, one service page, and `/blog`; fix anything below the ≥90 target across Performance/SEO/Accessibility/Best Practices.
- **Definition of done:** `npm run test` and `npx playwright test` both pass in CI; coverage targets in the doc are met for `src/lib/`.

### Stage 13 — SEO, Compliance & Deployment (`docs/13-deployment-launch.md`)
- Implement `generateMetadata()` on every route, `app/sitemap.ts` (including every blog slug, generated dynamically — not hand-maintained), `app/robots.ts`, and the shared JSON-LD components.
- Wire GA4 via `@next/third-parties/google`, gated strictly behind cookie consent.
- Configure security headers in `next.config.ts`.
- Prepare (but do not necessarily execute, unless you have deploy credentials) the Vercel deployment steps and environment variable list.
- Walk through the full Launch Checklist at the end of the doc and report the status of every item.
- **Definition of done:** every checklist item is either checked off or explicitly listed as blocked-on-client-input in your final report.

## 3. Legacy Code Handling — Explicit Instructions

- **Do not attempt to run the Next.js app and the legacy Vite app side by side long-term.** The end state is a single Next.js codebase; the legacy Vite/React-Router SPA is fully replaced.
- **Keep, ported as-is (adapted to Next.js conventions where needed):** Supabase migrations, RLS policies, the `private.has_role()` pattern, both Edge Functions (with the hardening fixes from `docs/05-security-rbac.md` and `docs/08-api-design.md` applied), `src/data/services.ts` content, `src/data/blogPosts.ts` content, the HSL design token values, `exportUtils.ts` logic.
- **Rewrite:** every page component, all routing (React Router → Next.js file-based routing), `SEOHead.tsx` (→ `generateMetadata`), `GoogleAnalytics.tsx` (→ `@next/third-parties`), all forms (→ `react-hook-form` + `zod`), the admin dashboard shell and its auth guard (→ `middleware.ts` + re-verified Route Handlers).
- **Delete outright once ported/rewritten equivalents exist and are verified working:** the old `src/pages/`, `AnimatedRoutes.tsx`, `SEOHead.tsx`, `NavLink.tsx`, `lovable-tagger` and any Lovable-specific config, `vite.config.ts` and other Vite-only tooling, duplicate lockfiles, the duplicate toast system.
- Do not delete legacy files until their Next.js replacement is built and passing its own tests — work incrementally, stage by stage, rather than deleting everything up front.

## 4. Final Report

When all 13 stages are complete, produce a `docs/BUILD-REPORT.md` summarizing:
1. Stage-by-stage completion status, with any deviations from the docs explicitly called out and justified.
2. The full contents of `docs/OPEN-QUESTIONS.md` (unresolved business facts still needed from the site owner).
3. Final Launch Checklist status from Stage 13.
4. Any legacy file that could not yet be safely deleted, and why.

Work through this prompt stage by stage. Do not skip ahead, and do not mark a stage complete until its "Definition of done" is genuinely met.
