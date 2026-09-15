"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

interface SectionBreakProps {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  className?: string;
  rounded?: boolean;
}

/**
 * Full-width parallax band used to break up long pages.
 *
 * This is one of the few places a photograph earns its keep: it is mid-page
 * (so never the LCP element) and carries no competing UI. The overlay is a
 * directional gradient rather than a flat wash, so the image stays visible
 * while the caption keeps its contrast.
 */
export function SectionBreak({ src, alt, title, subtitle, className, rounded = true }: SectionBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  return (
    <motion.div
      ref={ref}
      {...fadeUp}
      className={cn(
        "group relative my-12 h-56 overflow-hidden shadow-sm md:h-64",
        rounded && "rounded-2xl",
        className,
      )}
    >
      {/* Raw element, not next/image, so framer can drive the parallax
          transform directly on it. */}
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="absolute -top-[12%] inset-0 h-[124%] w-full object-cover"
        loading="lazy"
      />

      {/* Diagonal gradient keeps the left side readable and lets the right
          side of the photograph come through. */}
      <div className="absolute inset-0 bg-gradient-to-r from-hero/85 via-hero/60 to-hero/25" />

      <div className="relative flex h-full items-center px-8 md:px-14">
        <div className="max-w-lg text-left">
          <h3 className="mb-2 font-heading text-2xl font-bold text-white drop-shadow-sm md:text-3xl">{title}</h3>
          <p className="text-sm leading-relaxed text-white/85 md:text-base">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
