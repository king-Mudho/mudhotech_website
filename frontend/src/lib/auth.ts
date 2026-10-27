export const ADMIN_SESSION_COOKIE = "mudhotech_admin_session";
// No longer issued: nothing ever used the refresh token, so it was a 14-day
// credential sitting in the browser for no benefit. Logout still clears it
// for sessions created before the change.
export const ADMIN_REFRESH_COOKIE = "mudhotech_admin_refresh";

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8h — matches SIMPLE_JWT ACCESS_TOKEN_LIFETIME

const DEFAULT_ADMIN_PATH = "/admin";

/**
 * Where to send an admin after sign-in. The `redirect` query parameter is
 * attacker-controllable (anyone can link to /admin/login?redirect=...), and
 * router.push() happily navigates off-site, so a crafted link could bounce a
 * freshly signed-in admin to a look-alike page. Only same-origin /admin paths
 * are honoured; `//host` and `/\host` are protocol-relative in browsers and
 * are rejected along with absolute URLs.
 */
export function safeAdminRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith(DEFAULT_ADMIN_PATH)) return DEFAULT_ADMIN_PATH;
  if (/[\\\s]/.test(target) || target.startsWith("//")) return DEFAULT_ADMIN_PATH;
  if (target.startsWith("/admin/login")) return DEFAULT_ADMIN_PATH;
  return target;
}
