import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileSearch } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ContactCta } from "@/components/marketing/ContactCta";
import { Button } from "@/components/ui/button";
import { caseStudies, exampleProjects, isPublished } from "@/data/portfolio";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "How MudhoTech Solutions presents its work: client case studies published with permission, and the kinds of software and IT support projects we take on.",
  alternates: { canonical: "/portfolio" },
};

const pathLabel = { build: "Software development", support: "IT support" } as const;

/**
 * This page used to be a filterable gallery of thirty hot-linked Unsplash
 * photos under "Projects, Repairs & Gallery … software we've delivered,
 * hardware we've brought back", which read as MudhoTech's own work. It now
 * shows only real case studies (none published yet) and clearly labelled
 * illustrative examples. Add case studies in src/data/portfolio.ts.
 */
export default function PortfolioPage() {
  const publishedCaseStudies = caseStudies.filter(isPublished);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Our Work" }]}
        eyebrow="Our Work"
        title="Our Work"
        lead="Client work is published here only with the client's permission. Until then, ask us for examples and references that match your project."
      />

      <Section>
        <SectionHeading
          eyebrow="Case Studies"
          title="Client Projects"
          lead="Each case study states the problem, what we did, and an outcome the client has confirmed."
        />

        {publishedCaseStudies.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {publishedCaseStudies.map((study) => (
              <li key={study.slug} className="card-interactive reveal overflow-hidden">
                {study.images?.[0] && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={study.images[0].src}
                      alt={study.images[0].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    {pathLabel[study.path]} · {study.sector}
                    {study.year ? ` · ${study.year}` : ""}
                  </p>
                  <h3 className="mb-1 font-heading text-xl font-semibold">{study.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{study.client}</p>
                  <dl className="space-y-3 text-sm leading-relaxed">
                    <div>
                      <dt className="font-semibold text-foreground">The problem</dt>
                      <dd className="text-muted-foreground">{study.challenge}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">What we did</dt>
                      <dd className="text-muted-foreground">{study.solution}</dd>
                    </div>
                    {study.outcome && (
                      <div>
                        <dt className="font-semibold text-foreground">Outcome</dt>
                        <dd className="text-muted-foreground">{study.outcome}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-7 md:flex-row md:items-center md:p-10">
            <span className="icon-tile h-14 w-14">
              <FileSearch className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="mb-2 font-heading text-lg font-semibold">No case studies published yet</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We only publish client work when the client has agreed to it. If you would like to see work similar to
                yours, or speak to someone we have worked with, ask and we will share what we can.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent">
                <Link href="/contact">
                  Ask for examples
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={whatsappUrl("Hello MudhoTech, could you share examples of work similar to my project?")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Illustrative Examples"
          title="The Kind of Work We Take On"
          lead="These describe typical jobs, drawn from our service list. They are not specific client projects and make no claim about results."
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {exampleProjects.map((example) => (
            <li key={example.title} className="card-interactive reveal group flex flex-col p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-dashed border-muted-foreground/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Illustrative example
                </span>
                <span className="text-xs font-semibold text-accent">{pathLabel[example.path]}</span>
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold leading-snug">{example.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{example.problem}</p>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">Usually involves</p>
              <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-accent">
                {example.involves.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href={example.href}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                About this service<span className="sr-only"> — {example.title}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCta
        title="Want to see work like yours?"
        lead="Tell us what you are planning and we'll share relevant examples and references where our clients allow it."
        action={{ href: "/contact", label: "Ask for Examples" }}
      />
    </>
  );
}
