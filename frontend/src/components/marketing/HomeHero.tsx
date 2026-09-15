import Link from "next/link";
import { ShieldCheck, Zap, Users, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { company } from "@/data/company";

const trustIndicators = [
  { icon: ShieldCheck, label: "Secure & Reliable" },
  { icon: Zap, label: "Fast Turnaround" },
  { icon: Users, label: "Client-First Approach" },
  { icon: Clock, label: "Ongoing Support" },
];

/**
 * Server Component with a CSS-only entrance animation — deliberately not
 * framer-motion. This is the LCP element: gating its visibility on JS
 * hydration (motion's `initial: { opacity: 0 }`) delays the largest paint
 * and hides the headline entirely if scripts fail. The headline and lead
 * carry no entrance animation at all for the same reason.
 */
export function HomeHero() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden page-padding-top">
      <HeroBackground />

      <div className="relative container mx-auto px-4 py-16 text-center">
        {/* States what the company does before the reader parses anything else. */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
          Software Development &middot; IT Support &middot; Harare
        </span>

        <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-[1.1] text-foreground text-balance sm:text-5xl lg:text-6xl">
          We build the software your business runs on — and{" "}
          <span className="text-accent">keep it running.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
          Custom web systems, mobile apps, and dependable IT support for organizations across Zimbabwe. One team to
          build it and to look after it.
        </p>

        <div
          className="mt-9 flex animate-fade-in-up flex-col justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "100ms" }}
        >
          <Button asChild variant="accent" size="xl">
            <Link href="/quote">
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/web-software">Explore Services</Link>
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">Free consultation and diagnostics · No obligation</p>

        <div
          className="mx-auto mt-14 grid max-w-4xl animate-fade-in-up grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          style={{ animationDelay: "220ms" }}
        >
          {trustIndicators.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md sm:p-5"
            >
              <span className="rounded-xl bg-accent/10 p-2.5">
                <Icon className="h-5 w-5 text-accent" />
              </span>
              <span className="text-center text-xs font-medium text-foreground sm:text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Kept for search engines and screen readers; the visible headline
            leads with the plain-English version of the same claim. */}
        <p className="sr-only">{company.tagline}</p>
      </div>
    </section>
  );
}
