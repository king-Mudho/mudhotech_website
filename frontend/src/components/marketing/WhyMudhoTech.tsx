"use client";

import { motion } from "framer-motion";
import { Stethoscope, Wrench, FileText, MapPin } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { SectionHeading } from "@/components/layout/SectionHeading";

/**
 * This band used to show four animated counters: "50+ Projects Delivered",
 * "35+ Happy Clients", "5+ Years Experience", "24/7 Support Available".
 * Every one of those figures was invented placeholder content, and on a live
 * commercial domain an invented metric is a claim a customer can hold the
 * business to.
 *
 * What replaces them are commitments the site already makes elsewhere and
 * that the business controls directly — how it works, not how much it has
 * done. Swap in real figures once they exist; the counter component is still
 * in the repo at marketing/AnimatedCounter.tsx.
 */
const differentiators = [
  {
    icon: Stethoscope,
    title: "Free diagnostics first",
    body: "We find the fault and tell you what it will cost before any work is agreed — including when the honest answer is that it isn't worth repairing.",
  },
  {
    icon: Wrench,
    title: "One team, build and support",
    body: "The people who build your system are the people who look after it. No handover to a support desk that has never seen your setup.",
  },
  {
    icon: FileText,
    title: "Handed over, not held hostage",
    body: "Every project ends with documentation and training. You own what we build, and you are free to take it elsewhere.",
  },
  {
    icon: MapPin,
    title: "Harare-based, on site",
    body: "We work across Zimbabwe and can come to you. Hardware problems get hands on them rather than instructions over the phone.",
  },
];

export function WhyMudhoTech() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="Why MudhoTech"
            title="How We Work"
            lead="Four commitments we make on every job, whatever the size."
            tone="light"
          />
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <span className="mb-4 inline-flex rounded-xl bg-hero-accent/15 p-2.5">
                <item.icon className="h-5 w-5 text-hero-accent" aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-heading text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/70">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
