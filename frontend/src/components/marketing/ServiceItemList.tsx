"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItemListProps {
  items: string[];
  /** How many to show before the rest go behind the disclosure. */
  collapsedCount?: number;
}

/**
 * The only interactive part of a service card, split out so ServiceCard
 * itself can stay a Server Component.
 *
 * That split is load-bearing, not tidiness: /it-support renders ServiceCard
 * directly from a server page and passes `icon` as a Lucide component.
 * Marking ServiceCard "use client" made that prop cross the server/client
 * boundary, which fails at runtime with "Only plain objects can be passed to
 * Client Components". This component receives nothing but strings.
 */
export function ServiceItemList({ items, collapsedCount = 5 }: ServiceItemListProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  const hidden = Math.max(0, items.length - collapsedCount);
  // Rendered in full when expanded rather than truncated away: the card used
  // to summarise the overflow as "+5 more included", which told a visitor
  // looking for one specific job that it might be covered without ever
  // letting them check.
  const shown = expanded ? items : items.slice(0, collapsedCount);

  return (
    <>
      <ul id={listId} className="space-y-2">
        {shown.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/75">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-3 inline-flex w-fit items-center gap-1 rounded text-sm font-medium text-accent transition-colors hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {expanded ? "Show less" : `Show ${hidden} more`}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </>
  );
}
