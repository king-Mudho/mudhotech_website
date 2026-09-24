import type { Metadata } from "next";
import { ServiceJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/components/marketing/FAQ";
import { supportFaq } from "@/data/faq";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { ContactCta } from "@/components/marketing/ContactCta";
import { repairPhases } from "@/data/processes";
import { hardwareServices } from "@/data/services";

export const metadata: Metadata = {
  title: "IT Support & Hardware Services",
  description:
    "Hardware installation and upgrades, laptop and desktop repairs, preventive maintenance, networking, peripheral setup, and advanced hardware support.",
  alternates: { canonical: "/it-support" },
};

export default function ITSupportPage() {
  return (
    <>
      <ServiceJsonLd
        name="IT Support & Hardware Services"
        description="Hardware installation and upgrades, laptop and desktop repairs, preventive maintenance, networking, and peripheral setup."
        path="/it-support"
      />
      <FaqJsonLd items={supportFaq} />

      <PageHero
        crumbs={[{ name: "IT Support" }]}
        eyebrow="IT Support"
        title="Hardware & Networking Support"
        lead="We keep your systems running — fast, secure, and smooth. Repairs, upgrades, maintenance, and networking."
        hueShift={14}
      />

      <Section>
        {/* Each card is an h3; without this h2 the page jumped straight from
            the h1 to h3, which reads as a missing level to assistive tech. */}
        <SectionHeading
          eyebrow="What We Cover"
          title="Hardware & Networking Services"
          lead="Installation, repair, maintenance, and connectivity — for a single laptop or a whole office."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hardwareServices.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              detail={service.detail}
              items={service.items}
              worksWith={service.worksWith}
              bestFor={service.bestFor}
              image={service.image}
              turnaround={service.turnaround}
            />
          ))}
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-repairs.jpg"
          alt="Technician repairing computer hardware"
          title="Diagnosed Properly, Fixed Once"
          subtitle="Free diagnostics before any repair work begins."
        />
      </div>

      <ProcessSteps
        eyebrow="How a Repair Works"
        title="No Charge Until You Say Yes"
        lead="You know what is wrong and what it will cost before any work begins."
        phases={repairPhases}
        link={null}
      />

      <FAQ items={supportFaq} title="Repair & Support Questions" lead="What people usually ask before they bring a device in." />

      <ContactCta
        title="Need something fixed?"
        lead="Tell us what's wrong and we'll diagnose it — no charge for the assessment. WhatsApp a photo of the problem to get started faster."
        action={{ href: "/contact", label: "Get in Touch" }}
      />
    </>
  );
}
