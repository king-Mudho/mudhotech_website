import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { PortfolioTabs } from "@/components/marketing/PortfolioTabs";
import { ContactCta } from "@/components/marketing/ContactCta";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected software projects, hardware repair case studies, and device gallery from MudhoTech Solutions.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Portfolio" }]}
        eyebrow="Our Work"
        title="Portfolio"
        lead="The devices and systems we work on day to day. Written case studies and client references are available on request."
        hueShift={-20}
      />

      <Section>
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects, Repairs & Gallery"
          lead="Browse by what you need: software we've delivered, hardware we've brought back, or the kit we work on."
        />
        <PortfolioTabs />
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-networking.jpg"
          alt="Structured network cabling in an office"
          title="Built to Be Handed Over"
          subtitle="Documented, supported, and yours — every project ends with training, not a dependency."
        />
      </div>

      <ContactCta
        title="Want to see work like yours?"
        lead="Written case studies and client references are available on request. Tell us what you are planning and we'll share relevant examples."
        action={{ href: "/contact", label: "Ask for References" }}
      />
    </>
  );
}
