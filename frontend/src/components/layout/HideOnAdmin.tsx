"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps public marketing chrome off the internal lead dashboard.
 *
 * /admin renders inside the root layout, so it was inheriting the full
 * marketing footer — quick links, service links, a sitemap's worth of
 * outbound navigation — underneath a staff-only table. Children are passed
 * as a slot, so a Server Component (the Footer) still renders on the server.
 */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
