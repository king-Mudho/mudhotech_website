import { describe, it, expect } from "vitest";
import { safeAdminRedirect } from "@/lib/auth";

describe("safeAdminRedirect", () => {
  it("keeps same-origin admin paths", () => {
    expect(safeAdminRedirect("/admin")).toBe("/admin");
    expect(safeAdminRedirect("/admin?tab=quotes")).toBe("/admin?tab=quotes");
  });

  it("falls back to the dashboard when nothing is given", () => {
    expect(safeAdminRedirect(null)).toBe("/admin");
    expect(safeAdminRedirect(undefined)).toBe("/admin");
    expect(safeAdminRedirect("")).toBe("/admin");
  });

  it.each([
    "https://evil.example/admin",
    "//evil.example/admin",
    "/\\evil.example",
    "/admin\\@evil.example",
    "javascript:alert(1)",
    "/blog",
    "/admin/login",
  ])("rejects %s", (target) => {
    expect(safeAdminRedirect(target)).toBe("/admin");
  });
});
