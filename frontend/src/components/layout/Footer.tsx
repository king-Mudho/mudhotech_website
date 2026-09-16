import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Lock } from "lucide-react";
import { company } from "@/data/company";
import { telHref, mailtoHref, whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Get a Quote", path: "/quote" },
];

const services = [
  { name: "Web Development", path: "/web-software" },
  { name: "Mobile Apps", path: "/web-software" },
  { name: "Cloud Solutions", path: "/web-software" },
  { name: "IT Support", path: "/it-support" },
  { name: "Hardware Repairs", path: "/it-support" },
  { name: "Network Setup", path: "/it-support" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Image
              src="/images/mudhotech-logo.png"
              alt="MudhoTech Solutions"
              width={271}
              height={247}
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-background/70 text-sm leading-relaxed">
              {company.tagline} A Zimbabwean registered ICT company empowering businesses through smart technology.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-base mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path + link.name}>
                  <Link href={link.path} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-base mb-4">Services</h2>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.name}>
                  <Link href={s.path} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-base mb-4">Contact</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <div>
                  <a href={telHref()} className="block py-1.5 transition-colors hover:text-accent">
                    {company.contact.phone}
                  </a>
                  <a
                    href={whatsappUrl(WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1.5 transition-colors hover:text-accent"
                  >
                    {company.contact.whatsapp} (WhatsApp)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a href={mailtoHref()} className="transition-colors hover:text-accent">
                  {company.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>{company.registeredOffice}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <p>&copy; {new Date().getFullYear()} MudhoTech Solutions (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="opacity-30 hover:opacity-60 transition-opacity inline-flex items-center gap-1"
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
