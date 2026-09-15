/**
 * Shared honeypot pattern for every public form (docs/05-security-rbac.md §6).
 * The field name is deliberately plain-looking so scrapers fill it in;
 * real users never see or reach it. Checked again server-side in Django
 * (backend/leads/validators.py) — the client-side emptiness is not trusted
 * on its own.
 */
export const HONEYPOT_FIELD_NAME = "website";

export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
