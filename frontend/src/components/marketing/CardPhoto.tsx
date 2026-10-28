import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

interface CardPhotoProps {
  src: string;
  icon?: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  /** Above the fold (e.g. the featured blog post): load eagerly. */
  priority?: boolean;
  className?: string;
}

/**
 * The photo at the top of a card: it shows what the service or article is
 * about at a glance. Decorative, because the card's heading names it.
 * Zooms slightly when the card is hovered; the navy fade at the bottom keeps
 * the icon chip readable on any photo.
 */
export function CardPhoto({ src, icon: Icon, priority, className }: CardPhotoProps) {
  return (
    <div className={cn("relative h-44 shrink-0 overflow-hidden bg-band", className)}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        quality={65}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-band/70 via-band/10 to-transparent" />
      {Icon && (
        <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-md">
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
