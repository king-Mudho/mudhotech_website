import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us about your project and we'll prepare a practical, costed proposal — scope, timeline, and deliverables.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Request a Quote" }]}
        eyebrow="Get a Quote"
        title="Request a Free Quote"
        lead="Tell us what you need. We'll come back with scope, timeline, and a clear cost estimate."
        hueShift={-6}
      />

      <Section>
        <div className="max-w-2xl mx-auto">
          <QuoteForm />
        </div>
      </Section>
    </>
  );
}
