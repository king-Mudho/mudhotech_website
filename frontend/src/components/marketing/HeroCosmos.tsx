"use client";

import { useEffect, useRef } from "react";
import { nearestLinks, rotate, spherePoints, type Vec3 } from "@/lib/hero-network";

/**
 * Full-cover animated 3D scene behind every page hero: a turning network
 * globe at the centre, three tilted orbits with shaded planets travelling
 * round them (passing in front of and behind the globe), and a twinkling
 * starfield. The whole scene drifts slowly between blue, cyan and indigo.
 *
 * Drawn on the 2D canvas with a hand-rolled projection (no three.js), and
 * built not to cost the page anything:
 * - starts on requestIdleCallback, after the headline has painted, then fades in;
 * - pauses while the hero is off screen or the tab is hidden;
 * - with "reduce motion" it draws one still frame;
 * - it is aria-hidden and ignores the pointer, and the hero puts a soft
 *   scrim behind its text so contrast never depends on the animation.
 */

type Orbit = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  phase: number;
  size: number;
  hueShift: number;
};

const orbits: Orbit[] = [
  { radius: 1.45, tiltX: 1.15, tiltZ: 0.35, speed: 0.22, phase: 0.4, size: 0.1, hueShift: -18 },
  { radius: 1.95, tiltX: 1.3, tiltZ: -0.45, speed: 0.14, phase: 2.2, size: 0.15, hueShift: 22 },
  { radius: 2.5, tiltX: 1.05, tiltZ: 0.15, speed: 0.09, phase: 4.1, size: 0.12, hueShift: 40 },
];

interface HeroCosmosProps {
  /**
   * Where the globe sits, as a fraction of the hero's height. The homepage
   * hero also holds the service cards below the headline, so its globe sits
   * higher than on the other pages.
   */
  focusY?: number;
}

