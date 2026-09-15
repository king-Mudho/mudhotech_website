# 08 — API Design (Next.js Route Handlers + Supabase Functions)

## 1. Principle
Browser code never talks to Supabase Edge Functions or the service-role key directly. All writes go through **Next.js Route Handlers** under `app/api/`, which validate with shared `zod` schemas, then write to Supabase server-side and trigger email via a Supabase Edge Function.

## 2. Shared Validation Schemas (`src/lib/schemas.ts`)
```ts
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(150),
  message: z.string().min(10).max(2000),
});

export const quoteSchema = z.object({
  name: z.string().min(2).max(100),
  business: z.string().max(150).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  serviceType: z.string(),
  description: z.string().min(10).max(2000),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).optional(),
});

export const softwareServiceRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  serviceCategory: z.string(),
  details: z.string().min(10).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
```
Used by both the client form (`zodResolver`) and the Route Handler (server-side re-validation).

## 3. Public Endpoints
| Endpoint | Body | Behavior |
|---|---|---|
| `POST /api/submissions/contact` | `contactSchema` | Insert into `contact_submissions`, notify admins |
| `POST /api/submissions/quote` | `quoteSchema` | Insert into `quote_requests`, notify admins |
| `POST /api/submissions/software-service` | `softwareServiceRequestSchema` | Insert (tagged `[Software Service Request]`), notify admins |
| `POST /api/newsletter` | `newsletterSchema` | Insert into `newsletter_subscribers`; friendly message on duplicate, not a 500 |

All public POST endpoints: rate-limited, honeypot-checked, return `400` with field errors on validation failure, `500` with a generic message on server error (no internals leaked).

## 4. Admin Endpoints (require session + admin role, re-verified server-side)
| Endpoint | Behavior |
|---|---|
| `GET /api/admin/submissions?type=&status=&from=&to=&search=&page=` | Paginated, server-side filtered/sorted rows |
| `PATCH /api/admin/submissions/:id` | Body `{ status }` — updates one row |
| `POST /api/admin/submissions/bulk` | Body `{ ids, action: "markRead"\|"markReplied"\|"delete" }` |
| `POST /api/admin/reply` | Body `{ to, subject, message, submissionType?, submissionId? }` — re-verifies admin, invokes `send-reply`, updates status to `replied` |
| `GET /api/admin/analytics?from=&to=` | Aggregate counts computed server-side for dashboard charts |
| `GET/PUT /api/admin/notification-preferences` | Current admin's notification toggle rows |

## 5. Supabase Edge Functions

### `notify-submission`
Invoked server-to-server from Route Handlers only. Resolves admin recipients via `admin_notification_preferences` (no row = enabled by default), sends an HTML email per recipient via Resend. **All user-supplied fields are escaped before HTML interpolation.**

### `send-reply`
Requires an `Authorization` bearer token; re-verifies `user_roles` admin membership server-side before sending. Sends a branded HTML reply via Resend; updates submission status when IDs are supplied. Message content is also escaped before interpolation.

## 6. Consistent Error Shape
```json
{ "success": false, "error": { "message": "string", "fields": { "email": "Invalid email" } } }
```

## 7. Cross-Cutting API Requirements
- CORS locked to the production origin on every route/function.
- Rate limiting on all public POST endpoints.
- Honeypot field on every public form.
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) never exposed to the client, never in `NEXT_PUBLIC_*` variables.
