/**
 * First-party cookie (not localStorage) so server code — the root layout,
 * when it decides whether to render the GA4 script in Stage 13 — can read
 * consent too. docs/13-deployment-launch.md §3 requires the decline path
 * to be enforced, not just recorded client-side.
 */
export const COOKIE_CONSENT_NAME = "mudhotech_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type CookieConsentValue = "accepted" | "declined";

export function readCookieConsent(cookieHeader: string): CookieConsentValue | null {
  const match = cookieHeader.match(new RegExp(`${COOKIE_CONSENT_NAME}=(accepted|declined)`));
  return (match?.[1] as CookieConsentValue) ?? null;
}
