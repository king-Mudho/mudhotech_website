/**
 * Geometry for the homepage's 3D network globe (components/marketing/HeroNetwork).
 *
 * Kept free of DOM and canvas code so it can be unit-tested. Points sit on a
 * unit sphere; rotating the sphere never changes the distance between two
 * points, so the links are worked out once and reused every frame.
 */

export type Vec3 = [number, number, number];

/**
 * `count` points spread evenly over a unit sphere (the Fibonacci lattice),
 * nudged by a seeded jitter so the globe reads as a network, not a mesh.
 */
export function spherePoints(count: number, jitter = 0.08, seed = 7): Vec3[] {
  const rand = seeded(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const p: Vec3 = [
      Math.cos(theta) * r + (rand() - 0.5) * jitter,
      y + (rand() - 0.5) * jitter,
      Math.sin(theta) * r + (rand() - 0.5) * jitter,
    ];
    const len = Math.hypot(p[0], p[1], p[2]);
    points.push([p[0] / len, p[1] / len, p[2] / len]);
  }
  return points;
}

/** Each point linked to its `k` nearest neighbours, as unique [a, b] pairs with a < b. */
export function nearestLinks(points: Vec3[], k = 3): [number, number][] {
  const seen = new Set<string>();
  const links: [number, number][] = [];
  points.forEach((p, i) => {
    const nearest = points
      .map((q, j) => ({ j, d: j === i ? Infinity : (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2 }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j } of nearest) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        links.push([a, b]);
      }
    }
  });
  return links;
}

/**
 * Rotate a point by `yaw` around the vertical axis, then `pitch` around the
 * horizontal one. Returns the rotated point; z > 0 faces the viewer.
 */
export function rotate([x, y, z]: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
}

/** Small deterministic PRNG (mulberry32), so the globe looks the same on every load. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
