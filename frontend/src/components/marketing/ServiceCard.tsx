import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  items?: string[];
  /** How many items to show before summarising the rest. Cards that dump a
   *  full nine-item list stop being scannable — the description carries the
   *  meaning and these are supporting detail. */
  maxItems?: number;
  className?: string;
}

export function ServiceCard({ icon: Icon, title, description, items, maxItems = 4, className }: ServiceCardProps) {
  const shown = items?.slice(0, maxItems) ?? [];
  const remaining = (items?.length ?? 0) - shown.length;

  return (
    // h-full + flex keeps every card in a row the same height regardless of
    // how much copy it carries.
    <div
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        className,
      )}
    >
      <div className="mb-4 w-fit rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent/15">
        <Icon className="h-6 w-6 text-accent" />
      </div>

      <h3 className="mb-2 font-heading text-lg font-semibold leading-snug">{title}</h3>

      {description && <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>}

      {shown.length > 0 && (
        <ul className="mt-auto space-y-2">
          {shown.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/75">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
          {remaining > 0 && <li className="pt-1 text-sm font-medium text-accent">+{remaining} more included</li>}
        </ul>
      )}
    </div>
  );
}
