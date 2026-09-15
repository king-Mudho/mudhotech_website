import { NextResponse } from "next/server";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { getAdminAccessToken } from "@/lib/auth-server";

export async function GET() {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const me = await djangoFetch<{ id: number; email: string; is_staff: boolean }>("/api/auth/me/", { token });
    return NextResponse.json({ isAdmin: me.is_staff, email: me.email });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return NextResponse.json({ isAdmin: false });
    }
    return NextResponse.json({ isAdmin: false });
  }
}
