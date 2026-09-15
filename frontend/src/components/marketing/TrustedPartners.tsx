"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "@/lib/motion";
import { SectionHeading } from "@/components/layout/SectionHeading";

// TODO(content): placeholder partner logos/names — replace with real
// partners before this page is shown to procurement/investor audiences.
// See docs/OPEN-QUESTIONS.md #4.
const partners = [
  { name: "Sunrise Academy", logo: "/images/logo-sunrise-academy.png" },
  { name: "GreenLeaf Trading", logo: "/images/logo-greenleaf-trading.png" },
  { name: "SafeGuard Security", logo: "/images/logo-safeguard-security.png" },
  { name: "BrightPath Logistics", logo: "/images/logo-brightpath-logistics.png" },
  { name: "TechBridge Solutions", logo: "/images/logo-techbridge.png" },
  { name: "Harare City Council", logo: "/images/logo-harare-council.png" },
];

export function TrustedPartners() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="Trusted By"
            title="Our Partners & Clients"
            lead="Proud to work with leading organisations across Zimbabwe."
          />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto items-center">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              {/* Muted rather than washed out: full grayscale at 70% opacity
                  made these almost invisible on a light background. */}
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={64}
                className="h-16 w-auto object-contain opacity-90 grayscale-[65%] transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:invert dark:group-hover:invert-0"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
