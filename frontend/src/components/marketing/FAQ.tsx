"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fadeUp } from "@/lib/motion";
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
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="FAQ"
            title={title}
            lead={lead}
          />
        </motion.div>

        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-accent/30 data-[state=open]:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-sm sm:text-base hover:text-accent transition-colors py-5 [&[data-state=open]]:text-accent">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
