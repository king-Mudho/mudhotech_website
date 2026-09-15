import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionBreak } from "@/components/layout/SectionBreak";
import { ContactForm } from "@/components/forms/ContactForm";
import { company } from "@/data/company";
import { telHref, mailtoHref, whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${company.shortName} — phone, WhatsApp, email, or visit our Harare office.`,
  alternates: { canonical: "/contact" },
};

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
      icon: MessageCircle,
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
      href: mailtoHref("Enquiry from mudhotech.co.zw"),
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: company.registeredOffice,
      hint: "Open in Maps",
      href: "https://www.google.com/maps/search/?api=1&query=8+Shepperton+Graniteside+Harare+Zimbabwe",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk"
        lead="Questions, quotes, or support — reach us whichever way suits you best."
        hueShift={20}
      />

      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactCards.map(({ icon: Icon, label, value, hint, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
            >
              <div className="mb-4 w-fit rounded-xl bg-accent/10 p-3 transition-colors group-hover:bg-accent/15">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <p className="mb-1 font-heading font-semibold">{label}</p>
              <p className="break-words text-sm text-muted-foreground">{value}</p>
              {/* Tells the visitor what tapping actually does before they commit. */}
              <p className="mt-3 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                {hint}
              </p>
            </a>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 rounded-2xl bg-card border border-border p-6">
          <h2 className="font-heading font-semibold text-lg mb-3">Business Hours</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>{company.hours.weekdays}</li>
            <li>{company.hours.saturday}</li>
            <li>{company.hours.sunday}</li>
          </ul>
        </div>
      </Section>

      <div className="container mx-auto px-4">
        <SectionBreak
          src="/images/section-contact-support.jpg"
          alt="Support team assisting a client"
          title="A Real Person Will Reply"
          subtitle="No ticket queues or call centres — you deal directly with the people doing the work."
        />
      </div>

      <Section muted>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-muted-foreground">We typically respond within one business day.</p>
          </div>
          <ContactForm />
        </div>
      </Section>

      <section aria-label="Office location map">
        <iframe
          title="MudhoTech Solutions office location"
          src="https://www.google.com/maps?q=8+Shepperton+Graniteside+Harare+Zimbabwe&output=embed"
          className="w-full h-96 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
