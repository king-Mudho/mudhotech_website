import type { ReactNode } from "react";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HeroNetwork } from "@/components/marketing/HeroNetwork";
import type { Crumb } from "@/components/seo/JsonLd";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** Trail below Home. Also emits BreadcrumbList structured data. */
  crumbs?: Crumb[];
  children?: ReactNode;
}

/**
 * The hero for every page except the homepage, which has its own.
 *
 * Text sits on the left at the same edge as the content below it; the 3D
 * network globe turns on the right. Every page gets the same gradient and
 * the same globe, so the site reads as one piece (the per-page hue shifts
 * are gone).
 */
export function PageHero({ eyebrow, title, lead, crumbs, children }: PageHeroProps) {
  return (
    <section className="page-padding-top relative overflow-hidden">
      <HeroBackground />
      <HeroNetwork placement="right" />
      <div className="container relative mx-auto px-4 py-10 md:py-14 lg:py-16">
        <div className="max-w-3xl">
          {crumbs && <Breadcrumbs crumbs={crumbs} className="mb-5" />}
          <span className="mb-4 inline-flex rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </span>
          <h1 className="text-balance font-heading text-3xl font-bold leading-[1.12] text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{lead}</p>
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
