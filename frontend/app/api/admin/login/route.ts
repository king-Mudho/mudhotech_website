import { NextResponse } from "next/server";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { ADMIN_REFRESH_COOKIE, ADMIN_REFRESH_MAX_AGE, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth";

interface DjangoLoginResponse {
  access: string;
  refresh: string;
  user: { id: number; email: string; is_staff: boolean };
}

/**
 * Proxies admin login to Django and sets the access/refresh tokens as
 * httpOnly cookies — the browser never sees the JWTs directly (docs/
 * ARCHITECTURE-DEVIATION.md's session design). This is the front door
 * `middleware.ts` checks the resulting cookie for.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { success: false, error: { message: "Username and password are required." } },
      { status: 400 },
    );
  }

  try {
    const data = await djangoFetch<DjangoLoginResponse>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username: body.username, password: body.password }),
    });

    const response = NextResponse.json({ success: true, user: data.user });
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set(ADMIN_SESSION_COOKIE, data.access, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    response.cookies.set(ADMIN_REFRESH_COOKIE, data.refresh, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_REFRESH_MAX_AGE,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ success: false, error: { message: error.message } }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: { message: "Login failed." } }, { status: 500 });
  }
}
