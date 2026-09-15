import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];

/**
 * Layer 1 of the three-layer model (docs/ARCHITECTURE-DEVIATION.md /
 * docs/05-security-rbac.md §2): redirects unauthenticated /admin/** visits
 * before any admin UI mounts. This is a presence check on the httpOnly
 * session cookie only — it does not verify the JWT signature (middleware
 * runs on the Edge runtime without the Django secret). Real enforcement is
 * Django's DRF permission classes (Layer 2) plus per-view re-verification
 * (Layer 3), re-checked on every admin API call regardless of this cookie.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (!session?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
