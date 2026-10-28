import type { LucideIcon } from "lucide-react";
import { ChevronDown, Clock, Info, Users } from "lucide-react";
import { ServiceItemList } from "@/components/marketing/ServiceItemList";
import { ServiceArt } from "@/components/marketing/ServiceArt";
import { CardPhoto } from "@/components/marketing/CardPhoto";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Two or three sentences on what the work actually involves. */
  detail?: string;
  items?: string[];
  /** Named software, platforms, and parts the service covers. */
  worksWith?: string[];
  bestFor?: string;
  /** A photo that shows the work; generated artwork is used without one. */
  image?: string;
  turnaround?: string;
  /** A caveat to read before relying on the claim, e.g. third-party fees. */
  note?: string;
  /** How many items to show before the rest collapse. */
  maxItems?: number;
  className?: string;
}

/**
 * Server Component by design — /it-support renders it straight from a server
 * page and passes a Lucide component as `icon`, which cannot cross the
 * server/client boundary. The expand/collapse lives in ServiceItemList.
 *
 * The card shows the essentials (what it is, the first few things included,
 * any caveat, and what it works with). The longer explanation and "best for"
 * sit behind "More about this service", so a row of cards stays scannable.
 * The card leads with a photo of the work where one exists, and with
 * generated artwork (ServiceArt) where none does.
 */
export function ServiceCard({
  icon,
  title,
  description,
  detail,
  items = [],
  worksWith,
  bestFor,
  image,
  turnaround,
  note,
  maxItems = 4,
  className,
}: ServiceCardProps) {
  const hasMore = Boolean(detail || bestFor || turnaround);

  return (
    <article className={cn("card-interactive group flex h-full flex-col overflow-hidden", className)}>
      {image ? <CardPhoto src={image} icon={icon} /> : <ServiceArt icon={icon} seed={title} />}

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">{title}</h3>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>}

        {items.length > 0 && (
          <div className="mt-4">
            <ServiceItemList items={items} collapsedCount={maxItems} />
          </div>
        )}

        {note && (
          <p className="mt-4 flex gap-2 rounded-lg bg-secondary/70 p-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span>{note}</span>
          </p>
        )}

        {hasMore && (
          <details className="group/more mt-4 border-t border-border pt-3 text-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-heading text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
              More about this service
              <ChevronDown className="h-4 w-4 transition-transform group-open/more:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {detail && <p>{detail}</p>}
              {bestFor && (
                <p className="flex gap-2">
                  <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-foreground/80">Best for: </span>
                    {bestFor}
                  </span>
                </p>
              )}
              {turnaround && (
                <p className="flex gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-foreground/80">Turnaround: </span>
                    {turnaround}
                  </span>
                </p>
              )}
            </div>
          </details>
        )}

        {worksWith && worksWith.length > 0 && (
          <div className="mt-auto pt-5">
            <p className="mb-2 font-heading text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Works with
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {worksWith.map((tool) => (
                <li key={tool} className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground/70">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
