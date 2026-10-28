import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Cpu, Wifi, Globe, FileSpreadsheet, Smartphone, ShieldAlert } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Problem-led entry point: visitors arrive with a problem, not a service
 * name. Each card names the problem in their words, says which existing
 * service answers it, and offers two next steps — the service page, or a
 * WhatsApp chat pre-filled with that problem. Every `service` here is the
 * title of a service already listed in `data/services.ts`, so this section
 * makes no claim the service pages don't.
 */
const needs: { icon: LucideIcon; problem: string; service: string; href: string }[] = [
  {
    icon: Cpu,
    problem: "My computer is slow, crashing, or won't start",
    service: "Laptop & Desktop Repairs",
    href: "/it-support#repairs",
  },
  {
    icon: Wifi,
    problem: "Our office Wi-Fi or network keeps dropping",
    service: "Networking & Connectivity",
    href: "/it-support#networks",
  },
  {
    icon: ShieldAlert,
    problem: "Viruses, updates, or software setup headaches",
    service: "Security & Maintenance",
    href: "/it-support#software",
  },
  {
    icon: Globe,
    problem: "We need a website or an online store",
    service: "Websites & E-Commerce",
    href: "/web-software#services",
  },
  {
    icon: FileSpreadsheet,
    problem: "We still run on paper and spreadsheets",
    service: "Websites & Custom Web Systems",
    href: "/web-software#services",
  },
  {
    icon: Smartphone,
    problem: "We want customers to reach us on their phones",
    service: "Mobile App Development",
    href: "/web-software#services",
  },
];

export function NeedsFinder() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Start Here"
          title="What Do You Need Help With?"
          lead="Pick the one that sounds like you. We'll tell you honestly what it takes to fix — free, no obligation."
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map(({ icon: Icon, problem, service, href }) => (
            <li key={problem} className="card-interactive reveal group flex flex-col p-5 md:p-6">
              <span className="icon-tile mb-4">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
                &ldquo;{problem}&rdquo;
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent">{service}</p>

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-sm font-semibold">
                <Link href={href} className="inline-flex items-center gap-1.5 text-accent hover:underline">
                  How we fix it<span className="sr-only"> for {service}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={whatsappUrl(`Hello MudhoTech, I need help: ${problem.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-whatsapp hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  Ask on WhatsApp<span className="sr-only"> (opens WhatsApp)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
