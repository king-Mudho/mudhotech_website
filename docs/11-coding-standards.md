# 11 — Coding Standards

## 1. Language & Types
- TypeScript **strict mode** on.
- No `any` without an inline comment justifying it.
- Explicit return types on exported functions and Route Handlers.
- Shared types (Supabase-generated `Database` type, `zod`-inferred form types) live in `src/types/` and `src/lib/schemas.ts`.

## 2. Component Conventions
- Default to **Server Components**. Add `"use client"` only when a file needs interactivity, browser APIs, or a client-only library (Framer Motion, Recharts, Embla).
- One component per file; filename matches the exported component.
- Props typed with an explicit `interface ComponentNameProps`.
- Never redefine animation objects inline — import `fadeUp` from `src/lib/motion.ts`.

## 3. Styling
- Tailwind utility classes only; inline `style={}` reserved for computed/dynamic values.
- Use `cn()` (`clsx` + `tailwind-merge`) for conditional classes.
- Never hardcode hex/RGB colors — always reference design tokens (`bg-accent`, `text-primary`, etc.).

## 4. Forms
- Every form uses `react-hook-form` + the matching `zod` schema via `zodResolver`.
- No form relies on HTML5 `required` alone for validation.
- All forms show field-level error messages and a submit-pending state.

## 5. Data Fetching
- Server Components fetch directly via the Supabase server client wherever possible.
- Client Components (admin dashboard) use TanStack React Query for caching/refetching.
- The service-role key is never called from a Client Component or exposed via `NEXT_PUBLIC_*`.

## 6. Naming
- Files/components: `PascalCase.tsx`; utilities/data: `camelCase.ts`.
- Route folders: `kebab-case`.
- Database columns: `snake_case`.
- Zod schema variables: `camelCaseSchema`.

## 7. Linting & Formatting
- ESLint 9 flat config + `typescript-eslint` + `eslint-config-next`.
- Prettier for formatting; enforce via `lint-staged` + `husky` pre-commit hook.
- `npm run lint` must pass with zero errors before merge.

## 8. Git & Commits
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- `.env*.local` and any secret-bearing file must never be committed — `.gitignore` enforced from the first commit.

## 9. Security Baseline
- No `SECURITY DEFINER` function callable via PostgREST unless explicitly intended.
- Escape all user-supplied content before interpolating into any server-rendered HTML.
- Lock CORS on all API routes/edge functions to the production origin.
- Rate-limit all public POST endpoints.

## 10. Accessibility Baseline
- All interactive icon-only elements require `aria-label`.
- All images require meaningful `alt` text.
- Color contrast checked against WCAG AA for all text-over-image treatments.

## 11. Comments
- Complex business logic (RLS-dependent queries, role checks) gets a short "why" comment.
- Placeholder content is marked `// TODO(content):` so it's greppable before launch.
