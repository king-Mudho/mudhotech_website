# Migration Notes — Legacy Vite/React SPA → Next.js App Router

Written before any Stage 1+ code changes, per `CLAUDE_CODE_PROMPT.md §0`. Covers what is ported as-is, what is rewritten, and what is deleted, mapped against `docs/10-project-structure.md`.

> **Superseded note:** the site owner decided during Stage 0/1 orientation to remove Supabase entirely in favor of Django + SQLite. See `docs/ARCHITECTURE-DEVIATION.md` for the full replacement design. Everything below about Supabase migrations/edge functions describes the **legacy repo's actual state** (useful context for what content/logic is being ported) but **none of it is ported to Supabase** — the equivalent logic is rebuilt in Django per the deviation doc. Frontend-only sections (pages, components, data layer) below are unaffected and still accurate.

## Current State of the Legacy Repo

Root of this repository **is** the legacy Lovable-built site: Vite + React 18 + TypeScript + React Router 6 + Tailwind 3 + shadcn/ui + Supabase, confirmed by `vite.config.ts`, `src/pages/`, `src/components/AnimatedRoutes.tsx`, and `supabase/`.

Key finding: the Supabase backend is **further along than the docs assume**. Reading the 5 existing migrations end-to-end:

| Doc 04 requirement | Legacy state |
|---|---|
| `contact_submissions`, `quote_requests`, RLS on, no public INSERT policy | **Done.** Migration 1 created both tables with a public INSERT policy; migration 4 (`...095625`) drops both public INSERT policies. Public writes now only work via the service-role key (edge function). |
| `app_role` enum, `user_roles`, `profiles`, `private.has_role()`, `handle_new_user` trigger, admin policies | **Done.** Migration 2 creates all of it as `public.has_role()`; migration 4 locks down grants; migration 5 (`...095655`) moves the function to `private.has_role()` and repoints every RLS policy at it, then drops the `public` version. This already matches doc 04 §3 exactly. |
| `admin_notification_preferences` | **Done.** Migration 3, later repointed at `private.has_role()` in migration 5. |
| `newsletter_subscribers` | **Missing.** No migration creates this table. This is the one net-new Stage 4 migration needed. |

So Stage 4 is mostly a **port + one addition**, not a rebuild: reapply the 5 existing migrations verbatim (or squash them — decide during Stage 4) against the new/same Supabase project, then add migration 6 for `newsletter_subscribers` with server-only write / admin-only SELECT policies, per doc 04 §2 and §5.

Edge functions (`notify-submission`, `send-reply`) exist and are functionally correct (admin resolution via `user_roles` + `admin_notification_preferences`, `.eq("user_id", ...)`-scoped role check in `send-reply` already matches doc 05 §3) but need the hardening called out in docs 05/08 before porting:
- `Access-Control-Allow-Origin: "*"` in both functions → must lock to the production origin.
- No HTML-escaping of user-supplied fields (`name`, `email`, `phone`, `subject`, `message`, `business`, `description`, `service`, `contact` in `notify-submission`; `message` in `send-reply`) before interpolation into email HTML → straightforward HTML/markup injection into admin-viewed emails. Must add an `escapeHtml()` helper and apply it to every interpolated field.
- No rate limiting or honeypot check inside the functions today — per doc 03 §3 / 08 §1, these now belong in the Next.js Route Handler layer in front of the functions, not in the functions themselves, since Route Handlers become the only public entry point.

`.env` currently has `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` — no `SUPABASE_SERVICE_ROLE_KEY` and no `RESEND_API_KEY` present in this repo checkout. Both are required server-side secrets for Stage 4/8 to be real (not no-op) and are not something to invent — flagged in `docs/OPEN-QUESTIONS.md`.

## Ported As-Is (adapted to Next.js conventions where needed)

| Legacy source | Destination | Notes |
|---|---|---|
| ~~`supabase/migrations/*.sql` (5 files)~~ | `backend/leads/models.py`, `backend/accounts/models.py` | **Not ported to Supabase — superseded.** Field shapes, status enums, and RLS *intent* (who can read/write what) are ported into Django models + DRF permission classes. See `docs/ARCHITECTURE-DEVIATION.md`. |
| ~~`supabase/functions/notify-submission/index.ts`~~ | `backend/leads/emails.py::notify_submission()` | **Not ported to Supabase.** Same responsibility (resolve admin recipients via notification prefs, send via Resend, escape HTML) rebuilt as a Django function. |
| ~~`supabase/functions/send-reply/index.ts`~~ | `backend/leads/views.py::AdminReplyView` + `backend/leads/emails.py::send_reply()` | **Not ported to Supabase.** Same admin-only re-verification + Resend send, rebuilt in DRF. |
| `src/data/services.ts` | `src/data/services.ts` | Category/content structure ported; icons stay `lucide-react`. |
| `src/data/blogPosts.ts` | `src/data/blogPosts.ts` | 4 starter posts ported; `content: string[]` rendered via a real markdown renderer per doc 06 §M6 instead of the legacy raw-paragraph-array rendering. |
| Design tokens (HSL values in legacy `index.html`/Tailwind config) | `app/globals.css` + `tailwind.config.ts` | Exact HSL triplets ported per doc 09 §1. |
| `src/lib/exportUtils.ts` | `src/lib/exportUtils.ts` | CSV/PDF export logic ported; re-pointed at the new admin API response shape. |

## Rewritten

