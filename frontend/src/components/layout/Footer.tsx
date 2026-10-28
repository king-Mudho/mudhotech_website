import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Lock } from "lucide-react";
import { company } from "@/data/company";
import { telHref, mailtoHref, whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Work", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Get a Quote", path: "/quote" },
];

const services = [
  { name: "Websites & Web Systems", path: "/web-software#services" },
  { name: "Online Stores", path: "/web-software#services" },
  { name: "Mobile Apps", path: "/web-software#services" },
  { name: "Computer Repairs", path: "/it-support#repairs" },
  { name: "Networks & Wi-Fi", path: "/it-support#networks" },
  { name: "Software Setup", path: "/it-support#software" },
];

export function Footer() {
  return (
    // bg-band, not bg-foreground: foreground turns light grey in dark mode,
    // which hid the white logo and took the small print to 3.4:1.
    <footer className="bg-band text-band-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/images/mudhotech-logo.png"
              alt="MudhoTech Solutions"
              width={271}
              height={247}
              className="mb-4 h-16 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-band-foreground/70">
              {company.tagline} A Zimbabwean registered ICT company empowering businesses through smart technology.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-heading text-base font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path + link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-band-foreground/70 transition-colors hover:text-hero-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-heading text-base font-semibold">Services</h2>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.path}
                    className="text-sm text-band-foreground/70 transition-colors hover:text-hero-accent"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-heading text-base font-semibold">Contact</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-band-foreground/70">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-hero-accent" />
                <div>
                  <a href={telHref()} className="block py-1.5 transition-colors hover:text-hero-accent">
                    {company.contact.phone}
                  </a>
                  <a
                    href={whatsappUrl(WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1.5 transition-colors hover:text-hero-accent"
                  >
                    {company.contact.whatsapp} (WhatsApp)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-band-foreground/70">
                <Mail className="h-4 w-4 shrink-0 text-hero-accent" />
                <a href={mailtoHref()} className="transition-colors hover:text-hero-accent">
                  {company.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-band-foreground/70">
                <MapPin className="h-4 w-4 shrink-0 text-hero-accent" />
                <span>{company.registeredOffice}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-band-foreground/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-band-foreground/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} MudhoTech Solutions (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-hero-accent">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-hero-accent">
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 opacity-30 transition-opacity hover:opacity-60"
              title="Admin"
            >
              <Lock className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
