import type { ReactNode } from "react";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HeroCosmos, HeroScrim } from "@/components/marketing/HeroCosmos";
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
 * Text is centred over a full-cover 3D scene (HeroCosmos: globe, orbiting
 * planets, stars, slowly shifting blues). A soft scrim sits between the two
 * so the headline keeps full contrast. Every page uses the same hero, so the
 * site reads as one piece.
 */
export function PageHero({ eyebrow, title, lead, crumbs, children }: PageHeroProps) {
  return (
    <section className="page-padding-top relative overflow-hidden">
      <HeroBackground />
      <HeroCosmos />
      <HeroScrim />
      <div className="container relative mx-auto flex min-h-[22rem] flex-col items-center justify-center px-4 py-14 text-center md:min-h-[26rem] md:py-20">
        {crumbs && <Breadcrumbs crumbs={crumbs} className="mb-5 flex justify-center" />}
        <span className="mb-4 inline-flex rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-accent-strong backdrop-blur-sm">
          {eyebrow}
        </span>
        <h1 className="mx-auto max-w-4xl text-balance font-heading text-3xl font-bold leading-[1.12] text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          {lead}
        </p>
        {children && <div className="mt-7 flex justify-center">{children}</div>}
      </div>
    </section>
  );
}
