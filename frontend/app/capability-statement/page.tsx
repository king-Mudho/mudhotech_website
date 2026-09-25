import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { CapabilityPdfButton } from "@/components/marketing/CapabilityPdfButton";
import { company } from "@/data/company";
import { collaborationAreas, potentialPartners } from "@/data/partnerships";
import { roadmap } from "@/data/roadmap";
import { devServices, hardwareServices, softwareServices } from "@/data/services";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { ContactCta } from "@/components/marketing/ContactCta";

export const metadata: Metadata = {
  title: "Capability Statement",
  description: `Company profile, fact sheet, partnership opportunities, and future roadmap for ${company.name}. Prepared for tenders, RFQs, and partnership discussions.`,
  alternates: { canonical: "/capability-statement" },
};

const tenderUses = [
  "Vendor registration",
  "Requests for Quotation (RFQs)",
  "Requests for Proposal (RFPs)",
  "Invitations to Tender (ITTs)",
  "Capability presentations",
  "Partnership discussions",
];

const growthAdditions = [
  "Client references",
  "Detailed case studies",
  "Professional certifications",
  "Expanded team profiles",
  "Technology partnerships",
  "Industry awards",
];

/**
 * Service areas, read from the same data as the service pages so the
 * capability claims here can never exceed what those pages describe.
 */
const capabilityGroups = [
  { title: "Software & Web Development", href: "/web-software", services: devServices },
  { title: "IT Support & Infrastructure", href: "/it-support", services: hardwareServices },
  { title: "Software Setup & Support", href: "/web-software", services: softwareServices },
];

/** In-page links for reviewers who arrive looking for one specific section. */
const jumpLinks = [
  { href: "#fact-sheet", label: "Fact Sheet" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#methodology", label: "Methodology" },
  { href: "#partnerships", label: "Partnerships" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#tender-readiness", label: "Tender Readiness" },
];

export default function CapabilityStatementPage() {
  const factSheet: [string, string][] = [
    ["Company Name", company.name],
    ["Business Type", company.businessType],
    ["Registered Office", company.registeredOffice],
    // TODO(content): registration number pending — see docs/OPEN-QUESTIONS.md #3
    ["Registration Number", company.registrationNumber || "To be confirmed"],
    ["Telephone", company.contact.phone],
    ["WhatsApp", company.contact.whatsapp],
    ["Email", company.contact.email],
    ["Website", company.contact.website],
    ["Primary Services", "Software development, web & mobile apps, cloud solutions, ICT consulting, IT support"],
    ["Target Markets", company.targetMarkets.join(", ")],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ name: "Capability Statement" }]}
        eyebrow="Corporate Profile"
        title="Capability Statement"
        lead="Our structured company profile for tenders, vendor registration, and partnership conversations."
      >
        <CapabilityPdfButton />
      </PageHero>

      <nav
        aria-label="Sections of this statement"
        className="sticky top-18 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      >
        <ul className="container mx-auto flex gap-1 overflow-x-auto px-4 py-2 text-sm [scrollbar-width:none]">
          {jumpLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                className="block rounded-full px-3.5 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="fact-sheet" className="scroll-mt-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Company Fact Sheet</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {factSheet.map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-card" : "bg-secondary/40"}>
                    <th scope="row" className="w-1/3 p-4 text-left align-top font-heading font-semibold">
                      {label}
                    </th>
                    <td className="p-4 align-top text-muted-foreground">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section muted id="capabilities" className="scroll-mt-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 font-heading text-2xl font-bold md:text-3xl">Core Capabilities</h2>
          <p className="mb-8 text-muted-foreground">
            The service areas we deliver today. Each links to full detail on scope and what the client receives.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {capabilityGroups.map((group) => (
              <div key={group.title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-heading font-semibold">{group.title}</h3>
                <ul className="mb-6 space-y-3">
                  {group.services.map((service) => (
                    <li key={service.title} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="shrink-0 rounded-lg bg-accent/10 p-1.5">
                        <service.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                      </span>
                      <span className="pt-0.5">{service.title}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={group.href}
                  className="mt-auto inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:underline"
                >
                  Service details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div id="methodology" className="scroll-mt-32">
        <ProcessSteps
          eyebrow="Methodology"
          title="How We Deliver"
          lead="A structured engagement model from requirements to long-term support, with scope and cost agreed in writing before work begins."
        />
      </div>

      <Section muted id="partnerships" className="scroll-mt-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Partnership Opportunities</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-heading font-semibold">Potential Partners</h3>
              <ul className="space-y-2">
                {potentialPartners.map((partner) => (
                  <li key={partner} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-heading font-semibold">Collaboration Areas</h3>
              <ul className="space-y-2">
                {collaborationAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section id="roadmap" className="scroll-mt-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Future Roadmap</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {roadmap.map((phase) => (
              <div key={phase.phase} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-heading font-semibold text-accent">{phase.phase}</h3>
                <ul className="space-y-2">
                  {phase.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-security.jpg"
          alt="Secure systems and infrastructure"
          title="Ready for Formal Procurement"
          subtitle="Structured for vendor registration, RFQs, RFPs, and tender submissions."
        />
      </div>

      <Section muted id="tender-readiness" className="scroll-mt-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Tender Readiness & Corporate Capability</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-heading font-semibold">This Statement Supports</h3>
              <ul className="space-y-2">
                {tenderUses.map((use) => (
                  <li key={use} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {use}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-heading font-semibold">Being Added As We Grow</h3>
              <ul className="space-y-2">
                {growthAdditions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Our Promise</h2>
          <ul className="mb-10 grid gap-3 text-left sm:grid-cols-2">
            {company.values.map((value) => (
              <li key={value} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm text-foreground/80">{value}</span>
              </li>
            ))}
          </ul>
          <p className="mb-8 leading-relaxed text-muted-foreground">{company.closingStatement}</p>
          <CapabilityPdfButton />
        </div>
      </Section>

      <ContactCta
        title="Preparing a tender or partnership?"
        lead="We respond to RFQs, RFPs, and vendor registration requests. Talk to us directly about your requirements."
        action={{ href: "/contact", label: "Contact Us" }}
      />
    </>
  );
}
