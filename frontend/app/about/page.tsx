import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { engagementSteps } from "@/data/engagementModel";
import { serviceCommitments, supportChannels } from "@/data/serviceCommitments";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${company.name} — our mission, values, client engagement model, and service commitments.`,
  alternates: { canonical: "/about" },
};

// TODO(content): placeholder team profiles — replace with real names/photos
// before launch. See docs/OPEN-QUESTIONS.md #4.
const team = [
  { name: "Team Member", role: "Founder & Managing Director", image: "/images/team-ceo.jpg" },
  { name: "Team Member", role: "Lead Developer", image: "/images/team-dev.jpg" },
  { name: "Team Member", role: "IT Support Technician", image: "/images/team-tech.jpg" },
  { name: "Team Member", role: "Operations", image: "/images/team-ops.jpg" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={company.shortName}
        lead={company.about}
      />

      <Section>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card border border-border p-8">
            <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To deliver practical, sustainable technology that solves real business problems — making reliable ICT
              accessible to organizations of every size across Zimbabwe.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8">
            <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
              <Eye className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">{company.closingStatement}</p>
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Our Promise" title="Core Values" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {company.values.map((value) => (
            <div key={value} className="flex items-start gap-3 rounded-xl bg-card border border-border p-5">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-team-values.jpg"
          alt="The MudhoTech team collaborating"
          title="Built Around Your Objectives"
          subtitle="We listen first, then recommend — never the other way around."
        />
      </div>

      <Section>
        <SectionHeading eyebrow="Our Team" title="The People Behind the Work" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden text-center">
              <div className="relative h-56">
                <Image src={member.image} alt={member.role} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-heading font-semibold">{member.name}</p>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section muted id="engagement-model">
        <SectionHeading
          eyebrow="How We Work"
          title="Client Engagement Model"
          lead="A structured seven-step process from first conversation to ongoing support."
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {engagementSteps.map((step) => (
            <div key={step.step} className="flex gap-5 rounded-2xl bg-card border border-border p-6">
              <div className="shrink-0 h-10 w-10 rounded-full bg-accent text-accent-foreground font-heading font-bold flex items-center justify-center">
                {step.step}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                  {step.points.map((point) => (
                    <li key={point} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="service-commitment">
        <SectionHeading eyebrow="What You Can Expect" title="Service Level Commitment" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card border border-border p-8">
            <h3 className="font-heading font-semibold text-lg mb-4">Our Commitments</h3>
            <ul className="space-y-3">
              {serviceCommitments.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8">
            <h3 className="font-heading font-semibold text-lg mb-4">Support Channels</h3>
            <ul className="space-y-3">
              {supportChannels.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">See Our Full Capability Statement</h2>
          <p className="text-muted-foreground mb-8">
            Company fact sheet, partnership opportunities, roadmap, and tender readiness — all in one place.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link href="/capability-statement">View Capability Statement</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
