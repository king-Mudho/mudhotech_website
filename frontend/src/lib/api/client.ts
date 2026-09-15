export class ApiClientError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/**
 * Browser-side fetch wrapper. Only ever calls same-origin Next.js Route
 * Handlers (`/api/...`) — never the Django API directly. Used by form
 * submit handlers and the admin dashboard's TanStack Query hooks.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(res.status, body.error?.message ?? "Request failed", body.error?.fields);
  }

  return body as T;
}
