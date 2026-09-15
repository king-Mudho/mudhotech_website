# 06 — Functional Modules (Pages & Features)

Every page/module the site needs, in the order a visitor encounters them, followed by the admin modules.

---

## Public Site Modules

### M1. Home (`/`)
- Full-viewport hero (background image + overlay), 4 trust indicators.
- "Who We Are" summary (from company data — `07-content-data-model.md`).
- Partner logo wall.
- 4 image-backed service category cards (Web/Mobile, IT Consulting, Cloud, Software/ICT).
- "Why MudhoTech" panel with animated counters (projects, clients, years, support).
- Testimonial carousel.
- FAQ accordion.
- Closing CTA → `/quote`.
- JSON-LD: `Organization` + `LocalBusiness`.

### M2. About (`/about`)
- Hero, Mission & Vision, team profiles, company timeline.
- Core values, framed around the company's stated promise: listen before recommending, understand objectives, deliver practical/sustainable technology, maintain transparency, respect confidentiality, dependable support, continuous improvement.
- **Client Engagement Model** sub-section — 7-step process rendered as a step diagram: Initial Consultation → Needs Assessment → Solution Design → Proposal & Planning → Implementation → Training & Handover → Support & Continuous Improvement.
- **Service Level Commitment** sub-section — commitments list (professional communication, transparent project management, timely delivery, quality workmanship, secure/reliable solutions, continuous improvement, responsive support) plus support channels (remote assistance, scheduled maintenance, software updates, troubleshooting, user guidance, performance reviews).

### M3. Web & Software Services (`/web-software`)
- Hero.
- Tabbed view: **Software Services** (5 categories: Core Software Installation & Setup, Security & Maintenance, Academic & Productivity Tools, Design & Creative Tools, Digital Support & Troubleshooting) and **Development Services** (4 categories: Custom Web Systems, E-Commerce Solutions, Mobile App Development, Software Installation & Maintenance).
- "Request Software Service" form — must submit to a real endpoint and trigger a real notification.

### M4. IT Support (`/it-support`)
- Hero.
- 6 hardware/networking categories: Hardware Installation & Upgrades, Laptop & Desktop Repairs, Cleaning & Preventive Maintenance, Networking & Connectivity, Peripheral & Device Setup, Advanced Hardware Support.
- CTA → `/contact`.

### M5. Portfolio (`/portfolio`)
- Hero.
- **Projects** tab — case studies with tech chips + measurable result, filterable by category.
- **Repair Showcases** tab — before/after case studies (problem → work performed → result → turnaround), searchable + tag-filterable.
- **Device Gallery** tab — category-filtered image gallery (own/licensed photography preferred over third-party hotlinking).
- 3 testimonials at close.

### M6. Blog (`/blog`, `/blog/[slug]`)
- List page: hero with live search, category filter chips, post grid, empty state, newsletter signup (must actually submit).
- Detail page: image hero, share buttons (Facebook/X/LinkedIn/WhatsApp), article body, quote CTA, 2 related posts, redirect to `/blog` on an unknown slug.
- Content model:
  ```ts
  interface BlogPost {
    slug: string; title: string; excerpt: string; date: string;
    category: string; image: string; readTime: string;
    content: string[]; // rendered via a proper markdown renderer
  }
  ```
- Starter posts: *5 Signs Your Business Needs Digital Transformation*, *How to Protect Your Business from Cyber Threats*, *Benefits of Cloud Computing for Small Businesses*, *Why Every School Needs a Management System*.

### M7. Contact (`/contact`)
- Hero, 4 contact cards (phone, WhatsApp, email, location), message form, embedded map pinned to the actual office location.
- Form → real submission pipeline, `type: "contact"`.

### M8. Quote (`/quote`)
- Hero, quote form (name, business, email, phone, service type — 10-option list, description, preferred contact method).
- Form → real submission pipeline, `type: "quote"`.

### M9. Capability Statement / Company Profile (`/capability-statement`)
The site's structured, always-current answer to a formal corporate profile document — content sourced from `07-content-data-model.md`:
- **Company Fact Sheet** — table: Company Name, Business Type, Registered Office, Telephone, Email, Website, Primary Services, Target Markets.
- **Partnership Opportunities** — potential partner categories + collaboration areas.
- **Future Roadmap** — Phase 1 (Foundation), Phase 2 (Expansion), Phase 3 (Regional Growth).
- **Tender Readiness & Corporate Capability** — supports vendor registration, RFQs, RFPs, ITTs, capability presentations, partnership discussions; notes what will be added as the company grows (client references, case studies, certifications, team profiles, tech partnerships, awards).
- **Our Promise** section.
- Closing statement and a **"Download as PDF"** action, generated from this same structured data (see `jspdf` in `02-technology-stack.md`).
- Reachable from main nav/footer and linked from `/about`.

### M10. Letterhead (brand asset, not a page)
A branded letterhead template (editable + print-ready), built from:
- Company name + tagline, logo, contact info (address, phone, email, website), registration number, brand colors/fonts from `09-ui-ux-design.md`, footer motto *"Innovation • Integrity • Excellence"*.
- Layout:
  ```
  [LOGO]           COMPANY NAME + TAGLINE
  ------------------------------------------------------------
                      (Letter body area)
  ------------------------------------------------------------
  Address · Phone · Email · Website · Reg No · (social icons)
  ```

### M11. Legal Pages
- `/privacy-policy` — collection, use, cookies, sharing, security, retention, rights, third parties, children, changes, contact.
- `/terms-of-service` — services, quotations, project agreements, payment, IP, client responsibilities, warranties, liability, confidentiality, termination, support, governing law, changes, contact.

### M12. Global Components
Navbar (fixed, theme toggle, admin link when signed in), Footer (4 columns + admin entry point), WhatsApp floating button, scroll-to-top button, cookie consent banner (must actually gate analytics), section-break parallax bands, skeleton image loader, animated counters, FAQ accordion, testimonial carousel, trusted-partners logo grid.

---

## Admin Modules

### M13. Admin Login / Password Reset
Per `05-security-rbac.md §4`.

### M14. Lead Dashboard — Contacts & Quotes Tabs
- KPI tiles: Total Contacts, New Contacts, Total Quotes, New Quotes.
- Always-visible 30-day trend sparkline.
- Search (name/email/subject/message for contacts; name/email/service/description/business for quotes).
- Status filter (All/New/Read/Replied), date-range filter (presets + calendar).
- Bulk actions (Mark Read / Mark Replied / Delete / Clear selection).
- Inline status change (colored badge: blue=new, grey=read, green=replied).
- Row actions: View (detail modal), Reply (dialog), Delete (confirm modal).
- Pagination (10/page), CSV/PDF export of the filtered set (server-side filtering, not client-side over the full table).

### M15. Analytics Tab
Date-range filter (7d/30d/90d presets), 4 summary tiles, 4 charts: daily stacked area, status-distribution donut, contacts-vs-quotes grouped bar, 8-week volume bars.

### M16. Settings Tab
Per-admin notification preference toggles (`new_contact`, `new_quote`), upserted on `(user_id, event_type)`.

---

## Form Functionality Requirement (applies to every form on the site)
Every form — Contact, Quote, Software Service Request, Newsletter — must: validate client-side with `zod`, submit to a real Route Handler, insert a real database row, and trigger a real email notification. No form may show a success state without a corresponding backend effect.
