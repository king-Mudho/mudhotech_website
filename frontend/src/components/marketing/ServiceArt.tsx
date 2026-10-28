import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

type Motif = "window" | "chart" | "nodes";

interface ServiceArtProps {
  icon: IconComponent;
  /** Picks the motif and gradient angle, so neighbouring cards differ. */
  seed: string;
  motif?: Motif;
  className?: string;
}

/**
 * Card artwork drawn in code, in place of stock photographs.
 *
 * A navy-to-blue gradient tile (the hero's colours), a faint engineering
 * grid, one of three motifs (an app window, a bar chart, or a network), and
 * a glass panel carrying the service's icon. The panel sits tilted in 3D and
 * straightens up when the card is hovered.
 *
 * It costs no image download, never goes stale, and stays on brand in both
 * themes. Decorative: the card's heading names the service.
 */
export function ServiceArt({ icon: Icon, seed, motif, className }: ServiceArtProps) {
  const hash = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const chosen: Motif = motif ?? (["window", "chart", "nodes"] as const)[hash % 3];
  const angle = [135, 160, 115][hash % 3];

  return (
    <div
      aria-hidden="true"
      className={cn("relative h-36 shrink-0 overflow-hidden", className)}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, hsl(var(--band)) 0%, hsl(var(--accent)) 62%, hsl(var(--hero-accent)) 100%)`,
      }}
    >
      {/* Engineering grid, fading towards the bottom. */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, #000 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 30%, transparent)",
        }}
      />
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

      <Motif kind={chosen} />

      {/* The icon on a glass panel, tilted in 3D; level on hover. */}
      <div className="absolute bottom-5 left-5 [perspective:600px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/15 shadow-lg shadow-black/20 backdrop-blur-md transition-transform duration-500 ease-out [transform:rotateX(16deg)_rotateY(-20deg)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)_translateY(-4px)]">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}

function Motif({ kind }: { kind: Motif }) {
  const common = "absolute right-5 top-5 h-24 w-40 transition-transform duration-500 group-hover:-translate-y-1";
  if (kind === "window") {
    return (
      <svg viewBox="0 0 160 96" className={common} fill="none">
        <rect
          x="0.5"
          y="0.5"
          width="159"
          height="95"
          rx="10"
          fill="white"
          fillOpacity="0.14"
          stroke="white"
          strokeOpacity="0.35"
        />
        <circle cx="12" cy="11" r="3" fill="white" fillOpacity="0.6" />
        <circle cx="22" cy="11" r="3" fill="white" fillOpacity="0.4" />
        <circle cx="32" cy="11" r="3" fill="white" fillOpacity="0.25" />
        <rect x="12" y="26" width="64" height="7" rx="3.5" fill="white" fillOpacity="0.55" />
        <rect x="12" y="40" width="96" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
        <rect x="12" y="51" width="80" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
        <rect x="12" y="68" width="40" height="14" rx="7" fill="white" fillOpacity="0.7" />
        <rect x="112" y="26" width="36" height="56" rx="6" fill="white" fillOpacity="0.18" />
      </svg>
    );
  }
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 160 96" className={common} fill="none">
        <rect
          x="0.5"
          y="0.5"
          width="159"
          height="95"
          rx="10"
          fill="white"
          fillOpacity="0.14"
          stroke="white"
          strokeOpacity="0.35"
        />
        {[22, 40, 30, 58, 46, 70].map((h, i) => (
          <rect
            key={i}
            x={14 + i * 23}
            y={84 - h}
            width="14"
            height={h}
            rx="3"
            fill="white"
            fillOpacity={0.25 + i * 0.08}
          />
        ))}
        <path d="M14 46 L37 34 L60 40 L83 22 L106 28 L146 12" stroke="white" strokeOpacity="0.8" strokeWidth="2" />
      </svg>
    );
  }
  const nodes = [
    [20, 70],
    [52, 30],
    [88, 58],
    [120, 22],
    [142, 66],
  ];
  return (
    <svg viewBox="0 0 160 96" className={common} fill="none">
      {[
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 3],
        [2, 4],
        [3, 4],
        [0, 2],
      ].map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 7 : 5} fill="white" fillOpacity={i === 2 ? 0.9 : 0.6} />
      ))}
    </svg>
  );
}
