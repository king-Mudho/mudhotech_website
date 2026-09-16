import type { Metadata } from "next";
import { ServiceJsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceTabs } from "@/components/marketing/ServiceTabs";
import { SoftwareServiceForm } from "@/components/forms/SoftwareServiceForm";

export const metadata: Metadata = {
  title: "Web & Software Services",
  description:
    "Custom web systems, e-commerce, mobile apps, and full software installation, setup, security, and troubleshooting services.",
  alternates: { canonical: "/web-software" },
};

export default function WebSoftwarePage() {
  return (
    <>
      <ServiceJsonLd
        name="Web & Software Development"
        description="Custom web systems, e-commerce, mobile apps, plus software installation, setup, security, and troubleshooting."
        path="/web-software"
      />

      <PageHero
        crumbs={[{ name: "Web & Software" }]}
        eyebrow="Web & Software"
        title="Software & Development Services"
        lead="From operating system setup to custom business platforms — everything your organization runs on."
        hueShift={-12}
      />

      <Section>
        <SectionHeading
          eyebrow="What We Do"
          title="Software Services & Development"
          lead="Pick a track below — day-to-day software support, or building something new."
        />
        <ServiceTabs />
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-creative.jpg"
          alt="Design and creative software work"
          title="Software That Fits How You Work"
          subtitle="Built around your operations, not the other way around."
        />
      </div>

      <Section muted id="request-service">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            eyebrow="Get Started"
            title="Request a Software Service"
            lead="Tell us which category you need and what the problem is — we&apos;ll come back with next steps."
          />
          <SoftwareServiceForm />
        </div>
      </Section>
    </>
  );
}
