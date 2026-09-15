import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { BlogList } from "@/components/marketing/BlogList";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Practical guidance on digital transformation, cybersecurity, cloud computing, and technology for Zimbabwean businesses.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Blog & Insights"
        lead="Practical technology guidance for businesses and institutions across Zimbabwe."
        hueShift={8}
      />

      <Section>
        <BlogList />
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-blog-insights.jpg"
          alt="Reading technology insights on a laptop"
          title="Practical, Not Theoretical"
          subtitle="Written for business owners and administrators — not for other engineers."
        />
      </div>

      <Section muted>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-8">
            Occasional practical guidance on technology for your business. No spam.
          </p>
          <NewsletterForm />
        </div>
      </Section>
    </>
  );
}
