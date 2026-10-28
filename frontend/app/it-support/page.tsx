import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Phone } from "lucide-react";
import { ServiceJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/components/marketing/FAQ";
import { supportFaq } from "@/data/faq";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { SoftwareServiceForm } from "@/components/forms/SoftwareServiceForm";
import { Button } from "@/components/ui/button";
import { repairPhases } from "@/data/processes";
import { supportGroups } from "@/data/services";
import { company } from "@/data/company";
import { commitments } from "@/data/commitments";
import { telHref, whatsappUrl } from "@/lib/whatsapp";

const description =
  "Laptop and desktop repairs and upgrades, networking and Wi-Fi, printer and device setup, and software installation and troubleshooting, from our Harare office or on site.";

export const metadata: Metadata = {
  title: "IT Support, Repairs & Software Setup",
  description,
  alternates: { canonical: "/it-support" },
};

/** Columns that fill every row: four cards sit in one row, not three plus one. */
const columns: Record<number, string> = {
  2: "",
  4: "xl:grid-cols-4",
};

/**
 * The "keep technology working" path: every repair, network, and software
 * setup service, in three groups. Software setup moved here from
 * /web-software, so that page can be about building software.
 */
export default function ITSupportPage() {
  return (
    <>
      <ServiceJsonLd name="IT Support, Repairs & Software Setup" description={description} path="/it-support" />
      <FaqJsonLd items={supportFaq} />

      <PageHero
        crumbs={[{ name: "IT Support" }]}
        eyebrow="IT Support"
        title="IT Support, Repairs & Software Setup"
        lead="Computers repaired, networks fixed, and software set up properly — for a single laptop or a whole office."
      >
        <nav aria-label="On this page">
          <ul className="flex flex-wrap justify-center gap-2">
            {supportGroups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="inline-flex rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {group.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#request-support"
                className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
              >
                Request support
              </a>
            </li>
          </ul>
        </nav>
      </PageHero>

      {supportGroups.map((group, i) => (
        <Section key={group.id} id={group.id} muted={i % 2 === 1} className="scroll-mt-20">
          <SectionHeading eyebrow={`${i + 1} of ${supportGroups.length}`} title={group.title} lead={group.lead} />
          <div className={`grid gap-6 md:grid-cols-2 ${columns[group.services.length] ?? "lg:grid-cols-3"}`}>
            {group.services.map((service) => (
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
        </Section>
      ))}

      <div className="container mx-auto px-4">
        <SectionBreak title="Diagnosed Properly, Fixed Once" subtitle={commitments.freeAssessment} />
      </div>

      <ProcessSteps
        eyebrow="How a Repair Works"
        title="No Charge Until You Say Yes"
        lead="You know what is wrong and what it will cost before any work begins."
        phases={repairPhases}
        link={null}
      />

      <FAQ
        items={supportFaq}
        title="Repair & Support Questions"
        lead="What people usually ask before they bring a device in."
      />

      <Section id="request-support" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Get Help"
              title="Request Support"
              lead={`Tell us what is wrong and which device or system it affects. ${commitments.responseTime}`}
              align="left"
              className="mb-6"
            />
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Faster on your phone? Send a photo of the problem on WhatsApp, or call during office hours —{" "}
              {company.hours.weekdays}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={whatsappUrl("Hello MudhoTech, I need IT support with: ")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  WhatsApp {company.contact.whatsapp}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={telHref()}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {company.contact.phone}
                </a>
              </Button>
            </div>
          </div>
          <div className="card-surface p-6 sm:p-8">
            <SoftwareServiceForm />
          </div>
        </div>
      </Section>
    </>
  );
}
