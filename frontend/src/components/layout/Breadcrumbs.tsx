import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd, type Crumb } from "@/components/seo/JsonLd";
import { cn } from "@/lib/utils";

/**
 * Visible breadcrumb trail plus its matching BreadcrumbList structured data.
 *
 * Emitting both from one component means the markup search engines read and
 * the trail a visitor reads can never drift apart. "Home" is prepended
 * automatically so callers only describe the part that varies.
 */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <>
      <BreadcrumbJsonLd crumbs={all} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          {all.map((crumb, i) => {
            const last = i === all.length - 1;
            return (
              <li key={crumb.name} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />}
                {last || !crumb.path ? (
                  <span aria-current={last ? "page" : undefined} className="font-medium text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="transition-colors hover:text-accent hover:underline">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
