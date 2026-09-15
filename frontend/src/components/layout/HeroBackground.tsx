import { cn } from "@/lib/utils";

interface HeroBackgroundProps {
  /** Rotates the accent wash so each section of the site reads slightly
   *  differently while staying on-brand. 0 = brand blue. */
  hueShift?: number;
  className?: string;
}

/**
 * Light hero backdrop.
 *
 * Earlier versions used a deep navy panel. Dark surfaces swallow detail and
 * force everything on top to fight for contrast; a near-white base with navy
 * type gives far higher contrast than white-on-navy and is what makes the
 * page feel bright and open. Colour comes from soft accent washes rather
 * than a flooded background.
 *
 * Built from gradients, not a photograph: a viewport-filling <img> becomes
 * the Largest Contentful Paint element and the slowest thing on the page.
 * This paints immediately and costs zero bytes.
 */
export function HeroBackground({ hueShift = 0, className }: HeroBackgroundProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden bg-background", className)}
      style={hueShift ? { filter: `hue-rotate(${hueShift}deg)` } : undefined}
      aria-hidden="true"
    >
      {/* Soft vertical lift so the hero separates from the section below.
          Token-based rather than a literal colour so it inverts correctly in
          dark mode — a hardcoded light gradient showed as a grey wash there. */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-background to-background" />

      {/* Accent washes — colour without flooding the surface. */}
      <div className="absolute -top-1/4 -right-[15%] h-[60vh] w-[60vh] rounded-full bg-accent opacity-[0.14] blur-[110px] dark:opacity-[0.22]" />
      <div className="absolute -bottom-1/3 -left-[15%] h-[55vh] w-[55vh] rounded-full bg-ring opacity-[0.10] blur-[110px] dark:opacity-[0.18]" />

      {/* Fine grid — reads as "engineering" at a glance, fades at the edges. */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 35%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 35%, #000 25%, transparent 75%)",
        }}
      />
    </div>
  );
}
