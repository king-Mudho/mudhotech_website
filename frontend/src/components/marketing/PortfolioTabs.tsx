"use client";

import { useMemo, useState } from "react";
import { SkeletonImage } from "@/components/marketing/SkeletonImage";
import { galleryImages } from "@/data/services";

const galleryCategories = ["All", ...Array.from(new Set(galleryImages.map((g) => g.category)))];

/**
 * Gallery only, for now.
 *
 * This component also had Projects and Repairs tabs. Every entry in both was
 * invented: named systems with specific claimed outcomes ("Doubled online
 * order volume within one quarter") and repair case studies with turnaround
 * times. Those are the kind of claims a procurement panel checks, so they
 * cannot go on a live domain before they are true.
 *
 * portfolioProjects and repairShowcases are still in src/data/portfolio.ts.
 * Restore the Tabs wrapper and those two panels once the entries describe
 * real work. See docs/OPEN-QUESTIONS.md #4.
 */
function FilterChips({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={active === option}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === option
              ? "bg-accent text-accent-foreground"
              : "border border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-accent"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function PortfolioTabs() {
  const [galleryCategory, setGalleryCategory] = useState("All");

  const filteredGallery = useMemo(
    () => galleryImages.filter((g) => galleryCategory === "All" || g.category === galleryCategory),
    [galleryCategory],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <FilterChips options={galleryCategories} active={galleryCategory} onChange={setGalleryCategory} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGallery.map((image) => (
          <SkeletonImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            wrapperClassName="rounded-xl border border-border h-56"
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}
