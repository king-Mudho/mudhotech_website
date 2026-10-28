import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  HeartHandshake,
  GraduationCap,
  Stethoscope,
  Store,
  Banknote,
  Factory,
  Wheat,
  Pickaxe,
  Briefcase,
  Building2,
} from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { company } from "@/data/company";

/**
 * Sector names come from `company.targetMarkets` — the same list the
 * capability statement and JSON-LD use. Only the icons live here; a market
 * added to the data without an icon still renders, with a neutral one.
 */
const icons: Record<string, LucideIcon> = {
  Government: Landmark,
  NGOs: HeartHandshake,
  Education: GraduationCap,
  Healthcare: Stethoscope,
  Retail: Store,
  Finance: Banknote,
  Manufacturing: Factory,
  Agriculture: Wheat,
  Mining: Pickaxe,
  SMEs: Briefcase,
};

export function IndustriesServed() {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="reveal">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Built for Zimbabwean Organizations"
            lead="From a single-branch shop to a government department — systems and support sized to how you actually operate."
          />
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {company.targetMarkets.map((market) => {
            const Icon = icons[market] ?? Building2;
            return (
              <li key={market} className="card-interactive reveal group flex items-center gap-3 p-4">
                <span className="icon-tile h-10 w-10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-semibold text-foreground">{market}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
