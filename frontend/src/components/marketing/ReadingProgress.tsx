"use client";

import { useEffect, useState } from "react";

/**
 * Thin bar across the top of an article showing how far through it the
 * reader is. Tracks the element with the given id rather than the whole
 * page, so the footer and related posts don't count as unread article.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const read = total > 0 ? -rect.top / total : rect.top < 0 ? 1 : 0;
      setProgress(Math.min(1, Math.max(0, read)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
