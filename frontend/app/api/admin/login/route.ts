import { NextResponse } from "next/server";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth";

interface DjangoLoginResponse {
  access: string;
  user: { id: number; email: string; is_staff: boolean };
}

/**
 * DRF reports errors as `{detail}`, which djangoFetch does not read, so every
 * failure used to surface as "Request failed". 401 and 403 share one message
 * on purpose: Django answers "Admin role required." for a correct password on
 * a non-staff account, and echoing that confirms the password is right.
 */
function loginErrorMessage(status: number): string {
  if (status === 401 || status === 403 || status === 400) return "Incorrect username or password.";
  if (status === 429) return "Too many sign-in attempts. Please wait a while and try again.";
  return "Sign-in is unavailable right now. Please try again shortly.";
}

/**
 * Proxies admin login to Django and sets the access token as an
 * httpOnly cookie — the browser never sees the JWTs directly (docs/
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

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status >= 500 ? 502 : error.status;
      return NextResponse.json({ success: false, error: { message: loginErrorMessage(error.status) } }, { status });
    }
    console.error("Admin login failed:", error);
    return NextResponse.json({ success: false, error: { message: loginErrorMessage(500) } }, { status: 502 });
  }
}
