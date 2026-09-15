import type { ReactNode } from "react";
import { HeroBackground } from "@/components/layout/HeroBackground";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** Subtle hue rotation so each section of the site feels distinct while
   *  staying on-brand. Omit for the default brand blue. */
  hueShift?: number;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, lead, hueShift, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden page-padding-top py-16 md:py-24">
      <HeroBackground hueShift={hueShift} />
      <div className="relative container mx-auto px-4 text-center">
        <span className="mb-4 inline-flex rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
        <h1 className="mx-auto max-w-3xl font-heading text-3xl font-bold leading-[1.15] text-foreground text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-balance md:text-lg">
          {lead}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
