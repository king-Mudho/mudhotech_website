import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { HomeHero } from "@/components/marketing/HomeHero";
import { ServiceCategoryCards } from "@/components/marketing/ServiceCategoryCards";

// Below-the-fold and framer-motion/embla-heavy — deferred so they don't
// compete with the hero for main-thread time during the LCP window.
const WhyMudhoTech = dynamic(() => import("@/components/marketing/WhyMudhoTech").then((m) => m.WhyMudhoTech));
const FAQ = dynamic(() => import("@/components/marketing/FAQ").then((m) => m.FAQ));
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { OrganizationJsonLd, LocalBusinessJsonLd, WebSiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Innovative Digital Solutions & Reliable IT Support",
  description: company.about,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      {/* The FAQ accordion below is rendered from the same `faq` module, so
          the structured data always matches what the visitor can see. */}
      <FaqJsonLd />

      <HomeHero />

      <Section muted>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow="Who We Are" title={company.shortName} className="mb-6" />
          <p className="mb-4 leading-relaxed text-muted-foreground">{company.about}</p>
          <p className="leading-relaxed text-muted-foreground">{company.closingStatement}</p>
        </div>
      </Section>

      {/* TrustedPartners and Testimonials are deliberately not rendered.
          Both are placeholder content — six invented client logos (one of
          them Harare City Council, a real government body) and four
          testimonials attributed to named individuals who do not exist.
          On a live domain those read as genuine endorsements. The
          components and their data are still in the repo; restore these two
          lines once there is real, attributable content to put in them.
          See docs/OPEN-QUESTIONS.md #4. */}
      <ServiceCategoryCards />
      <WhyMudhoTech />
      <FAQ />

      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Tell us what you need and we&apos;ll put together a practical, costed proposal.
          </p>
          <Button asChild variant="accent" size="xl">
            <Link href="/quote">Request a Free Quote</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
