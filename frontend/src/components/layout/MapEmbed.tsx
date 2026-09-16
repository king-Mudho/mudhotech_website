"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapEmbedProps {
  query: string;
  label: string;
  /** Direct link, used both by the placeholder and as the always-available fallback. */
  directUrl: string;
}

/**
 * Click-to-load Google Maps embed.
 *
 * The iframe used to render unconditionally. That contradicted the site's
 * own cookie banner — which tells the visitor that declining means no
 * third-party script reaches their browser — because Google's embed loads
 * and sets cookies for everyone who opens /contact, consent or not. It is
 * also the single heaviest thing on the page by an order of magnitude, for
 * a feature most visitors never use.
 *
 * The address, the "open in Maps" link, and the office card above are all
 * still there without loading anything, so nothing is lost by waiting for
 * an actual request.
 */
export function MapEmbed({ query, label, directUrl }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={label}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="h-96 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden bg-secondary/60 px-4 text-center">
      {/* Same fine grid as the hero backdrop — reads as a map without being one. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative">
        <span className="mx-auto mb-4 flex w-fit rounded-xl bg-accent/10 p-3">
          <MapPin className="h-6 w-6 text-accent" aria-hidden="true" />
        </span>
        <p className="font-heading font-semibold">{query}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          The map is loaded from Google, which sets its own cookies. It stays off until you ask for it.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="accent" size="sm" onClick={() => setLoaded(true)}>
            Load the map
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={directUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
