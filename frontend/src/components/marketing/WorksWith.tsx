import { devServices } from "@/data/services";

/**
 * Named payment rails and business software, read from the development
 * services' own `worksWith` lists — so this strip never claims a platform the
 * service pages don't. Generic entries ("Mobile money") are dropped because a
 * brand-name strip is only useful when every chip is a name.
 */
const tools = Array.from(new Set(devServices.flatMap((s) => s.worksWith ?? []).filter((t) => t !== "Mobile money")));

export function WorksWith() {
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="container mx-auto flex flex-col items-center gap-5 px-4 lg:flex-row lg:justify-center lg:gap-10">
        <p className="shrink-0 text-center font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Integrates with the platforms you use
        </p>
        <ul className="flex flex-wrap justify-center gap-2.5">
          {tools.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-border bg-card px-4 py-1.5 font-heading text-sm font-semibold text-foreground/80"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
