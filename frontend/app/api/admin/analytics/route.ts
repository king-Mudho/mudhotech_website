import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

const MAX_DAYS = 366;

export async function GET(request: Request) {
  // Parsed to a bounded integer so only a number reaches the upstream URL.
  const requested = Number.parseInt(new URL(request.url).searchParams.get("days") ?? "", 10);
  const days = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), MAX_DAYS) : 30;
  return withAdminAuth((token) => djangoFetch(`/api/admin/analytics/?days=${days}`, { token }));
}
