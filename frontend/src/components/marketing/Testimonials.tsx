"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { fadeUp } from "@/lib/motion";
import { SectionHeading } from "@/components/layout/SectionHeading";

// TODO(content): placeholder testimonials — replace with real client quotes
// before this page is shown to procurement/investor audiences. See
// docs/OPEN-QUESTIONS.md #4.
const testimonials = [
  {
    name: "Tendai Moyo",
    role: "Principal, Sunrise Academy",
    content:
      "MudhoTech transformed our school administration. The management system they built handles everything from attendance to fee collection. Our staff saves hours every week.",
    rating: 5,
  },
  {
    name: "Rumbidzai Chikwanha",
    role: "Director, GreenLeaf Trading",
    content:
      "Their team built us a custom e-commerce platform that doubled our online sales within three months. Professional, responsive, and truly understand business needs.",
    rating: 5,
  },
  {
    name: "Tafadzwa Murombedzi",
    role: "Operations Manager, SafeGuard Security",
    content:
      "The network security audit and IT infrastructure overhaul they did for us was outstanding. We now have peace of mind knowing our systems are properly protected.",
    rating: 5,
  },
  {
    name: "Farai Dube",
    role: "CEO, BrightPath Logistics",
    content:
      "Affordable, reliable, and innovative — that's how I'd describe MudhoTech. They delivered our fleet management dashboard ahead of schedule and under budget.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp}>
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            lead="Real feedback from businesses we&apos;ve helped transform through technology."
          />
        </motion.div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}>
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="pl-4 basis-full md:basis-1/2">
                  <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full">
                    <Quote className="absolute top-5 right-5 h-8 w-8 text-accent/10" />

                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>

                    <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">&ldquo;{t.content}&rdquo;</p>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center font-heading font-bold text-accent text-sm">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-sm">{t.name}</p>
                        <p className="text-muted-foreground text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
