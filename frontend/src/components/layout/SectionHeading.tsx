import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** `light` inverts the type for use on the dark stat band. */
  tone?: "default" | "light";
  align?: "center" | "left";
  className?: string;
}

/**
 * The single source of truth for section headers.
 *
 * These were previously hand-rolled in eleven places across eight files,
 * which had already drifted into two different title sizes and inconsistent
 * spacing. Every section header on the site now renders through here.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "default",
  align = "center",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 inline-flex rounded-full px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider",
            light ? "bg-white/10 text-hero-accent" : "border border-accent/25 bg-accent/10 text-accent",
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-heading text-3xl font-bold leading-tight text-balance md:text-4xl",
          light ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-balance",
            align === "center" && "mx-auto",
            light ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