export function HeroCosmos({ focusY = 0.5 }: HeroCosmosProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let points: Vec3[] = [];
    let links: [number, number][] = [];
    let stars: { x: number; y: number; r: number; phase: number; speed: number; drift: number }[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let dark = false;
    let time = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    let started = false;

    const build = () => {
      const mobile = width < 640;
      points = spherePoints(mobile ? 70 : 120);
      links = nearestLinks(points, 3);
      let seed = 11;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      stars = Array.from({ length: mobile ? 70 : 150 }, () => ({
        x: rand(),
        y: rand(),
        r: 0.4 + rand() * 1.3,
        phase: rand() * Math.PI * 2,
        speed: 0.6 + rand() * 1.6,
        drift: 0.002 + rand() * 0.006,
      }));
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const nextWidth = Math.round(box.width);
      const rebuild = nextWidth < 640 !== width < 640 || points.length === 0;
      width = nextWidth;
      height = Math.round(box.height);
      dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      if (rebuild) build();
    };

    const draw = () => {
      const mobile = width < 640;
      const stage = height * Math.min(1, focusY * 2);
      const R = mobile ? Math.min(width * 0.42, 180) : Math.min(width * 0.25, stage * 0.42, 330);
      const cx = width / 2;
      const cy = height * focusY;
      const yaw = 0.6 + time * 0.06 + tiltX;
      const pitch = 0.32 + tiltY;
      // Hue drifts between cyan-blue (194) and indigo (230) over ~45 s.
      const hue = 212 + 18 * Math.sin((time / 45) * Math.PI * 2);
      const light = dark ? 64 : 46;
      const colour = (h: number, a: number, l = light) => `hsla(${h}, 90%, ${l}%, ${a})`;
      const project = ([x, y, z]: Vec3) => {
        const s = 6 / (6 - z);
        return { x: cx + x * R * s, y: cy + y * R * s, z, s };
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Starfield.
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
        const x = ((star.x + time * star.drift) % 1) * width;
        ctx.beginPath();
        ctx.arc(x, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = dark ? `hsla(${hue}, 60%, 90%, ${0.25 + 0.6 * twinkle})` : colour(hue, 0.1 + 0.3 * twinkle, 55);
        ctx.fill();
      }

      // Orbits and the planets on them, split by depth so planets pass
      // behind and in front of the globe.
      const planets: { x: number; y: number; z: number; r: number; hue: number }[] = [];
      for (const orbit of orbits) {
        const placed = (angle: number): Vec3 => {
          const local: Vec3 = [Math.cos(angle) * orbit.radius, 0, Math.sin(angle) * orbit.radius];
          // Tilt the orbit plane, then turn it with the scene.
          const tilted = rotate(rotate(local, 0, orbit.tiltX), orbit.tiltZ, 0);
          return rotate(tilted, yaw * 0.35, pitch * 0.5);
        };
        ctx.beginPath();
        for (let i = 0; i <= 96; i++) {
          const p = project(placed((i / 96) * Math.PI * 2));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = colour(hue + orbit.hueShift, dark ? 0.32 : 0.24);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        const p = project(placed(orbit.phase + time * orbit.speed));
        planets.push({ x: p.x, y: p.y, z: p.z, r: orbit.size * R * p.s, hue: hue + orbit.hueShift });
      }

      const drawPlanet = (planet: (typeof planets)[number]) => {
        const glow = ctx.createRadialGradient(planet.x, planet.y, planet.r * 0.6, planet.x, planet.y, planet.r * 2.6);
        glow.addColorStop(0, colour(planet.hue, dark ? 0.35 : 0.22));
        glow.addColorStop(1, colour(planet.hue, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.r * 2.6, 0, Math.PI * 2);
        ctx.fill();
        const body = ctx.createRadialGradient(
          planet.x - planet.r * 0.35,
          planet.y - planet.r * 0.4,
          planet.r * 0.1,
          planet.x,
          planet.y,
          planet.r,
        );
        body.addColorStop(0, `hsla(${planet.hue}, 95%, ${dark ? 85 : 80}%, 0.95)`);
        body.addColorStop(0.55, colour(planet.hue, 0.9));
        body.addColorStop(1, `hsla(${planet.hue}, 90%, ${dark ? 30 : 28}%, 0.95)`);
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
        ctx.fill();
      };

      for (const planet of planets) if (planet.z < 0) drawPlanet(planet);

      // The network globe.
      const projected = points.map((pt) => {
        const [x, y, z] = rotate(pt, yaw, pitch);
        const s = 1 + z * 0.22;
        return { x: cx + x * R * s, y: cy + y * R * s, depth: (z + 1) / 2 };
      });
      const lineAlpha = (dark ? 0.5 : 0.42) * (mobile ? 0.8 : 1);
      for (let band = 0; band < 4; band++) {
        ctx.beginPath();
        for (const [a, b] of links) {
          const depth = (projected[a].depth + projected[b].depth) / 2;
          if (Math.min(3, Math.floor(depth * 4)) !== band) continue;
          ctx.moveTo(projected[a].x, projected[a].y);
          ctx.lineTo(projected[b].x, projected[b].y);
        }
        ctx.strokeStyle = colour(hue, lineAlpha * (0.2 + 0.8 * ((band + 0.5) / 4)));
        ctx.stroke();
      }
      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8 + p.depth * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colour(hue, (dark ? 0.9 : 0.75) * (0.15 + 0.85 * p.depth));
        ctx.fill();
      }

      for (const planet of planets) if (planet.z >= 0) drawPlanet(planet);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      time += dt;
      tiltX += (targetX - tiltX) * Math.min(1, dt * 2.5);
      tiltY += (targetY - tiltY) * Math.min(1, dt * 2.5);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!started) return;
      if (reduceMotion.matches) {
        tiltX = tiltY = targetX = targetY = 0;
        draw();
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const onPointer = (e: PointerEvent) => {
      targetX = ((e.clientX / window.innerWidth) * 2 - 1) * 0.25;
      targetY = ((e.clientY / window.innerHeight) * 2 - 1) * 0.12;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (started) draw();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      if (started) draw();
    });

    const start = () => {
      started = true;
      dark = document.documentElement.classList.contains("dark");
      resize();
      draw();
      canvas.dataset.ready = "true";
      resizeObserver.observe(canvas);
      visibility.observe(canvas);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      document.addEventListener("visibilitychange", sync);
      reduceMotion.addEventListener("change", sync);
      if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
      sync();
    };

    // After first paint and hydration, so the headline is never held back.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [focusY]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
      style={{
        maskImage: "linear-gradient(to bottom, #000 78%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent)",
      }}
    />
  );
}

/**
 * Soft wash behind centred hero text, so the headline keeps full contrast
 * however the scene behind it is turned. Decorative.
 */
export function HeroScrim({ focusY = 0.5 }: { focusY?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(ellipse 34% 30% at 50% ${focusY * 100}%, hsl(var(--background) / 0.62) 0%, hsl(var(--background) / 0.35) 60%, transparent 100%)`,
      }}
    />
  );
}
