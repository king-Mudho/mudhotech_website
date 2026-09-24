import type { ReactNode } from "react";

/**
 * Minimal markdown renderer for the subset used in blogPosts.ts content
 * arrays: `## ` headings and `**bold:**` lead-ins. Deliberately not a full
 * markdown library — the content is authored in-repo as typed data, so the
 * input set is closed and known (docs/07-content-data-model.md §8).
 */
function renderInlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

/** Anchor id for a `## ` heading, shared by the headings and the contents list. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function headingsOf(content: string[]): { id: string; text: string }[] {
  return content.filter((b) => b.startsWith("## ")).map((b) => ({ id: headingId(b.slice(3)), text: b.slice(3) }));
}

export function BlogContent({ content }: { content: string[] }) {
  return (
    <div className="prose-custom max-w-none">
      {content.map((block, i) =>
        block.startsWith("## ") ? (
          // scroll-mt clears the fixed navbar when jumping from the contents list.
          <h2 key={i} id={headingId(block.slice(3))} className="scroll-mt-28">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i}>{renderInlineBold(block)}</p>
        ),
      )}
    </div>
  );
}
