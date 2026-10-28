import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Code2, MessageCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { HeroNetwork } from "@/components/marketing/HeroNetwork";
import { company } from "@/data/company";
import { commitments } from "@/data/commitments";
import { WHATSAPP_GREETING, telHref, whatsappUrl } from "@/lib/whatsapp";

/**
 * The two things MudhoTech does, as the first choice a visitor makes. These
 * replaced four badges ("Secure & Reliable", "Fast Turnaround", …) that were
 * unverifiable adjectives and gave no route into the site.
 */
const paths: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  topics: string[];
  href: string;
  cta: string;
}[] = [
  {
    icon: Code2,
    eyebrow: "Build",
    title: "Websites, systems & apps",
    body: "Custom software for how your organization actually works, from a company website to stock, sales, and booking systems.",
    topics: ["Websites", "Business systems", "Online stores", "Mobile apps"],
    href: "/web-software",
    cta: "Software development",
  },
  {
    icon: Wrench,
    eyebrow: "Keep it working",
    title: "IT support & repairs",
    body: "Laptops and desktops repaired, networks fixed, and software installed and set up properly.",
    topics: ["Repairs", "Networks & Wi-Fi", "Software setup", "Maintenance"],
    href: "/it-support",
    cta: "IT support",
  },
];

/**
 * Server Component with a CSS-only entrance animation — deliberately not
 * framer-motion. The headline is the LCP element: gating its visibility on JS
 * hydration delays the largest paint and hides it entirely if scripts fail.
 * The headline and lead carry no entrance animation at all for that reason.
 */
export function HomeHero() {
  return (
    <section className="page-padding-top relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
      <HeroBackground />
      <HeroNetwork />

      <div className="container relative mx-auto px-4 py-16 text-center">
        {/* States what the company does before the reader parses anything else. */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
          Software Development &middot; IT Support &middot; Harare
        </span>

        <h1 className="mx-auto max-w-4xl text-balance font-heading text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
          We build the software your business runs on — and <span className="text-accent">keep it running.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
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
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="whatsapp" size="xl">
            <a href={whatsappUrl(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {commitments.freeAssessmentShort} · Or call{" "}
          <a href={telHref()} className="font-medium text-accent hover:underline">
            {company.contact.phone}
          </a>
        </p>

        <h2 className="sr-only">What do you need?</h2>
        <ul
          className="mx-auto mt-14 grid max-w-4xl animate-fade-in-up gap-4 text-left md:grid-cols-2"
          style={{ animationDelay: "220ms" }}
        >
          {paths.map(({ icon: Icon, eyebrow, title, body, topics, href, cta }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="mb-4 flex items-center gap-3">
                  <span className="rounded-xl bg-accent/10 p-2.5">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>
                </span>
                <span className="mb-2 font-heading text-xl font-semibold text-foreground">{title}</span>
                <span className="mb-4 text-sm leading-relaxed text-muted-foreground">{body}</span>
                <span className="mb-5 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
                    >
                      {topic}
                    </span>
                  ))}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Kept for search engines and screen readers; the visible headline
            leads with the plain-English version of the same claim. */}
        <p className="sr-only">{company.tagline}</p>
      </div>
    </section>
  );
}
