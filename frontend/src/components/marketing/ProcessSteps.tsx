import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { cn } from "@/lib/utils";
import { engagementPhases, type ProcessPhase } from "@/data/processes";

interface ProcessStepsProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  phases?: ProcessPhase[];
  link?: { href: string; label: string } | null;
}

const gridCols: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function ProcessSteps({
  eyebrow = "Our Process",
  title = "From First Call to Ongoing Support",
  lead = "No surprises: you know what is being built, what it costs, and who looks after it — before we start.",
  phases = engagementPhases,
  link = { href: "/about#engagement-model", label: "See the full engagement model" },
}: ProcessStepsProps) {
  // The connector runs between the first and last marker centres.
  const inset = `${50 / phases.length}%`;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="reveal">
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Connector line behind the numbered markers on wide screens. */}
          <div
            aria-hidden="true"
            style={{ left: inset, right: inset }}
            className="absolute top-6 hidden h-px bg-gradient-to-r from-accent/10 via-accent/40 to-accent/10 lg:block"
          />
          <ol className={cn("grid gap-8 md:grid-cols-2", gridCols[phases.length] ?? "lg:grid-cols-4")}>
            {phases.map((phase, i) => (
              <li key={phase.title} className="reveal relative flex flex-col items-center text-center">
                <span className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-accent-foreground shadow-lg shadow-accent/25 ring-8 ring-background">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{phase.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{phase.body}</p>
                {/* Full-strength accent: at 80% opacity this was 4.0:1, under AA. */}
                {phase.footnote && <p className="mt-auto text-xs font-medium text-accent">{phase.footnote}</p>}
              </li>
            ))}
          </ol>
        </div>

        {link && (
          <div className="mt-10 text-center">
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:underline"
            >
              {link.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
