import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { faq as defaultFaq, type FaqItem } from "@/data/faq";

interface FAQProps {
  items?: FaqItem[];
  title?: string;
  lead?: string;
  muted?: boolean;
}

/** Defaults to the general set; service pages pass their own. Pair with `FaqJsonLd items={...}`. */
export function FAQ({
  items = defaultFaq,
  title = "Frequently Asked Questions",
  lead = "Quick answers to common questions about our services and process.",
  muted = true,
}: FAQProps) {
  return (
    <section className={muted ? "section-padding bg-secondary/50" : "section-padding bg-background"}>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="FAQ" title={title} lead={lead} align="left" className="mb-0" />
          </div>

          <div className="reveal">
            <Accordion type="single" collapsible className="space-y-3">
              {items.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="rounded-xl border border-border bg-card px-5 transition-all duration-300 hover:border-accent/40 data-[state=open]:border-accent/30 data-[state=open]:shadow-lg"
                >
                  <AccordionTrigger className="py-4 text-left font-heading text-sm font-semibold transition-colors hover:text-accent sm:text-base [&[data-state=open]]:text-accent">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
