import type { Metadata } from "next";
import { ServiceJsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceTabs } from "@/components/marketing/ServiceTabs";
import { SoftwareServiceForm } from "@/components/forms/SoftwareServiceForm";
import { WorksWith } from "@/components/marketing/WorksWith";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";

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

      <WorksWith />

      <Section>
        {/* Distinct from the h1 above it, which already says "Software &
            Development Services" — this one explains the choice the tabs
            present rather than restating the page title. */}
        <SectionHeading
          eyebrow="Two Ways We Help"
          title="Fix What You Have, or Build Something New"
          lead="Day-to-day software setup and support on one side; custom systems, stores, and apps on the other."
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

      <ProcessSteps
        eyebrow="How a Build Works"
        title="Agreed in Writing, Then Built"
        lead="Scope, timeline, and cost are settled before development starts — and the finished system is handed over with documentation and training."
      />

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
