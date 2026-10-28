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
        crumbs={[{ name: "Blog" }]}
        eyebrow="Insights"
        title="Blog & Insights"
        lead="Practical technology guidance for businesses and institutions across Zimbabwe."
      />

      <Section>
        <BlogList />
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          title="Practical, Not Theoretical"
          subtitle="Written for business owners and administrators — not for other engineers."
        />
      </div>

      <Section muted>
        <div className="card-surface flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="mb-2 font-heading text-2xl font-bold md:text-3xl">Stay in the Loop</h2>
            <p className="text-muted-foreground">
              Occasional practical guidance on technology for your business. No spam.
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Section>
    </>
  );
}
