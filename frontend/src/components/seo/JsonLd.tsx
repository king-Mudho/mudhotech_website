import { company } from "@/data/company";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: company.shortName,
    url: siteUrl,
    description: company.about,
    email: company.contact.email,
    telephone: company.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Shepperton, Graniteside",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    slogan: company.tagline,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    image: `${siteUrl}/images/hero-bg.jpg`,
    url: siteUrl,
    telephone: company.contact.phone,
    email: company.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 Shepperton, Graniteside",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: { "@type": "Country", name: "Zimbabwe" },
    knowsAbout: company.targetMarkets,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
