import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpenCheck, FileSignature, LifeBuoy, TestTube2, Wrench } from "lucide-react";
import { ServiceJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/components/marketing/FAQ";
import { buildFaq } from "@/data/faq";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { ContactCta } from "@/components/marketing/ContactCta";
import { devServices } from "@/data/services";
import { commitments } from "@/data/commitments";

const description =
  "Websites, custom business systems, online stores, and mobile apps for organizations in Zimbabwe — scoped and costed in writing, then handed over with documentation and training.";

export const metadata: Metadata = {
  title: "Software Development: Websites, Systems & Apps",
  description,
  alternates: { canonical: "/web-software" },
};

/**
 * Each item restates a commitment already made in `buildFaq` or the
 * engagement process — this section groups them, it adds no new promise.
 */
const included: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileSignature,
    title: "Scope and cost in writing",
    body: "A costed proposal with scope, timeline, and deliverables. No development starts until you approve it.",
  },
  {
    icon: TestTube2,
    title: "Built and tested",
    body: "Development, configuration, and testing, then deployment into your environment.",
  },
  {
    icon: BookOpenCheck,
    title: "Documentation and training",
    body: "Your team is trained and given documentation, so you can run the system yourselves.",
  },
  {
    icon: LifeBuoy,
    title: "Support if you want it",
    body: "Maintenance, updates, troubleshooting, and user support after launch — optional, not a lock-in.",
  },
];

/**
 * The "build and improve" path. Day-to-day software installation and
 * troubleshooting used to share this page (and open as its default tab), which
 * buried the development work; they now live on /it-support with the rest of
 * the "keep it working" services.
 */
export default function WebSoftwarePage() {
  return (
    <>
      <ServiceJsonLd name="Software Development" description={description} path="/web-software" />
      <FaqJsonLd items={buildFaq} />

      <PageHero
        crumbs={[{ name: "Software Development" }]}
        eyebrow="Software Development"
        title="Websites, Business Systems & Apps"
        lead="Software built around how your organization works — agreed in writing before we start, and handed over so you can run it."
      />

      <Section id="services" className="scroll-mt-20">
        <SectionHeading
          eyebrow="What We Build"
          title="From a Company Website to the System Behind It"
          lead="Pick the closest match. Most projects combine more than one, and we will say plainly if something off-the-shelf would serve you better."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devServices.map((service) => (
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
              note={service.note}
              className="reveal"
            />
          ))}
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-border bg-secondary/50 px-5 py-4 text-center text-sm text-muted-foreground">
          <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
          Need software installed, a virus removed, or a computer fixed instead?
          <Link
            href="/it-support#software"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            See IT support
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Every Build"
          title="What You Get, Whatever the Size"
          lead="The same four things come with a five-page website and a multi-branch stock system."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {included.map(({ icon: Icon, title, body }) => (
            <li key={title} className="card-interactive reveal group p-6">
              <span className="icon-tile mb-4">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-heading text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <ProcessSteps
        eyebrow="How a Build Works"
        title="Agreed in Writing, Then Built"
        lead="Scope, timeline, and cost are settled before development starts — and the finished system is handed over with documentation and training."
      />

      <div className="container mx-auto px-4">
        <SectionBreak
          title="Software That Fits How You Work"
          subtitle="Built around your operations, not the other way around."
        />
      </div>

      <FAQ
        items={buildFaq}
        title="Before You Commission a Build"
        lead="Cost, payments, ownership, and support — answered up front."
        muted={false}
      />

      <ContactCta
        title="Planning a website or system?"
        lead={`Tell us what you need and we'll come back with a costed proposal. ${commitments.freeAssessment}`}
        action={{ href: "/quote", label: "Request a Quote" }}
      />
    </>
  );
}