| Legacy source | New form | Reason |
|---|---|---|
| `src/pages/*.tsx` (15 files) | `app/**/page.tsx` (App Router file-based routing) | React Router → Next.js routing per doc 03. |
| `src/components/AnimatedRoutes.tsx` | Small Client Component route-transition wrapper keyed on `usePathname()` | Doc 09 §4 — no more React Router `<AnimatePresence>` wrapping. |
| `src/components/SEOHead.tsx` | `generateMetadata()` per route | Doc 13 §1. |
| `src/components/GoogleAnalytics.tsx` | `@next/third-parties/google` `<GoogleAnalytics>`, gated behind cookie consent | Doc 13 §2. |
| `src/components/NavLink.tsx` | Next.js `<Link>` + `usePathname()`-based active-state styling | React Router-specific, no Next.js equivalent needed as a separate component. |
| Contact/Quote/Software-Service/Newsletter forms (currently no-op or direct-to-Supabase in the legacy pages) | `react-hook-form` + `zod` Client Components under `src/components/forms/`, posting to `app/api/**/route.ts` | Doc 06 explicitly calls out legacy no-op forms as bugs to fix, not behavior to preserve; doc 03 §3 mandates Route Handler → Edge Function, never client → Supabase directly. |
| `src/pages/Admin.tsx`, `AdminLogin.tsx`, `AdminResetPassword.tsx` + `src/components/admin/*` | `app/admin/**` guarded by `middleware.ts`, re-verified in each admin Route Handler | Doc 05 three-layer model; legacy has no `middleware.ts` equivalent (Vite SPA has no middleware layer). |
| `src/integrations/supabase/client.ts` | `src/lib/api/client.ts` (browser fetch wrapper), `src/lib/api/server.ts` (server-side fetch wrapper, adds the Bearer token for admin calls) | Superseded by `docs/ARCHITECTURE-DEVIATION.md` — no Supabase client at all; these call the Django REST API instead. |
| `src/integrations/supabase/types.ts` | `src/types/api.ts` | Hand-written/DRF-serializer-shaped types for the Django API responses, not Supabase-generated. |

## Deleted Outright (once verified Next.js replacements exist — per prompt §3, not before)

- `lovable-tagger` (package.json dependency + any Vite plugin usage)
- `src/components/AnimatedRoutes.tsx`
- `src/components/SEOHead.tsx`
- `src/components/NavLink.tsx`
- `vite.config.ts`, `vitest.config.ts` (Vitest config moves to Next.js-compatible setup), `index.html` (Vite SPA entry, no Next.js equivalent)
- `bun.lock`, `bun.lockb` (npm is the sole package manager per doc 02 §5)
- Duplicate toast system — legacy has both `src/hooks/use-toast.ts` (shadcn's original toast) and `sonner` as a dependency; doc 09 §6 mandates Sonner as the single toast system, so `use-toast.ts` and the shadcn `toast`/`toaster` primitives are dropped in favor of `sonner` everywhere.
- Entire `src/pages/` directory, once every route has a working `app/**/page.tsx` equivalent.
- `eslint.config.js` (legacy Vite/React config) — replaced by the Stage 11 ESLint 9 flat config + `eslint-config-next`.
- `supabase/` (migrations, functions, config.toml) and `src/integrations/supabase/` — per `docs/ARCHITECTURE-DEVIATION.md`, Supabase is removed outright rather than ported. `@supabase/supabase-js` and `@supabase/ssr` are dropped from `package.json` at Stage 2 and never installed.

## Consistency Check Against `docs/10-project-structure.md`

Doc 10 does not contain a verbatim "Legacy → v2 File Mapping" table, so this mapping was inferred from doc 03 (architecture / rendering strategy) and doc 10's target tree, as instructed. The mapping above lands every legacy file in exactly the location doc 10's tree specifies (`app/`, `src/components/{layout,marketing,forms,admin,ui}/`, `src/data/`, `src/lib/`, `src/lib/supabase/`, `src/types/`) — no legacy file is left without an explicit destination or deletion decision.

## Stage 2 Staging Note — tsconfig/eslint excludes

To get `npm run build`/`npm run lint` green with the legacy tree still physically present (per the "don't delete until the replacement is verified" rule below), `tsconfig.json` and `eslint.config.js` both carry a temporary `exclude`/`ignores` list covering: `src/legacy-pages` (renamed from `src/pages` — Next.js treats a literal `src/pages` dir as the Pages Router and tries to compile it), `src/integrations`, `src/App.tsx`, `src/main.tsx`, `src/vite-env.d.ts`, `src/test`, every top-level `src/components/*.tsx` file (the old Navbar/Footer/FAQ/etc. — all rewritten in Stage 6/9), `src/components/admin/**` (rewritten in Stage 6), the duplicate toast system (`src/hooks/use-toast.ts`, `src/components/ui/{toast,toaster,use-toast}.{ts,tsx}` — dropped per doc 09 §6), `src/data` (ported properly in Stage 7 — legacy `blogPosts.ts` currently fails typecheck because it imports images the Vite way, producing `StaticImageData` instead of `string`), and `supabase/` (Deno runtime code, not part of the Next.js TS program, and being removed per `docs/ARCHITECTURE-DEVIATION.md` regardless). Each of these entries should come **out** of both exclude lists as its stage lands and the file is ported/rewritten/deleted — by the end of Stage 10 both lists should be empty (or gone entirely).

## Sequencing

Per prompt §3: legacy files are not deleted until their Next.js replacement is built **and passing its own tests**. The legacy Vite app and the new Next.js app will coexist in this repo directory only during the build (Next.js scaffolded alongside, not replacing, the Vite tree) — they are never run side-by-side in production, and the legacy tree is removed stage-by-stage as each replacement lands (see prompt §2 Stage 10).
