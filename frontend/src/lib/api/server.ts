import "server-only";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

interface DjangoFetchOptions extends RequestInit {
  token?: string;
}

/**
 * Server-only call into the Django API. Every Next.js Route Handler goes
 * through this, and Route Handlers are the only public entry point — the
 * browser never reaches Django directly, so the service-role token and the
 * internal API URL never leave the server.
 */
export async function djangoFetch<T>(path: string, options: DjangoFetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${INTERNAL_API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error?.message ?? "Request failed", body.error?.fields);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
