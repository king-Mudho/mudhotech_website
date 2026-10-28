import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** `light` inverts the type for use on the dark stat band. */
  tone?: "default" | "light";
  align?: "center" | "left";
  /** Optional link or button shown to the right of the heading on wide screens. */
  action?: ReactNode;
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
  action,
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        action && "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <span
            className={cn(
              "mb-3 inline-flex rounded-full px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider",
              light ? "bg-white/10 text-hero-accent" : "border border-accent/25 bg-accent/10 text-accent-strong",
            )}
          >
            {eyebrow}
          </span>
        )}

        <h2
          className={cn(
            "text-balance font-heading text-3xl font-bold leading-tight md:text-4xl",
            light ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h2>

        {lead && (
          <p
            className={cn(
              "mt-3 max-w-3xl text-balance text-base leading-relaxed",
              align === "center" && "mx-auto",
              light ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
