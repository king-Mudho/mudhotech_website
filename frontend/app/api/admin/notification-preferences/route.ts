import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function GET() {
  return withAdminAuth((token) => djangoFetch("/api/admin/notification-preferences/", { token }));
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));

  return withAdminAuth((token) =>
    djangoFetch("/api/admin/notification-preferences/", {
      method: "PUT",
      token,
      body: JSON.stringify(body),
    }),
  );
}
