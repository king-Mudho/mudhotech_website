import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BadgeCheck, Clock, Code2, MapPin, Wrench, Reply } from "lucide-react";
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
  topics: string[];
  href: string;
  cta: string;
}[] = [
  {
    icon: Code2,
    eyebrow: "Build",
    title: "Websites, systems & apps",
    topics: ["Websites", "Business systems", "Online stores", "Mobile apps"],
    href: "/web-software",
    cta: "Software development",
  },
  {
    icon: Wrench,
    eyebrow: "Keep it working",
    title: "IT support & repairs",
    topics: ["Repairs", "Networks & Wi-Fi", "Software setup", "Maintenance"],
    href: "/it-support",
    cta: "IT support",
  },
];

/**
 * Facts a visitor can check, shown just below the first screen. Comparable
 * IT firms put proof here (testimonials, years trading, certifications);
 * none of those is confirmed for MudhoTech yet (docs/OPEN-QUESTIONS.md), so
 * this row uses what the site already states and the owner can verify.
 */
const facts: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: BadgeCheck, label: "Registered company", value: `${company.name}, Zimbabwe` },
  { icon: MapPin, label: "Office", value: company.registeredOffice.replace(/, Zimbabwe$/, "") },
  { icon: Clock, label: "Open", value: company.hours.summary },
  { icon: Reply, label: "Replies", value: commitments.responseTimeShort.replace(/^./, (c) => c.toUpperCase()) },
];

/**
 * Server Component with a CSS-only entrance animation — deliberately not
 * framer-motion. The headline is the LCP element: gating its visibility on JS
 * hydration delays the largest paint and hides it entirely if scripts fail.
 * The headline and lead carry no entrance animation at all for that reason.
 */
export function HomeHero() {
  return (
    <section className="page-padding-top relative overflow-hidden">
      <HeroBackground />
      <HeroNetwork placement="right" />

      <div className="container relative mx-auto px-4 pb-12 pt-10 md:pb-16 md:pt-14 lg:pt-20">
        <div className="max-w-3xl">
          {/* States what the company does before the reader parses anything else. */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
            Software Development &middot; IT Support &middot; Harare
          </span>

          <h1 className="text-balance font-heading text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            We build the software your business runs on — and <span className="text-accent">keep it running.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Custom web systems, mobile apps, and dependable IT support for organizations across Zimbabwe. One team to
            build it and to look after it.
          </p>

          <div className="mt-8 flex animate-fade-in-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "100ms" }}>
            <Button asChild variant="accent" size="xl">
              <Link href="/quote">
                Get a Free Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappUrl(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp Us
              </a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {commitments.freeAssessmentShort} · Or call{" "}
            <a href={telHref()} className="font-medium text-accent hover:underline">
              {company.contact.phone}
            </a>
          </p>
        </div>

        <h2 className="sr-only">What do you need?</h2>
        <ul className="mt-10 grid animate-fade-in-up gap-5 md:grid-cols-2" style={{ animationDelay: "220ms" }}>
          {paths.map(({ icon: Icon, eyebrow, title, topics, href, cta }) => (
            <li key={href}>
              <Link
                href={href}
                className="card-interactive group flex h-full flex-col gap-4 bg-card/90 p-6 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-start"
              >
                <span className="icon-tile h-12 w-12">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</span>
                  <span className="mt-1 font-heading text-xl font-semibold text-foreground">{title}</span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
                      >
                        {topic}
                      </span>
                    ))}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent">
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <dt className="flex shrink-0 items-center">
                <span className="rounded-lg bg-accent/10 p-2">
                  <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                </span>
                <span className="sr-only">{label}</span>
              </dt>
              <dd className="min-w-0">
                <span
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  aria-hidden="true"
                >
                  {label}
                </span>
                <span className="block text-sm font-medium text-foreground">{value}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Kept for search engines and screen readers; the visible headline
            leads with the plain-English version of the same claim. */}
        <p className="sr-only">{company.tagline}</p>
      </div>
    </section>
  );
}
