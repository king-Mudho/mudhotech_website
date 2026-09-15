# 12 — Testing Plan

## 1. Test Layers

### Unit Tests (Vitest)
- `src/lib/schemas.ts` — every `zod` schema: valid input passes, invalid input produces expected field errors.
- `src/lib/exportUtils.ts` — CSV escaping, PDF row generation.
- `src/lib/utils.ts`, `src/lib/motion.ts` exports.
- Data modules (`src/data/*.ts`) — shape/typecheck sanity tests (e.g. every blog post has a unique slug, every service category has ≥1 item).

### Component Tests (Vitest + Testing Library)
- `ContactForm`, `QuoteForm`, `SoftwareServiceForm`, `NewsletterForm` — renders, shows validation errors, calls submit handler with the correct payload on valid input.
- `FAQ`, `Testimonials`, `AnimatedCounter` — render expected content/structure.
- Admin: `DateRangeFilter`, `AdminPagination` — interaction logic.

### Integration Tests (Vitest, mocked Supabase client)
- Route Handlers — valid payload → correct DB call shape; invalid payload → `400` with field errors.
- RBAC helper — role check correctly scoped to `user_id`.

### End-to-End Tests (Playwright)
1. Submit the Contact form → success state + a new DB row (test project).
2. Submit the Quote form.
3. Unauthenticated visit to `/admin` → redirected to `/admin/login`; log in with a seeded admin account → redirected to `/admin`.
4. Mark a seeded lead "Read" in the dashboard → badge updates.
5. Send a reply → lead status becomes "Replied".
6. Blog search/filter → open a post → related posts render.
7. Unknown route and unknown `/blog/:slug` → correct fallback behavior.

### Non-Functional Checks
- Lighthouse on `/`, one service page, and `/blog` — target ≥ 90 across Performance/SEO/Accessibility/Best Practices.
- Axe accessibility scan on the same pages.
- Manual RLS check: attempt an anon INSERT/SELECT against `contact_submissions` directly via the Supabase REST API — must fail.

## 2. Test Data
Dedicated Supabase test project (or isolated test admin account); seed one admin user and sample contact/quote rows across all three statuses.

## 3. Coverage Targets
- `src/lib/`: ≥ 90% line coverage.
- Form components: 100% of validation branches.
- Route Handlers: every status code (`200`/`400`/`401`/`403`/`500`) exercised by at least one test.

## 4. CI
`npm run lint`, `npm run test`, `npx playwright test` run on every PR; merges blocked on failure. Playwright can run against Vercel preview deployments.
