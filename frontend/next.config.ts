import type { NextConfig } from "next";

// Allows: Google Fonts (next/font self-hosts but keeps the domain), GA4,
// and the embedded Google Maps iframe on /contact. 'unsafe-inline' and
// 'unsafe-eval' on script-src are required by Next.js's runtime and the
// GA4 tag; tightening these needs a nonce-based setup (deferred).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Every non-default `quality` used in the markup has to be declared here
    // from Next 16 on; undeclared values warn today and will throw later.
    qualities: [60, 65, 75],
    // TODO(content): placeholder gallery photography is hosted on Unsplash —
    // remove this once real/licensed images land. See docs/OPEN-QUESTIONS.md #4.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
