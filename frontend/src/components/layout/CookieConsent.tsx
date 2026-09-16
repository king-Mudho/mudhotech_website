"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COOKIE_CONSENT_MAX_AGE, COOKIE_CONSENT_NAME, type CookieConsentValue } from "@/lib/cookie-consent";

function setConsentCookie(value: CookieConsentValue) {
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function CookieConsent() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie.includes(`${COOKIE_CONSENT_NAME}=`);
    if (!hasConsent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const respond = (value: CookieConsentValue) => {
    setConsentCookie(value);
    setVisible(false);
    // router.refresh() re-runs the Server Components — including <Analytics>,
    // which re-reads the cookie and decides whether to emit the GA4 tag — with
    // no full navigation. The previous window.location.reload() threw away
    // scroll position, any open accordion, and a half-filled form, which is a
    // harsh penalty for answering a banner.
    router.refresh();
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[55] animate-in slide-in-from-bottom p-4 duration-500"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-2xl md:flex-row md:items-center md:p-6">
          <span className="hidden shrink-0 rounded-xl bg-accent/10 p-2.5 sm:block">
            <Cookie className="h-5 w-5 text-accent" aria-hidden="true" />
          </span>

          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-foreground">We use cookies</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We use cookies to enhance your browsing experience, analyse site traffic, and personalise content.
              Declining means no analytics script is ever sent to your browser. Read our{" "}
              <Link href="/privacy-policy" className="text-accent underline underline-offset-2 hover:text-accent/80">
                Privacy Policy
              </Link>{" "}
              for more information.
            </p>
          </div>

          {/* Both choices are equally weighted and equally sized. A styled
              "Accept" next to a ghost "Decline" nudges the answer, which is
              exactly what consent rules exist to prevent. */}
          <div className="flex w-full shrink-0 gap-2 md:w-auto">
            <Button variant="outline" size="sm" onClick={() => respond("declined")} className="flex-1 md:flex-none">
              Decline
            </Button>
            <Button variant="accent" size="sm" onClick={() => respond("accepted")} className="flex-1 md:flex-none">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
