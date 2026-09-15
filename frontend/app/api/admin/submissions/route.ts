import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  for (const key of ["type", "status", "from", "to", "search", "page"]) {
    const value = incoming.get(key);
    if (value) params.set(key, value);
  }

  return withAdminAuth((token) => djangoFetch(`/api/admin/submissions/?${params}`, { token }));
}
