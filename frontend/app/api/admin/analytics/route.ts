import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function GET(request: Request) {
  const days = new URL(request.url).searchParams.get("days") ?? "30";
  return withAdminAuth((token) => djangoFetch(`/api/admin/analytics/?days=${days}`, { token }));
}
