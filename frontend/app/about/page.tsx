import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, CheckCircle2, Building2, MapPin, Clock, Layers } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { Button } from "@/components/ui/button";
import { IndustriesServed } from "@/components/marketing/IndustriesServed";
import { ContactCta } from "@/components/marketing/ContactCta";
import { company } from "@/data/company";
import { engagementSteps } from "@/data/engagementModel";
import { serviceCommitments, supportChannels } from "@/data/serviceCommitments";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${company.name} — our mission, values, client engagement model, and service commitments.`,
  alternates: { canonical: "/about" },
};

/**
 * Verifiable facts only, all read from `company`. The registration number
 * joins this row once it is filled in (docs/OPEN-QUESTIONS.md #3).
 */
const facts = [
  { icon: Building2, label: "Registered company", value: "(Private) Limited, Zimbabwe" },
  { icon: MapPin, label: "Office", value: "Graniteside, Harare" },
  { icon: Clock, label: "Open", value: "Mon – Fri, 8 AM – 5 PM" },
  { icon: Layers, label: "One team", value: "Builds your systems and supports them" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "About Us" }]} eyebrow="About Us" title={company.shortName} lead={company.about} />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-interactive group p-7">
            <span className="icon-tile mb-4">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mb-3 font-heading text-2xl font-bold">Our Mission</h2>
            <p className="leading-relaxed text-muted-foreground">
              To deliver practical, sustainable technology that solves real business problems — making reliable ICT
              accessible to organizations of every size across Zimbabwe.
            </p>
          </div>
          <div className="card-interactive group p-7">
            <span className="icon-tile mb-4">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mb-3 font-heading text-2xl font-bold">Our Vision</h2>
            <p className="leading-relaxed text-muted-foreground">{company.closingStatement}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-1.5 bg-card p-5">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </dt>
              <dd className="text-sm font-medium leading-snug text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Our Promise" title="Core Values" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {company.values.map((value) => (
            <div key={value} className="card-interactive flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-sm text-foreground/80">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          title="Built Around Your Objectives"
          subtitle="We listen first, then recommend — never the other way around."
        />
      </div>

      {/* The team grid is deliberately not rendered: all four entries were
          literally named "Team Member" over stock portraits. A page of
          anonymous stock faces is worse than no team section. Restore it
          with real names and photographs — the `team` array above is still
          here. See docs/OPEN-QUESTIONS.md #4. */}

      <Section muted id="engagement-model">
        <SectionHeading
          eyebrow="How We Work"
          title="Client Engagement Model"
          lead="A structured seven-step process from first conversation to ongoing support."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {engagementSteps.map((step) => (
            <div key={step.step} className="card-interactive flex flex-col gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-heading font-bold text-accent-foreground">
                {step.step}
              </div>
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold">{step.title}</h3>
                <ul className="space-y-1.5">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <IndustriesServed />

      <Section id="service-commitment">
        <SectionHeading eyebrow="What You Can Expect" title="Service Level Commitment" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-surface p-7">
            <h3 className="mb-4 font-heading text-lg font-semibold">Our Commitments</h3>
            <ul className="space-y-3">
              {serviceCommitments.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-7">
            <h3 className="mb-4 font-heading text-lg font-semibold">Support Channels</h3>
            <ul className="space-y-3">
              {supportChannels.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="card-surface flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="mb-2 font-heading text-2xl font-bold md:text-3xl">See Our Full Capability Statement</h2>
            <p className="text-muted-foreground">
              Company fact sheet, partnership opportunities, roadmap, and tender readiness — all in one place.
            </p>
          </div>
          <Button asChild variant="accent" size="lg" className="shrink-0">
            <Link href="/capability-statement">View Capability Statement</Link>
          </Button>
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
