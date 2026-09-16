"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

/**
 * The two floating buttons, stacked in one column.
 *
 * They used to be independent fixed elements positioned `right-6` and
 * `right-20`. On a 375px phone that put a 44px target flush against a 56px
 * one with a 0px gap — two different destinations, one of them WhatsApp,
 * separated by nothing. Stacking them vertically in a single container also
 * means there is one place that decides where they sit, so they can lift
 * together above the cookie banner and stay off the admin screens.
 *
 * Hidden on /admin: the lead dashboard is an internal tool, and a customer
 * "Chat on WhatsApp" CTA floating over it is noise at best and a misclick
 * at worst.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        // aria-hidden + inert while invisible so it never becomes an
        // unreachable tab stop for keyboard users.
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all duration-300",
          "hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <a
        href={whatsappUrl(WHATSAPP_GREETING)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg shadow-whatsapp/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
