"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

/**
 * Plain <img>, not next/image — used for externally-hosted gallery photos
 * (docs/OPEN-QUESTIONS.md #4's placeholder Unsplash URLs) that aren't
 * configured in next.config.ts's image remotePatterns. Always shows a
 * visible skeleton fallback while loading (docs/09-ui-ux-design.md §7).
 */
export function SkeletonImage({ wrapperClassName, className, alt, ...props }: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- external, unconfigured remote host; see comment above */}
      <img
        {...props}
        alt={alt ?? ""}
        className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
