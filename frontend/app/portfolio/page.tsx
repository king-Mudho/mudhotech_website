import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { PortfolioTabs } from "@/components/marketing/PortfolioTabs";
import { Testimonials } from "@/components/marketing/Testimonials";

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
        eyebrow="Our Work"
        title="Portfolio"
        lead="Software we've built, hardware we've fixed, and the results our clients saw."
        hueShift={-20}
      />

      <Section>
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

      <Testimonials />
    </>
  );
}
