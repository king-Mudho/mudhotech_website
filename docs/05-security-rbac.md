# 05 — Security & Access Control (RBAC)

## 1. Roles
| Role | Description |
|---|---|
| `anon` (public visitor) | No account. Reads all public marketing pages, submits Contact/Quote/Newsletter/Service Request forms. Cannot read submission data back. |
| `authenticated` (non-admin) | Not used in v1 — no public sign-up flow. Reserved for a future client-portal phase. |
| `admin` | Staff. Full CRUD on leads, own notification preferences, read access to the admin roster. |

Roles live in `user_roles` (`app_role` enum: `'admin' | 'user'`).

## 2. Three-Layer Protection Model

**Layer 1 — Middleware guard.** `middleware.ts` runs on every `/admin/**` request (except `/admin/login`, `/admin/reset-password`), reads the Supabase SSR session cookie, and redirects unauthenticated requests to `/admin/login?redirect=<path>` before any admin UI renders — avoids ever mounting a protected shell for an unauthenticated visitor.

**Layer 2 — Database RLS.** Enforced on every table (see `04-database-design.md §5`). `private.has_role()` lives outside `public` so it can't be called directly from the client.

**Layer 3 — Server-side re-verification.** Every admin Route Handler independently re-checks the caller's session + role before touching data — never trusts the middleware pass-through alone.

## 3. Critical Implementation Rule
Role lookups **must always be scoped to the current user**:
```ts
.from("user_roles")
.select("role")
.eq("user_id", session.user.id)
.eq("role", "admin")
.maybeSingle()
```
Omitting `.eq("user_id", ...)` and relying on RLS alone will throw once more than one admin row is visible to that admin — always filter explicitly.

## 4. Auth Flows
- **Sign-in:** `/admin/login` — email/password via Supabase Auth.
- **Password reset:** "Forgot password?" → `resetPasswordForEmail({ redirectTo: '<origin>/admin/reset-password' })` → reset page listens for the `PASSWORD_RECOVERY` auth event (or `type=recovery` in the URL) → `updateUser({ password })`.
- **Sign-out:** clears session; middleware redirects subsequent `/admin/**` requests.
- **Session storage:** Supabase SSR cookie-based session (works with server-rendered middleware checks, unlike a purely `localStorage`-based session).

## 5. Route-Level Access Matrix
| Route | Access |
|---|---|
| All public marketing routes | `anon` |
| Public `POST` submission endpoints | `anon`, rate-limited |
| `/admin/login`, `/admin/reset-password` | `anon` only if no active admin session |
| `/admin/**` | `admin` only |
| Admin Route Handlers (`/app/api/admin/**`) | `admin` only, re-verified server-side |

## 6. Additional Security Baseline
- **CORS** locked to the production origin on every API route and Edge Function — never `*`.
- **Rate limiting** on all public POST endpoints (basic IP-based limiter).
- **Honeypot field** on public forms to reduce spam without a CAPTCHA.
- **Input escaping** — all user-supplied text is escaped before being interpolated into any server-rendered HTML (notification/reply emails especially), preventing HTML/markup injection.
- **Secrets** (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) live only in server environment variables — never in `NEXT_PUBLIC_*` vars, never committed to git.
