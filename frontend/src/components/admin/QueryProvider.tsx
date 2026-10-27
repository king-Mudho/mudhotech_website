"use client";

import { useState } from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api/client";

/**
 * The session cookie can outlive the token inside it (a rotated
 * DJANGO_SECRET_KEY, a deactivated account), and middleware.ts only checks
 * the cookie is present. Without this the dashboard sat there showing
 * "Not authorized." on every panel; now it sends the admin back to sign in.
 */
function redirectToLoginOnAuthError(error: unknown) {
  if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
    window.location.assign(`/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000 } },
        queryCache: new QueryCache({ onError: redirectToLoginOnAuthError }),
        mutationCache: new MutationCache({ onError: redirectToLoginOnAuthError }),
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
