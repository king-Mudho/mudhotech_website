# 10 — Project Structure

```
mudhotech-website/
├── app/
│   ├── layout.tsx                     # Root layout: fonts, ThemeProvider, Navbar, Footer, Toaster, WhatsAppButton, CookieConsent
│   ├── globals.css                    # Design tokens + Tailwind layers
│   ├── page.tsx                       # Home (/)
│   ├── sitemap.ts                     # Dynamic sitemap incl. blog slugs
│   ├── robots.ts
│   ├── about/page.tsx
│   ├── web-software/page.tsx
│   ├── it-support/page.tsx
│   ├── portfolio/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   ├── quote/page.tsx
│   ├── capability-statement/page.tsx  # M9
│   ├── privacy-policy/page.tsx
│   ├── terms-of-service/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                 # Guarded shell
│   │   ├── login/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── page.tsx                   # Dashboard (Contacts / Quotes / Analytics / Settings)
│   ├── api/
│   │   ├── submissions/
│   │   │   ├── contact/route.ts
│   │   │   ├── quote/route.ts
│   │   │   └── software-service/route.ts
│   │   ├── newsletter/route.ts
│   │   └── admin/
│   │       ├── submissions/route.ts
│   │       ├── submissions/[id]/route.ts
│   │       ├── submissions/bulk/route.ts
│   │       ├── reply/route.ts
│   │       ├── analytics/route.ts
│   │       └── notification-preferences/route.ts
│   └── not-found.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                        # shadcn primitives (generated)
│   │   ├── layout/                    # Navbar, Footer, PageHero, Section, SectionBreak
│   │   ├── marketing/                 # ServiceCard, Testimonials, FAQ, TrustedPartners, AnimatedCounter, SkeletonImage
│   │   ├── forms/                     # ContactForm, QuoteForm, SoftwareServiceForm, NewsletterForm
│   │   └── admin/                     # AdminAnalytics, SubmissionTrendsWidget, DateRangeFilter, AdminPagination, NotificationPreferences, AdminReplyDialog
│   ├── data/
│   │   ├── company.ts
│   │   ├── services.ts
│   │   ├── engagementModel.ts
│   │   ├── serviceCommitments.ts
│   │   ├── faq.ts
│   │   ├── partnerships.ts
│   │   ├── roadmap.ts
│   │   └── blogPosts.ts
│   ├── lib/
│   │   ├── utils.ts                   # cn()
│   │   ├── motion.ts                  # shared fadeUp variant
│   │   ├── schemas.ts                 # zod schemas (shared client+server)
│   │   ├── exportUtils.ts             # CSV/PDF export
│   │   └── supabase/
│   │       ├── client.ts              # browser client
│   │       ├── server.ts              # server client (service role, server-only)
│   │       └── middleware.ts          # SSR session helper
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── types/
│       └── database.ts                # generated Supabase types
│
├── middleware.ts                      # /admin/** auth gate
├── public/
│   ├── brand/                         # logo, letterhead assets
│   ├── favicon.ico
│   └── og-image.jpg
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── notify-submission/index.ts
│   │   └── send-reply/index.ts
│   └── migrations/
├── tests/
│   ├── unit/                          # Vitest
│   └── e2e/                           # Playwright
├── .env.example
├── .env.local                         # gitignored
├── next.config.ts
├── tailwind.config.ts
├── components.json                    # shadcn config
└── package.json
```

## Naming & Organization Rules
- Route folders: `kebab-case` (`web-software`, not `webSoftware`).
- Components: `PascalCase.tsx`; utilities/data modules: `camelCase.ts`.
- One component per file; filename matches the exported component.
- Shared logic (validation, motion variants, export helpers) lives in `src/lib/`, never duplicated per page.
