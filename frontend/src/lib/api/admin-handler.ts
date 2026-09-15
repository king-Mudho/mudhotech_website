import "server-only";
import { NextResponse } from "next/server";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { getAdminAccessToken } from "@/lib/auth-server";

/**
 * Wraps every admin Route Handler: pulls the token from the httpOnly
 * cookie and forwards it to Django, which re-verifies the session and the
 * is_staff role on every call (Layer 3). A present cookie alone is never
 * treated as authorization.
 */
export async function withAdminAuth<T>(
  call: (token: string) => Promise<T>,
): Promise<NextResponse> {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ success: false, error: { message: "Not authenticated." } }, { status: 401 });
  }

  try {
    const data = await call(token);
    return NextResponse.json(data ?? { success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      const message = error.status === 401 || error.status === 403 ? "Not authorized." : error.message;
      return NextResponse.json({ success: false, error: { message } }, { status: error.status });
    }
    console.error("Admin request failed:", error);
    return NextResponse.json({ success: false, error: { message: "Something went wrong." } }, { status: 500 });
  }
}

export { djangoFetch };
