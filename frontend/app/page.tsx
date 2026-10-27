import type { Metadata } from "next";
import { HomeHero } from "@/components/marketing/HomeHero";
import { ContactCta } from "@/components/marketing/ContactCta";
import { NeedsFinder } from "@/components/marketing/NeedsFinder";
import { WhyMudhoTech } from "@/components/marketing/WhyMudhoTech";
import { FAQ } from "@/components/marketing/FAQ";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { IndustriesServed } from "@/components/marketing/IndustriesServed";
import { OrganizationJsonLd, LocalBusinessJsonLd, WebSiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  // Absolute: names the services and the city, which the layout's default doesn't.
  title: { absolute: "Software Development & IT Support in Harare | MudhoTech Solutions" },
  description:
    "MudhoTech Solutions builds websites, business systems, and mobile apps, and provides IT support, computer repairs, and networking for organizations across Zimbabwe, from Harare.",
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
      <NeedsFinder />

      {/* "Who We Are" and the four "Our Services" photo cards were removed:
          both restated what the hero's two paths and the problem cards above
          already say. TrustedPartners and Testimonials stay unrendered — they
          hold invented logos and testimonials (see docs/OPEN-QUESTIONS.md #4);
          restore them only with real, attributable content. */}
      <WhyMudhoTech />
      <ProcessSteps />
      <IndustriesServed />
      <FAQ />
      <ContactCta />
    </>
  );
}
