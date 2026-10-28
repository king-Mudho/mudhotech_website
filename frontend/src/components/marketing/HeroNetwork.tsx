"use client";

import { useEffect, useRef } from "react";
import { nearestLinks, rotate, spherePoints, type Vec3 } from "@/lib/hero-network";

/**
 * A slowly turning 3D network globe behind the homepage headline: nodes,
 * the links between them, and a few signals travelling along the links.
 *
 * Drawn with the 2D canvas API and a hand-rolled projection rather than
 * three.js, which would add ~150 kB to the homepage for one decoration.
 *
 * It must never cost the page its first paint or its readability:
 * - It starts only once the browser is idle, so the headline (the LCP
 *   element) paints first, and the canvas fades in afterwards.
 * - It pauses while the hero is off screen or the tab is hidden.
 * - With "reduce motion" it draws one still frame and never animates.
 * - Lines stay faint and the edges are masked, so text contrast is unchanged.
 * - It re-reads the accent colour when the theme changes.
 */
export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let points: Vec3[] = [];
    let links: [number, number][] = [];
    let neighbours: number[][] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let colour = "211, 100%, 38%";
    let dark = false;

    let yaw = 0.6;
    const pitch = 0.32;
    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;

    type Pulse = { link: number; from: number; t: number; speed: number };
    let pulses: Pulse[] = [];

    let frame = 0;
    let last = 0;
    let visible = true;
    let started = false;

    const readColour = () => {
      const styles = getComputedStyle(document.documentElement);
      const raw = styles.getPropertyValue("--accent").trim(); // e.g. "211 100% 38%"
      const [h, s, l] = raw.split(/\s+/);
      if (h && s && l) colour = `${h}, ${s}, ${l}`;
      dark = document.documentElement.classList.contains("dark");
    };

    const build = () => {
      const count = width < 640 ? 64 : 120;
      points = spherePoints(count);
      links = nearestLinks(points, 3);
      neighbours = points.map(() => []);
      links.forEach(([a, b], i) => {
        neighbours[a].push(i);
        neighbours[b].push(i);
      });
      pulses = Array.from({ length: width < 640 ? 4 : 7 }, (_, i) => ({
        link: (i * 37) % links.length,
        from: links[(i * 37) % links.length][0],
        t: (i * 0.17) % 1,
        speed: 0.35 + ((i * 0.13) % 0.3),
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
      const radius = mobile ? Math.min(width * 0.62, 300) : Math.min(width * 0.36, height * 0.5, 520);
      const cx = width / 2;
      const cy = mobile ? height * 0.3 : height * 0.42;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const projected = points.map((p) => {
        const [x, y, z] = rotate(p, yaw + tiltX, pitch + tiltY);
        const scale = 1 + z * 0.22; // mild perspective: near side larger
        return { x: cx + x * radius * scale, y: cy + y * radius * scale, depth: (z + 1) / 2 };
      });

      // Links, batched into four depth bands so the canvas changes style
      // four times per frame instead of once per line.
      // Fainter on phones, where the globe sits behind the paragraph text.
      const lineAlpha = (dark ? 0.32 : 0.24) * (mobile ? 0.7 : 1);
      ctx.lineWidth = 1;
      for (let band = 0; band < 4; band++) {
        ctx.beginPath();
        for (const [a, b] of links) {
          const depth = (projected[a].depth + projected[b].depth) / 2;
          if (Math.min(3, Math.floor(depth * 4)) !== band) continue;
          ctx.moveTo(projected[a].x, projected[a].y);
          ctx.lineTo(projected[b].x, projected[b].y);
        }
        ctx.strokeStyle = `hsla(${colour}, ${lineAlpha * (0.2 + 0.8 * ((band + 0.5) / 4))})`;
        ctx.stroke();
      }

      // Nodes: larger and stronger on the near side of the globe.
      const nodeAlpha = (dark ? 0.75 : 0.55) * (mobile ? 0.8 : 1);
      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8 + p.depth * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${colour}, ${nodeAlpha * (0.15 + 0.85 * p.depth)})`;
        ctx.fill();
      }

      // Signals travelling along the links.
      for (const pulse of pulses) {
        const [a, b] = links[pulse.link];
        const start = projected[pulse.from];
        const end = projected[pulse.from === a ? b : a];
        const x = start.x + (end.x - start.x) * pulse.t;
        const y = start.y + (end.y - start.y) * pulse.t;
        const depth = start.depth + (end.depth - start.depth) * pulse.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, `hsla(${colour}, ${0.9 * (0.3 + 0.7 * depth)})`);
        glow.addColorStop(1, `hsla(${colour}, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(x - 7, y - 7, 14, 14);
      }
    };

    const advance = (dt: number) => {
      yaw += dt * 0.06;
      tiltX += (targetX - tiltX) * Math.min(1, dt * 2.5);
      tiltY += (targetY - tiltY) * Math.min(1, dt * 2.5);
      for (const pulse of pulses) {
        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          // Hop on to another link from the node just reached.
          const [a, b] = links[pulse.link];
          const reached = pulse.from === a ? b : a;
          const options = neighbours[reached].filter((l) => l !== pulse.link);
          pulse.link = options.length ? options[Math.floor(Math.random() * options.length)] : pulse.link;
          pulse.from = reached;
          pulse.t = 0;
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      advance(dt);
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
      readColour();
      if (started) draw();
    });

    const start = () => {
      started = true;
      readColour();
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
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
      style={{
        maskImage: "radial-gradient(ellipse 75% 70% at 50% 42%, #000 35%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 42%, #000 35%, transparent 78%)",
      }}
    />
  );
}
