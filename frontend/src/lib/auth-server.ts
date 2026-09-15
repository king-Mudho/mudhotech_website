import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

/**
 * Reads the admin access token out of the httpOnly cookie so an admin
 * Route Handler can forward it to Django as a Bearer token. Presence of
 * this cookie is NOT proof of a valid session by itself — Django
 * re-verifies the token and the `is_staff` role on every call (Layer 3,
 * docs/ARCHITECTURE-DEVIATION.md).
 */
export async function getAdminAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}
