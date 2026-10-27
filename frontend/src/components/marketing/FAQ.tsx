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
        <div className="reveal">
          <SectionHeading eyebrow="FAQ" title={title} lead={lead} />
        </div>

        <div className="reveal mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6 transition-all duration-300 data-[state=open]:border-accent/30 data-[state=open]:shadow-lg"
              >
                <AccordionTrigger className="py-5 text-left font-heading text-sm font-semibold transition-colors hover:text-accent sm:text-base [&[data-state=open]]:text-accent">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
