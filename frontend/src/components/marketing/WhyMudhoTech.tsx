"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import { fadeUp } from "@/lib/motion";
import { SectionHeading } from "@/components/layout/SectionHeading";

// TODO(content): placeholder statistics — confirm real figures with the
// business owner before launch. See docs/OPEN-QUESTIONS.md #4.
const stats = [
  { target: 50, suffix: "+", label: "Projects Delivered" },
  { target: 35, suffix: "+", label: "Happy Clients" },
  { target: 5, suffix: "+", label: "Years Experience" },
  { target: 24, suffix: "/7", label: "Support Available" },
];

export function WhyMudhoTech() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp}>
          <SectionHeading eyebrow="Why MudhoTech" title="Built on Results" tone="light" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-heading text-4xl md:text-5xl font-extrabold text-hero-accent mb-2">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
