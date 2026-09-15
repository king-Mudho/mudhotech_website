"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COOKIE_CONSENT_MAX_AGE, COOKIE_CONSENT_NAME, type CookieConsentValue } from "@/lib/cookie-consent";

function setConsentCookie(value: CookieConsentValue) {
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function CookieConsent() {
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
    // Reload so the root layout re-reads the cookie server-side and
    // decides whether to render the GA4 script (docs/13-deployment-launch.md §2).
    window.location.reload();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium mb-1">We use cookies</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. By
              clicking &ldquo;Accept&rdquo;, you consent to our use of cookies. Read our{" "}
              <Link href="/privacy-policy" className="text-accent underline underline-offset-2 hover:text-accent/80">
                Privacy Policy
              </Link>{" "}
              for more information.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => respond("declined")} className="text-xs">
              Decline
            </Button>
            <Button variant="accent" size="sm" onClick={() => respond("accepted")} className="text-xs">
              Accept All
            </Button>
            <button
              onClick={() => respond("declined")}
              className="text-muted-foreground hover:text-foreground transition-colors ml-1 md:hidden"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
