import type { Metadata } from "next";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { enquiryPhases } from "@/data/processes";
import { telHref, whatsappUrl } from "@/lib/whatsapp";

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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_22rem]">
          <QuoteForm />

          {/* Beside the form rather than below it: answers "what happens after
              I press submit?" at the moment the visitor is deciding, and offers
              a faster route for anyone who would rather just talk. */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold">What happens next</h2>
              <ol className="space-y-4">
                {enquiryPhases.slice(1).map((phase, i) => (
                  <li key={phase.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-heading text-sm font-semibold">{phase.title}</p>
                      <p className="text-sm text-muted-foreground">{phase.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                Free and no obligation.
              </p>
            </div>

            <div className="rounded-2xl bg-hero p-6 text-hero-foreground">
              <h2 className="mb-2 font-heading text-lg font-semibold">Rather just talk?</h2>
              <p className="mb-5 text-sm text-white/75">Describe the job on WhatsApp or give us a call.</p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="whatsapp">
                  <a
                    href={whatsappUrl("Hello MudhoTech, I'd like a quote for:")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp {company.contact.whatsapp}
                  </a>
                </Button>
                <Button asChild variant="heroOutline">
                  <a href={telHref()}>
                    <Phone className="h-4 w-4" />
                    Call {company.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
