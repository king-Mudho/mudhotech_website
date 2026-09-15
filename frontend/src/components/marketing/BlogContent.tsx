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
      <strong key={i} className="text-foreground font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

export function BlogContent({ content }: { content: string[] }) {
  return (
    <div className="prose-custom max-w-none">
      {content.map((block, i) =>
        block.startsWith("## ") ? (
          <h2 key={i}>{block.slice(3)}</h2>
        ) : (
          <p key={i}>{renderInlineBold(block)}</p>
        ),
      )}
    </div>
  );
}
