import { cn } from "@/lib/utils";

interface SectionBreakProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * Full-width band used to break up long pages.
 *
 * It used to carry a stock photograph. It is now the hero's navy-to-blue
 * gradient with a static network pattern on the right (the flat cousin of
 * the homepage's 3D globe), so it ties the page to the brand, costs no image
 * download, and keeps the caption at full contrast.
 */
export function SectionBreak({ title, subtitle, className }: SectionBreakProps) {
  return (
    <div
      className={cn("reveal relative my-10 overflow-hidden rounded-2xl text-white shadow-sm md:my-14", className)}
      style={{
        backgroundImage:
          "linear-gradient(120deg, hsl(var(--band)) 0%, hsl(var(--band)) 35%, hsl(var(--accent)) 85%, hsl(var(--hero-accent)) 120%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <Constellation className="absolute -right-6 top-1/2 hidden h-[140%] -translate-y-1/2 md:block" />
      <div className="relative max-w-2xl px-6 py-10 md:px-12 md:py-14">
        <h3 className="mb-2 font-heading text-2xl font-bold md:text-3xl">{title}</h3>
        <p className="text-sm leading-relaxed text-white/85 md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}

const points: [number, number][] = [
  [40, 150],
  [110, 70],
  [170, 160],
  [230, 40],
  [260, 120],
  [320, 190],
  [350, 80],
  [410, 140],
  [200, 230],
  [300, 260],
];
const links: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [4, 6],
  [4, 5],
  [5, 7],
  [6, 7],
  [2, 8],
  [8, 9],
  [5, 9],
  [3, 6],
];

function Constellation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 300" aria-hidden="true" className={className} fill="none">
      {links.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.5} fill="white" fillOpacity={i % 3 === 0 ? 0.85 : 0.5} />
      ))}
    </svg>
  );
}
