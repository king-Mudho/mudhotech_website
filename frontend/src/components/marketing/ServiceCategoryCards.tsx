"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/motion";
import { SectionHeading } from "@/components/layout/SectionHeading";

const categories = [
  {
    title: "Web & Mobile Development",
    description: "Custom websites, web systems, and mobile apps built around your operations.",
    image: "/images/service-software.jpg",
    href: "/web-software",
  },
  {
    title: "IT Consulting & Support",
    description: "Hardware repairs, maintenance, and day-to-day technical support you can rely on.",
    image: "/images/service-hardware.jpg",
    href: "/it-support",
  },
  {
    title: "Cloud & Networking",
    description: "Cloud migration, network setup, and connectivity for homes and offices.",
    image: "/images/service-networking.jpg",
    href: "/it-support",
  },
  {
    title: "E-Commerce & ICT",
    description: "Online stores with local payment integration, plus general ICT services.",
    image: "/images/service-ecommerce.jpg",
    href: "/web-software",
  },
];

export function ServiceCategoryCards() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="What We Do"
            title="Our Services"
            lead="End-to-end technology services for organizations of every size."
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.title}
              {...fadeUpDelayed(i)}
            >
              <Link
                href={category.href}
                className="group relative block h-72 overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  loading="lazy"
                  quality={65}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient only where the caption sits, rather than a wash over
                    the whole card — the photograph stays bright and legible
                    while the text keeps its contrast. */}
                <div className="absolute inset-0 bg-gradient-to-t from-hero via-hero/55 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <h3 className="mb-1.5 font-heading text-lg font-semibold text-white drop-shadow-sm">
                    {category.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/85">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
