import { NextResponse } from "next/server";
import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

/**
 * Builds the Django path from validated parts only. `id` arrives
 * URL-decoded, so interpolating it raw let `..%2F..` walk the proxied
 * request onto a different Django endpoint with the admin's token attached.
 */
function djangoPath(request: Request, id: string): string | null {
  if (!/^\d+$/.test(id)) return null;
  const type = new URL(request.url).searchParams.get("type") ?? "contact";
  return `/api/admin/submissions/${id}/?${new URLSearchParams({ type })}`;
}

const invalidId = () =>
  NextResponse.json({ success: false, error: { message: "Invalid submission id." } }, { status: 400 });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const path = djangoPath(request, (await params).id);
  if (!path) return invalidId();
  const body = await request.json().catch(() => ({}));

  return withAdminAuth((token) =>
    djangoFetch(path, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status: body.status }),
    }),
  );
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const path = djangoPath(request, (await params).id);
  if (!path) return invalidId();

  return withAdminAuth((token) => djangoFetch(path, { method: "DELETE", token }));
}
