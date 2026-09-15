import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return withAdminAuth((token) =>
    djangoFetch("/api/admin/submissions/bulk/", {
      method: "POST",
      token,
      body: JSON.stringify({ ids: body.ids, action: body.action, type: body.type }),
    }),
  );
}
