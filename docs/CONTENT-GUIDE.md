# Updating the Website's Content

Everything a visitor reads lives in `frontend/src/data/` as plain TypeScript. Edit the data file, and every page, the sitemap, the capability-statement PDF, and the structured data (JSON-LD) that read it update together. You do not need to touch page components for routine changes.

After any edit, check locally (see [Preview locally](#preview-locally)), then commit and deploy (see `deploy/README.md`).

---

## Contact details, hours, and address

`frontend/src/data/company.ts`

| Field              | Where it appears                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `contact.phone`    | Homepage hero, contact page, IT Support request section, closing call-to-action, footer, form confirmations, JSON-LD |
| `contact.whatsapp` | Every WhatsApp button and link (the number is normalised to digits automatically)                                    |
| `contact.email`    | Contact page, footer, JSON-LD                                                                                        |
| `registeredOffice` | Contact page, footer, map, JSON-LD                                                                                   |
| `hours.*`          | Contact page, closing call-to-action, IT Support request section                                                     |

If you change the hours, also update `openingHoursSpecification` in `frontend/src/components/seo/JsonLd.tsx`, which states them in machine-readable form.

## Promises to customers

`frontend/src/data/commitments.ts` holds every promise the site makes: free diagnosis, reply time, ownership, and repair intake. Each is repeated on several pages; edit the wording here once. If a promise no longer applies, change it to what is true rather than deleting it, and check the pages that use it still read naturally.

`paymentsNote` in the same file is the caveat shown wherever a payment provider is named. Keep it next to any new payment claim.

## Services

`frontend/src/data/services.ts`

- `devServices`: the **Software Development** page (`/web-software`).
- `softwareServices` and `hardwareServices`: the **IT Support** page (`/it-support`), arranged into the three groups in `supportGroups`.

Each service has a one-line `description`, a longer `detail`, an `items` checklist, an optional `worksWith` list of named products, `bestFor`, and an optional `note` for caveats. The card shows the description, the first four items, the note and the works-with list; `detail` and `bestFor` sit behind its "More about this service" toggle. Set `image` to a photo in `public/images/` that genuinely shows the work, and it heads the card; leave it out and the card shows generated artwork (`ServiceArt`) instead. Two services have no photo yet: Core Software Installation & Setup and Peripheral & Device Setup. `turnaround` is deliberately empty; add it only when you can always honour it.

To add a service to IT Support, add it to `softwareServices` or `hardwareServices`, then add its exact title to one of the groups in `supportGroups`. A unit test fails if a support service is left out of every group.

## Portfolio: adding a real case study

`frontend/src/data/portfolio.ts` → `caseStudies`

1. Get the client's written permission to publish, and agree what may be named. Without permission, describe the client instead, for example "A multi-branch retailer in Harare".
2. Put screenshots or photos in `frontend/public/images/work/`. Use your own photos or ones the client supplies; never stock photos.
3. Add an entry:

   ```ts
   {
     slug: "harare-retailer-stock-system",
     title: "Stock and sales system for a three-branch retailer",
     client: "A multi-branch retailer in Harare",
     sector: "Retail",
     path: "build",            // or "support"
     challenge: "…",
     solution: "…",
     outcome: "…",             // only a result the client has confirmed; otherwise leave it out
     images: [{ src: "/images/work/retailer-dashboard.png", alt: "Stock dashboard showing three branches" }],
     year: 2026,
     permissionConfirmed: true, // the entry stays hidden until this is true
   }
   ```

When the first case study is published, the "No case studies published yet" panel disappears automatically. The illustrative examples below it are always labelled as such; edit them in `exampleProjects`, but never add outcomes or figures to them.

## Blog posts

`frontend/src/data/blogPosts.ts`

Add an object with `slug` (the URL), `title`, `excerpt`, `date` (YYYY-MM-DD; use the real publication date), `readTime`, `category`, `image` (a file in `public/images/`), and `content` (an array of paragraphs; a paragraph starting `## ` becomes a sub-heading, and `**Bold:**` at the start of a paragraph renders as a bold lead-in). The post appears on `/blog`, in the sitemap, and with article structured data automatically.

## FAQs

`frontend/src/data/faq.ts`: `faq` (homepage), `buildFaq` (Software Development), and `supportFaq` (IT Support). The page's FAQ structured data reads the same list, so search engines always see what visitors see.

## Images

- Service cards show their `image` photo (or generated artwork without one); blog cards show the post's `image`. Section bands are drawn in code (`SectionBreak.tsx`).
- Use only photos you own or are licensed to use. Images copied from other companies' adverts (often watermarked) must not be used.

- Put images in `frontend/public/images/` and reference them as `/images/<file>`.
- Prefer JPG or PNG around 1600 px wide; the site resizes and converts them to AVIF/WebP automatically.
- Remote image hosts are deliberately not allowed (`next.config.ts`), so hot-linked stock photos cannot creep back in.
- The logo is `public/images/mudhotech-logo.png`. In Figma it is the `Logo` component: drop the PNG onto its `logo-image` layer and every instance updates.

## Testimonials and partner logos

`frontend/src/components/marketing/Testimonials.tsx` and `TrustedPartners.tsx` exist but are not rendered, because their current content is invented. Replace the content with real, attributable quotes and logos you have permission to use, then add the components back in `frontend/app/page.tsx`.

## Preview locally

```bash
# once
cd backend && cp .env.example .env && python -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/python manage.py migrate
cd ../frontend && npm install

# each time, in two terminals
backend/.venv/bin/python backend/manage.py runserver 8000
npm --prefix frontend run dev        # http://localhost:3000
```

Before committing, run the same checks CI runs:

```bash
npm --prefix frontend run lint && npm --prefix frontend run typecheck && npm --prefix frontend test
cd backend && .venv/bin/python manage.py test
```
