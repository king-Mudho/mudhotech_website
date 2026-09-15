# 01 — Project Overview

## 1. Company
**MudhoTech Solutions (Private) Limited** — a Zimbabwean registered ICT company based in Harare, providing full-stack software development, digital transformation, and IT support services.

- Registered Office: 8 Shepperton, Graniteside, Harare, Zimbabwe
- Phone: +263 77 539 8749
- WhatsApp: +263 71 270 0941
- Email: mudhotechsolutions@gmail.com
- Website: www.mudhotech.co.zw *(confirm final domain — also referenced elsewhere as mudhotech.com; pick one canonical domain before launch)*
- Business hours: Mon–Fri 08:00–17:00, Sat by appointment, Sun/public holidays closed

## 2. Brand
- Tagline: *"Innovative Digital Solutions. Reliable IT Support. Simplified."*
- Secondary line: *"We Keep Your Systems Running — Fast, Secure, and Smooth."*
- Motto: *Innovation • Integrity • Excellence*
- Tone: professional, trustworthy, growth-oriented — written for SME clients as well as formal procurement/tender readers (government, NGOs, corporates).

## 3. What the Company Does
- Web & Mobile App Development
- IT Consulting & Support
- Cloud Solutions & Digital Transformation
- Software Installation & Maintenance
- General ICT and Digital Services
- Hardware installation, repair, cleaning/maintenance, and networking support

Target markets: Government, NGOs, Education, Healthcare, Retail, Finance, Manufacturing, Agriculture, Mining, SMEs.

## 4. What the Website Must Do
| Goal | How |
|---|---|
| Explain the services | Two deep service pages (Software/Web/Dev, IT/Hardware Support), each with structured category listings |
| Build trust | Trust indicators, stats, partner logos, testimonials, company timeline, team profiles, FAQ, before/after repair case studies |
| Capture leads | Contact form, Quote form, Software Service Request form, WhatsApp button, click-to-call — all functionally wired, not decorative |
| Rank on search | Per-page metadata, canonical URLs, JSON-LD (`Organization` + `LocalBusiness`), sitemap, robots.txt |
| Publish content | A blog with search, category filters, share buttons, related posts |
| Present corporate credibility | A structured Capability Statement / Company Profile section for tenders, partnerships, and investor conversations |
| Manage leads internally | A private, authenticated admin dashboard for staff to triage, reply to, analyze, and export leads |

## 5. Mandated Frontend Stack
**Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui**, backed by **Supabase** (Postgres, Auth, Edge Functions) for data, authentication, and transactional email via Resend. Full detail in `02-technology-stack.md`.

## 6. Source Content
This documentation set is built from two inputs:
1. A drafted, structured **Company Profile** (5 volumes covering identity, services, technical delivery, governance, and client engagement/capability) — its real content (engagement process, service commitments, fact sheet, FAQ, partnerships, roadmap, promise) is folded into the site as live structured data rather than a static offline document — see `07-content-data-model.md`.
2. The technical specification of an existing site build (page inventory, component list, Supabase schema, edge functions) — reused as the functional baseline and re-platformed onto the new stack — see `06-functional-modules.md` through `13-deployment-launch.md`.

## 7. Success Criteria
- Lighthouse ≥ 90 (Performance, SEO, Accessibility, Best Practices) on the homepage and a representative service page.
- Every form on the site actually submits, validates, and triggers a real email notification — no placeholder/no-op forms.
- Admin can securely log in, triage leads (search/filter/bulk actions/export), reply by email, and view analytics.
- Real GA4 tracking configured (no placeholder IDs).
- No secrets in client-side code or version control.
- Every route has correct, unique metadata and a canonical URL.

## 8. Information Still Needed Before Launch
These should not be guessed — flag and confirm with the business owner:
- Final canonical domain (`.co.zw` vs `.com`)
- Permanent contact email (Gmail vs a domain email)
- Company registration number / VAT number (for footer + letterhead)
- Real team member names/photos, testimonials, partner logos, and portfolio/repair case studies (current placeholders must not go live as real claims)

## 9. Build Roadmap (high level — see each numbered doc for detail)
1. Scaffold Next.js + Tailwind + shadcn/ui, design tokens (`02`, `09`)
2. Stand up Supabase schema, RLS, edge functions (`04`, `05`)
3. Build the structured content layer from the Company Profile (`07`)
4. Build all public pages (`06`)
5. Wire forms to a validated API layer (`08`)
6. Build the authenticated admin dashboard (`05`, `06`)
7. SEO, analytics, compliance pass (`06`, `13`)
8. Testing (`12`)
9. Deploy and launch (`13`)
