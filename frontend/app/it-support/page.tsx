import type { Metadata } from "next";
import Link from "next/link";
import { ServiceJsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { Button } from "@/components/ui/button";
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
              items={service.items}
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

      <Section muted>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Need Something Fixed?</h2>
          <p className="text-muted-foreground mb-8">
            Tell us what&apos;s wrong and we&apos;ll diagnose it — no charge for the assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="accent" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
