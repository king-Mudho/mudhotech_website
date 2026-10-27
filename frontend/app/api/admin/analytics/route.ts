import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function GET(request: Request) {
  const days = new URL(request.url).searchParams.get("days") ?? "30";
  const params = new URLSearchParams({ days });
  return withAdminAuth((token) => djangoFetch(`/api/admin/analytics/?${params}`, { token }));
}
