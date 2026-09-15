# 13 — SEO, Compliance & Deployment

## 1. SEO Implementation
- Every route exports `generateMetadata()`: `title` (`"<Page Title> | MudhoTech Solutions"`), `description`, canonical `alternates.canonical`, full Open Graph + Twitter card fields.
- Root layout sets shared defaults (site name, default OG image, `en_ZW` locale, Twitter `summary_large_image`).
- `app/sitemap.ts` — generates all static routes **plus every blog slug** dynamically from `src/data/blogPosts.ts`, so it can never drift out of sync.
- `app/robots.ts` — explicit crawl rules + sitemap reference.
- JSON-LD: shared `<OrganizationJsonLd />` (site-wide, root layout) + `<LocalBusinessJsonLd />` (homepage — opening hours, `priceRange`, `serviceArea`, `knowsAbout`).

## 2. Analytics
GA4 via `@next/third-parties/google`'s `<GoogleAnalytics gaId={...} />`, injected **only after cookie consent is accepted**. Real measurement ID stored in `NEXT_PUBLIC_GA_MEASUREMENT_ID` — never a placeholder value in production.

## 3. Cookie Consent & Legal
- Consent banner shown once per visitor (first-party cookie, not `localStorage`, so server logic can also read it).
- Decline → analytics never loads. Accept → GA4 loads. This must be enforced, not just recorded.
- `/privacy-policy` and `/terms-of-service` kept accurate to the actual data flows (Resend, Supabase, GA4) implemented in the site.

## 4. Hosting
**Vercel** — native Next.js support: SSG/ISR, Edge Middleware, image optimization, preview deployments per branch.

## 5. Domains
Confirm the single canonical production domain first (see `01-project-overview.md §8`). Configure it in Vercel; 301-redirect any secondary domain the company owns to it. `NEXT_PUBLIC_SITE_URL` must match exactly (including `www.` vs bare-domain).

## 6. Environments
| Environment | Trigger | Notes |
|---|---|---|
| Local | `npm run dev` | `.env.local`, hosted Supabase project |
| Preview | Every PR/branch push | Vercel preview URL |
| Production | Merge to `main` | Custom domain, production secrets |

## 7. Environment Variables
**Client-exposed:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```
**Server-only (Vercel project settings, never committed):**
```env
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```
**Supabase Edge Function secrets:**
```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

## 8. Deployment Steps
1. Provision/confirm the Supabase project; apply all migrations from `04-database-design.md` in order.
2. Deploy Edge Functions:
   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   supabase functions deploy notify-submission
   supabase functions deploy send-reply
   supabase secrets set RESEND_API_KEY=<key>
   ```
3. Create the Vercel project, connect the repo, set all environment variables.
4. Configure the custom domain + redirects.
5. Trigger the first production deploy; verify `robots.txt`, `sitemap.xml`, and JSON-LD render correctly.
6. Verify GA4 fires only after cookie consent.
7. Create the first real admin account per `04-database-design.md §6`.
8. Swap the Resend sender to a verified domain address before go-live.
9. Smoke-test: submit Contact form, submit Quote form, confirm the notification email arrives end-to-end in production.

## 9. Security Headers (`next.config.ts`)
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Baseline `Content-Security-Policy` allowing Supabase, GA4, and any embedded map provider.

## 10. Monitoring & Rollback
- Vercel deployment history provides instant rollback.
- Monitor Supabase Edge Function logs for delivery failures.
- Basic uptime check against `/` and the contact submission endpoint post-launch.

## 11. Launch Checklist
- [ ] Canonical domain decided and configured
- [ ] Real GA4 measurement ID set
- [ ] `.env` not committed; secrets only in Vercel/Supabase settings
- [ ] All forms submit successfully end-to-end
- [ ] Admin login works; role checks correctly scoped to `user_id`
- [ ] `sitemap.xml` includes all blog slugs
- [ ] Resend sender is a verified domain address
- [ ] CORS locked to production origin on all API routes/edge functions
- [ ] Rate limiting active on public POST endpoints
- [ ] Lighthouse ≥ 90 on key pages
- [ ] Real team/testimonial/partner/portfolio content in place (or explicitly deferred with stakeholder sign-off)
