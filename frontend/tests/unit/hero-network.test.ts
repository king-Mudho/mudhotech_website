import { describe, it, expect } from "vitest";
import { nearestLinks, rotate, spherePoints } from "@/lib/hero-network";

describe("hero network geometry", () => {
  it("puts every point on the unit sphere", () => {
    for (const [x, y, z] of spherePoints(120)) expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
  });

  it("is the same on every load", () => {
    expect(spherePoints(40)).toEqual(spherePoints(40));
  });

  it("links every point, with no duplicate or self links", () => {
    const points = spherePoints(64);
    const links = nearestLinks(points, 3);
    const keys = links.map(([a, b]) => `${a}-${b}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const [a, b] of links) expect(a).toBeLessThan(b);
    const linked = new Set(links.flat());
    expect(linked.size).toBe(points.length);
  });

  it("keeps links short, so the globe reads as a surface network", () => {
    const points = spherePoints(120);
    for (const [a, b] of nearestLinks(points, 3)) {
      const [p, q] = [points[a], points[b]];
      expect(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])).toBeLessThan(0.5);
    }
  });

  it("rotates without stretching", () => {
    const p = spherePoints(10)[3];
    const r = rotate(p, 1.1, 0.4);
    expect(Math.hypot(...r)).toBeCloseTo(1, 9);
    expect(rotate(p, 0, 0)).toEqual(p);
  });
});
