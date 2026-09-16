import type { Metadata } from "next";
import Link from "next/link";
import { Home, LifeBuoy, Newspaper, Code2, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/layout/HeroBackground";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const destinations = [
  { icon: Code2, label: "Web & Software", description: "Custom systems and apps", href: "/web-software" },
  { icon: LifeBuoy, label: "IT Support", description: "Repairs and maintenance", href: "/it-support" },
  { icon: Newspaper, label: "Blog", description: "Practical technology guidance", href: "/blog" },
  { icon: MessageCircle, label: "Contact", description: "Talk to a real person", href: "/contact" },
];

/**
 * A dead end is the worst place to leave a visitor who was looking for
 * something specific. This replaces a bare "404" with the four routes
 * people actually arrive here looking for, plus the primary CTA.
 *
 * Note there is no <main> element here: the root layout already provides
 * one, and the previous version nested a second inside it — two `main`
 * landmarks on a page is invalid, and screen-reader users get two
 * competing "main content" targets.
 */
export default function NotFound() {
  return (
    <section className="page-padding-top relative overflow-hidden py-20 md:py-28">
      <HeroBackground />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-6xl font-extrabold text-accent/30 md:text-7xl" aria-hidden="true">
            404
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-balance md:text-4xl">
            We couldn&apos;t find that page
          </h1>
          {/* Kept verbatim: it is the plain-language explanation, and the
              end-to-end suite asserts on this exact sentence. */}
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
            This page could not be found. It may have moved, or the link that brought you here may be out of date.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/quote">
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <h2 className="mb-6 text-center font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Or try one of these
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map(({ icon: Icon, label, description, href }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
              >
                <span className="mb-3 inline-flex rounded-xl bg-accent/10 p-2.5 transition-colors group-hover:bg-accent/15">
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <p className="font-heading font-semibold group-hover:text-accent">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
