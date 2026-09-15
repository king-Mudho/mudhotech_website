/**
 * Admin shell. The actual auth gate is middleware.ts (Layer 1) plus
 * per-request re-verification in Django (Layers 2/3) — this layout only
 * handles spacing beneath the fixed navbar.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="page-padding-top min-h-screen">{children}</div>;
}
