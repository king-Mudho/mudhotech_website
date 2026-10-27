import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionBreakProps {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  className?: string;
  rounded?: boolean;
}

/**
 * Full-width photo band used to break up long pages.
 *
 * This is one of the few places a photograph earns its keep: it is mid-page
 * (so never the LCP element) and carries no competing UI. The overlay is a
 * directional gradient rather than a flat wash, so the image stays visible
 * while the caption keeps its contrast.
 *
 * It used to be a framer-motion parallax on a raw <img>, which shipped the
 * full-size JPEG to phones and kept the band invisible until JavaScript
 * loaded. next/image now serves a resized AVIF/WebP, and the band is static.
 */
export function SectionBreak({ src, alt, title, subtitle, className, rounded = true }: SectionBreakProps) {
  return (
    <div
      className={cn(
        "reveal group relative my-12 h-56 overflow-hidden shadow-sm md:h-64",
        rounded && "rounded-2xl",
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 1280px) 100vw, 1280px" quality={60} className="object-cover" />

      {/* Diagonal gradient keeps the left side readable and lets the right
          side of the photograph come through. */}
      <div className="absolute inset-0 bg-gradient-to-r from-hero/85 via-hero/60 to-hero/25" />

      <div className="relative flex h-full items-center px-8 md:px-14">
        <div className="max-w-lg text-left">
          <h3 className="mb-2 font-heading text-2xl font-bold text-white drop-shadow-sm md:text-3xl">{title}</h3>
          <p className="text-sm leading-relaxed text-white/85 md:text-base">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
