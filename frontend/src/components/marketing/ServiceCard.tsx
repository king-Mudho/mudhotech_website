import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Clock, Users } from "lucide-react";
import { ServiceItemList } from "@/components/marketing/ServiceItemList";
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
  image?: string;
  turnaround?: string;
  /** How many items to show before the rest collapse. */
  maxItems?: number;
  className?: string;
}

/**
 * Server Component by design — /it-support renders it straight from a server
 * page and passes a Lucide component as `icon`, which cannot cross the
 * server/client boundary. The expand/collapse lives in ServiceItemList.
 */
export function ServiceCard({
  icon: Icon,
  title,
  description,
  detail,
  items = [],
  worksWith,
  bestFor,
  image,
  turnaround,
  maxItems = 5,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        "transition-all duration-300 hover:border-accent/40 hover:shadow-lg",
        className,
      )}
    >
      {image ? (
        <div className="relative h-40 shrink-0 overflow-hidden">
          {/* Decorative: the heading directly below names the service, so a
              descriptive alt here would just be read out twice. */}
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={65}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
          <span className="absolute bottom-3 left-4 rounded-xl bg-card/90 p-2.5 shadow-sm backdrop-blur-sm">
            <Icon className="h-5 w-5 text-accent" />
          </span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {!image && (
          <div className="mb-4 w-fit rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent/15">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        )}

        <h3 className="mb-2 font-heading text-lg font-semibold leading-snug">{title}</h3>

        {description && <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>}

        {detail && (
          <p className="mb-4 border-l-2 border-accent/25 pl-3 text-sm leading-relaxed text-foreground/70">{detail}</p>
        )}

        {(bestFor || turnaround) && (
          <dl className="mb-4 space-y-2 text-xs">
            {bestFor && (
              <div className="flex gap-2">
                <dt className="sr-only">Best for</dt>
                <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <dd className="leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">Best for: </span>
                  {bestFor}
                </dd>
              </div>
            )}
            {turnaround && (
              <div className="flex gap-2">
                <dt className="sr-only">Typical turnaround</dt>
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <dd className="leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">Turnaround: </span>
                  {turnaround}
                </dd>
              </div>
            )}
          </dl>
        )}

        {items.length > 0 && <ServiceItemList items={items} collapsedCount={maxItems} />}

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
    </div>
  );
}
