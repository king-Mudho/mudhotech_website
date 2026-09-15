# 02 — Technology Stack

## 1. Frontend (mandated)
| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router) |
| UI library | **React 18** |
| Language | **TypeScript 5** (strict mode) |
| Styling | **Tailwind CSS 3** |
| Component system | **shadcn/ui** (Radix UI primitives + `class-variance-authority`) |

## 2. Supporting Libraries
| Concern | Package | Notes |
|---|---|---|
| Icons | `lucide-react` | |
| Animation | `framer-motion` | Client Components only |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | Every form is schema-validated, client and server |
| Server/client cache (admin) | `@tanstack/react-query` | Used in the admin dashboard for fetching/caching leads |
| Charts | `recharts` | Admin analytics tab |
| Toasts | `sonner` | Single toast system, no duplicates |
| Theming | `next-themes` | Light/dark, class strategy |
| Carousel | `embla-carousel-react` + autoplay plugin | Testimonials |
| Dates | `date-fns` | |
| CSV/PDF export | `jspdf` + `jspdf-autotable` | Admin export, and the Capability Statement PDF export |
| Analytics | `@next/third-parties` (GA4) | Native Next.js integration |
| Backend SDK | `@supabase/supabase-js`, `@supabase/ssr` | Browser + server clients |
| Testing | `vitest`, `@testing-library/react`, `@playwright/test` | Unit/component + e2e |
| Linting | ESLint 9 (flat config) + `typescript-eslint` + `eslint-config-next` | |

## 3. Backend
- **Supabase** — Postgres (with Row-Level Security on every table), Auth (email/password), and Edge Functions (Deno) for transactional email.
- **Resend** — transactional email provider, called from Supabase Edge Functions.
- Full schema in `04-database-design.md`; API contract in `08-api-design.md`.

## 4. Fonts
- Headings: **Poppins** (400/500/600/700/800)
- Body: **Open Sans** (400/500/600/700)
- Loaded via `next/font/google` in the root layout — single load path, no duplicate `<link>` + CSS `@import`.

## 5. Package Manager
**npm**, single lockfile (`package-lock.json`). No mixing with Bun/Yarn to avoid lockfile drift.

## 6. Hosting & Runtime
- **Vercel** — native Next.js hosting: SSG/ISR, Edge Middleware, image optimization, preview deployments per branch.
- Node.js 18+ runtime (Next.js 15 requirement).

## 7. Environment Variables (overview — full list in `13-deployment-launch.md`)
- Client-exposed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
