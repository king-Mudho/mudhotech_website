import { NextResponse } from "next/server";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { getAdminAccessToken } from "@/lib/auth-server";
import { ADMIN_REFRESH_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/auth";

/**
 * Revokes the access token in Django, then clears the cookies. Deleting the
 * cookie alone left the JWT valid for the rest of its 8 hours, so any copy
 * of it kept working after "Sign Out".
 *
 * The cookies are cleared whatever Django says: a 401 means the token was
 * already expired or revoked, and the visitor asked to be signed out of this
 * browser either way. A failed revocation is logged, not shown.
 */
export async function POST() {
  const token = await getAdminAccessToken();

  if (token) {
    try {
      await djangoFetch("/api/auth/logout/", { method: "POST", token });
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error("Admin logout: token could not be revoked:", error);
      }
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  response.cookies.delete(ADMIN_REFRESH_COOKIE);
  return response;
}
