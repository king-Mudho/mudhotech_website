import { describe, it, expect } from "vitest";
import { visitorIpFrom } from "@/lib/client-ip";

const h = (init: Record<string, string>) => new Headers(init);

describe("visitorIpFrom", () => {
  it("prefers X-Real-IP, which nginx overwrites", () => {
    expect(visitorIpFrom(h({ "x-real-ip": "198.51.100.7", "x-forwarded-for": "10.0.0.1, 203.0.113.9" }))).toBe(
      "198.51.100.7",
    );
  });

  it("falls back to the nearest X-Forwarded-For hop, ignoring client-supplied ones", () => {
    expect(visitorIpFrom(h({ "x-forwarded-for": "1.2.3.4, 203.0.113.9" }))).toBe("203.0.113.9");
  });

  it("handles IPv6", () => {
    expect(visitorIpFrom(h({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });

  it("returns null when nothing usable is present", () => {
    expect(visitorIpFrom(h({}))).toBeNull();
    expect(visitorIpFrom(h({ "x-real-ip": "not an ip", "x-forwarded-for": "evil<script>" }))).toBeNull();
  });
});
