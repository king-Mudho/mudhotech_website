import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ArrowRight, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { commitments } from "@/data/commitments";
import { WHATSAPP_GREETING, telHref, whatsappUrl } from "@/lib/whatsapp";

/**
 * Closing band. Offers the quote form alongside the two channels most
 * visitors in this market actually use first — WhatsApp and a phone call —
 * so nobody who has decided to get in touch has to go looking for a number.
 */
interface ContactCtaProps {
  title?: string;
  lead?: string;
  action?: { href: string; label: string };
}

export function ContactCta({
  title = "Ready to get started?",
  lead = `Tell us what you need and we'll put together a practical, costed proposal. ${commitments.freeAssessment}`,
  action = { href: "/quote", label: "Request a Free Quote" },
}: ContactCtaProps) {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-hero px-6 py-10 text-hero-foreground shadow-xl sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-hero-accent/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-balance font-heading text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/75">{lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg">
                  <Link href={action.href}>
                    {action.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsappUrl(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Each <div> holds its <dt>/<dd> directly, which is the only nesting
                a <dl> allows; the icon lives inside the <dt>. The old layout put
                them a level deeper, so assistive tech lost the term/value pairs. */}
            <dl className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm">
              <div>
                <dt className="flex items-center gap-2 font-heading font-semibold text-white">
                  <Phone className="h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
                  Call us
                </dt>
                <dd className="mt-1 pl-6">
                  <a href={telHref()} className="text-white/75 hover:text-white hover:underline">
                    {company.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-heading font-semibold text-white">
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
                  WhatsApp
                </dt>
                <dd className="mt-1 pl-6">
                  <a
                    href={whatsappUrl(WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 hover:text-white hover:underline"
                  >
                    {company.contact.whatsapp}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-heading font-semibold text-white">
                  <Clock className="h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
                  Office hours
                </dt>
                <dd className="mt-1 pl-6 text-white/75">{company.hours.weekdays}</dd>
                <dd className="pl-6 text-white/75">{company.hours.saturday}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
