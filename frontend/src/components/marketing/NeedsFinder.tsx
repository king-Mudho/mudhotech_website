import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Cpu, Wifi, Globe, FileSpreadsheet, Smartphone, ShieldAlert, MessageCircle } from "lucide-react";
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
const needs: { icon: LucideIcon; problem: string; service: string; body: string; href: string }[] = [
  {
    icon: Cpu,
    problem: "My computer is slow, crashing, or won't start",
    service: "Laptop & Desktop Repairs",
    body: "Free diagnostics first, then a clear quote before any repair work begins.",
    href: "/it-support",
  },
  {
    icon: Wifi,
    problem: "Our office Wi-Fi or network keeps dropping",
    service: "Networking & Connectivity",
    body: "Network setup, troubleshooting, and coverage fixes for homes and offices.",
    href: "/it-support",
  },
  {
    icon: ShieldAlert,
    problem: "Viruses, updates, or software setup headaches",
    service: "Security & Maintenance",
    body: "Antivirus, updates, and installations handled properly, so they stay handled.",
    href: "/it-support",
  },
  {
    icon: Globe,
    problem: "We need a website or an online store",
    service: "Custom Web Systems & E-Commerce",
    body: "Fast, mobile-friendly sites and stores with local payment integration.",
    href: "/web-software",
  },
  {
    icon: FileSpreadsheet,
    problem: "We still run on paper and spreadsheets",
    service: "Custom Web Systems",
    body: "Systems built around how your business actually works — records, stock, bookings, reports.",
    href: "/web-software",
  },
  {
    icon: Smartphone,
    problem: "We want customers to reach us on their phones",
    service: "Mobile App Development",
    body: "Mobile apps that put your services in your customers' pockets.",
    href: "/web-software",
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

        <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map(({ icon: Icon, problem, service, body, href }) => (
            <li
              key={problem}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent">
                <Icon className="h-5 w-5 text-accent group-hover:text-accent-foreground" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
                &ldquo;{problem}&rdquo;
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-accent">{service}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-semibold">
                <Link href={href} className="inline-flex items-center gap-1.5 text-accent hover:underline">
                  How we fix it
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={whatsappUrl(`Hello MudhoTech, I need help: ${problem.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
