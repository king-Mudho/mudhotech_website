import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = new URL(request.url).searchParams.get("type") ?? "contact";
  const body = await request.json().catch(() => ({}));

  return withAdminAuth((token) =>
    djangoFetch(`/api/admin/submissions/${id}/?type=${type}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status: body.status }),
    }),
  );
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = new URL(request.url).searchParams.get("type") ?? "contact";

  return withAdminAuth((token) =>
    djangoFetch(`/api/admin/submissions/${id}/?type=${type}`, { method: "DELETE", token }),
  );
}
