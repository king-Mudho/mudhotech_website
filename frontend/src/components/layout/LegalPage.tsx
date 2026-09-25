import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { LegalToc } from "@/components/layout/LegalToc";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Shared body for the legal pages: a dated document with an "On this page"
 * list beside it. The list is built from the document's own h2s, so a new
 * section appears in it without being registered anywhere.
 */
export function LegalPage({
  /** Date the wording last changed (ISO). Update it whenever the text does. */
  updated,
  children,
}: {
  updated: string;
  children: ReactNode;
}) {
  return (
    <Section>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[14rem_1fr]">
        {/* Desktop only: on a phone a 14-item list would push the text a screen down. */}
        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <LegalToc contentId="legal-content" />
        </aside>

        <div>
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>

          <div id="legal-content" className="prose-custom max-w-none [&_h2]:scroll-mt-28">
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}
