import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { CapabilityPdfButton } from "@/components/marketing/CapabilityPdfButton";
import { company } from "@/data/company";
import { collaborationAreas, potentialPartners } from "@/data/partnerships";
import { roadmap } from "@/data/roadmap";

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

      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Company Fact Sheet</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {factSheet.map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-card" : "bg-secondary/40"}>
                    <th scope="row" className="text-left font-heading font-semibold p-4 align-top w-1/3">
                      {label}
                    </th>
                    <td className="p-4 text-muted-foreground align-top">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Partnership Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">Potential Partners</h3>
              <ul className="space-y-2">
                {potentialPartners.map((partner) => (
                  <li key={partner} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">Collaboration Areas</h3>
              <ul className="space-y-2">
                {collaborationAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Future Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((phase) => (
              <div key={phase.phase} className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-heading font-semibold text-accent mb-4">{phase.phase}</h3>
                <ul className="space-y-2">
                  {phase.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
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

      <Section muted>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Tender Readiness & Corporate Capability</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">This Statement Supports</h3>
              <ul className="space-y-2">
                {tenderUses.map((use) => (
                  <li key={use} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {use}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-heading font-semibold mb-4">Being Added As We Grow</h3>
              <ul className="space-y-2">
                {growthAdditions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Our Promise</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-left mb-10">
            {company.values.map((value) => (
              <li key={value} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{value}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-8">{company.closingStatement}</p>
          <CapabilityPdfButton />
        </div>
      </Section>
    </>
  );
}
