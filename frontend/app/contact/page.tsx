import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Phone, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { ContactForm } from "@/components/forms/ContactForm";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { enquiryPhases } from "@/data/processes";
import { company } from "@/data/company";
import { commitments } from "@/data/commitments";
import { telHref, mailtoHref, whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${company.shortName} — phone, WhatsApp, email, or visit our Harare office.`,
  alternates: { canonical: "/contact" },
};

const mapsUrl = "https://www.google.com/maps/search/?api=1&query=8+Shepperton+Graniteside+Harare+Zimbabwe";

export default function ContactPage() {
  const contactCards = [
    {
      icon: Phone,
      label: "Call Us",
      value: company.contact.phone,
      hint: "Tap to call",
      href: telHref(),
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: company.contact.whatsapp,
      hint: "Opens a chat",
      // Pre-filled so the visitor lands in a conversation that has already
      // started, rather than an empty chat they have to compose.
      href: whatsappUrl(WHATSAPP_GREETING),
    },
    {
      icon: Mail,
      label: "Email",
      value: company.contact.email,
      hint: "Opens your mail app",
      href: mailtoHref("Enquiry from mudhotech.com"),
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: company.registeredOffice,
      hint: "Open in Maps",
      href: mapsUrl,
    },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact" }]}
        eyebrow="Contact"
        title="Let's Talk"
        lead="Questions, quotes, or support — reach us whichever way suits you best."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map(({ icon: Icon, label, value, hint, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="card-interactive group flex flex-col p-6"
            >
              <span className="icon-tile mb-4">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mb-1 font-heading font-semibold">{label}</p>
              <p className="break-words text-sm text-muted-foreground">{value}</p>
              {/* Tells the visitor what tapping actually does before they
                  commit. Always visible on touch, where there is no hover to
                  reveal it; it only fades in on pointer devices. */}
              <p className="mt-3 text-xs font-medium text-accent transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                {hint}
              </p>
            </a>
          ))}
        </div>

        <div className="card-surface mt-6 flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-heading text-lg font-semibold">Business Hours</h2>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:gap-8">
            <li>{company.hours.weekdays}</li>
            <li>{company.hours.saturday}</li>
            <li>{company.hours.sunday}</li>
          </ul>
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          title="A Real Person Will Reply"
          subtitle="No ticket queues or call centres — you deal directly with the people doing the work."
        />
      </div>

      <Section muted>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-14">
          <SectionHeading
            eyebrow="Write to Us"
            title="Send Us a Message"
            lead={commitments.responseTime}
            align="left"
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <div className="card-surface p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>

      <ProcessSteps
        eyebrow="What Happens Next"
        title="After You Get in Touch"
        lead="No sales pressure — just a clear answer about what you need and what it costs."
        phases={enquiryPhases}
        link={null}
      />

      <section aria-label="Office location map">
        <MapEmbed
          query="8 Shepperton, Graniteside, Harare, Zimbabwe"
          label="MudhoTech Solutions office location"
          directUrl={mapsUrl}
        />
      </section>
    </>
  );
}
