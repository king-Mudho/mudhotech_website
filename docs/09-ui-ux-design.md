# 09 — UI/UX Design System

## 1. Design Tokens (HSL channel triplets, CSS variables)

### Light theme (`:root`)
| Token | HSL | Role |
|---|---|---|
| `--background` | `220 20% 97%` | Page background |
| `--foreground` | `218 74% 15%` | Deep navy text |
| `--primary` | `218 74% 15%` | Brand navy |
| `--accent` | `211 100% 50%` | Electric blue — every CTA, icon, highlight |
| `--secondary` | `220 20% 94%` | Alternating section background |
| `--muted-foreground` | `218 15% 46%` | Body copy |
| `--hero` | `218 74% 10%` | Hero overlay (`/80` opacity over images) |
| `--whatsapp` | `142 70% 45%` | WhatsApp green |
| `--destructive` | `0 84% 60%` | Errors, delete actions |
| `--radius` | `0.5rem` | Base radius |

### Dark theme (`.dark`)
Background near-black navy (`220 40% 6%`), accent brightened (`211 100% 55–60%`).

Define all tokens in `app/globals.css` (with `<alpha-value>` support so utilities like `bg-accent/10` work), consume via `tailwind.config.ts` `theme.extend.colors`. Theme applied with `next-themes`, `attribute="class"`, `defaultTheme="light"`.

## 2. Typography
- **Headings:** Poppins (400/500/600/700/800) → `font-heading`
- **Body:** Open Sans (400/500/600/700) → `font-body`
- Loaded via `next/font/google` in `app/layout.tsx`.

## 3. Spacing & Layout Utilities
```css
.section-padding    /* py-20 md:py-28 — every major section */
.page-padding-top   /* pt-20 — clears the fixed navbar on inner pages */
.prose-custom       /* headings/paragraphs/lists/links for legal + capability-statement pages */
```
Container: centered, `2rem` padding, max `1400px` at `2xl`.

## 4. Motion Vocabulary
Single shared variant in `src/lib/motion.ts` (not redeclared per page):
```ts
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};
```
- Card grids stagger via `transition={{ delay: i * 0.08 }}`.
- Route transitions: a small Client Component wrapper keyed on `usePathname()` for a consistent fade+translate feel between pages.

## 5. Recurring Layout Components
- `<PageHero>` — `relative py-20 overflow-hidden` + cover image + `bg-hero/80` overlay + centered eyebrow / h1 / lead.
- `<Section>` — alternating `bg-background` / `bg-secondary/50` wrapper with `.section-padding`.
- `<ServiceCard>` — `rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-xl transition-all`.
- **Eyebrow label:** `text-accent font-heading font-semibold text-sm uppercase tracking-widest`.
- **Icon chip:** `rounded-lg bg-accent/10 p-3` wrapping a `text-accent` `lucide-react` icon.
- `<SectionBreak>` — full-bleed parallax image band with title/subtitle, driven by scroll progress.

## 6. shadcn/ui Component Inventory
Generate via CLI: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip. Standardize on **Sonner** for toasts (single system).

**`button.tsx` custom variants:**
- `accent` — brand blue fill with a colored glow shadow (primary CTA everywhere)
- `heroOutline` — translucent white outline for use over dark hero images
- `whatsapp` — WhatsApp green
- Extra sizes: `lg` (h-12), `xl` (h-14)

## 7. Responsive & Accessibility Requirements
- Mobile-first; test at 375px, 768px, 1024px, 1440px.
- Every icon-only control gets an `aria-label`.
- Images use `next/image` with meaningful `alt` text and lazy loading by default.
- Skeleton/placeholder states always provide a visible fallback if an image fails to load.
- Audit color contrast for text over photographic hero backgrounds against WCAG AA.

## 8. Brand Assets for the Letterhead
Reuse this exact token set (navy `--primary`, electric blue `--accent`, Poppins headings, Open Sans body) so the printed letterhead visually matches the website — see `06-functional-modules.md §M10`.
