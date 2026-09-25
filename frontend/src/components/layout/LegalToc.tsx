"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Reads the h2s inside `contentId`, gives each an id, and lists them. The
 * legal pages are hand-written JSX rather than data, so the headings are
 * collected from the DOM instead of being declared twice.
 */
export function LegalToc({ contentId }: { contentId: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(contentId);
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll("h2"));
    nodes.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent ?? "");
    });
    setHeadings(nodes.map((h) => ({ id: h.id, text: h.textContent ?? "" })));

    // Highlight the section whose heading most recently passed under the navbar.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -60% 0px" },
    );
    nodes.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [contentId]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ol className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={cn(
                "block rounded-md border-l-2 px-3 py-1 transition-colors",
                active === h.id
                  ? "border-accent bg-accent/10 font-medium text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
