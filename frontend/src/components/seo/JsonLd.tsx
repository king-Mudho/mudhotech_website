import { company } from "@/data/company";
import { faq, type FaqItem } from "@/data/faq";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "8 Shepperton, Graniteside",
  addressLocality: "Harare",
  addressCountry: "ZW",
};

/** One place that serialises a graph node, so every block escapes identically. */
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: company.name,
        alternateName: company.shortName,
        url: siteUrl,
        logo: `${siteUrl}/images/mudhotech-logo.png`,
        description: company.about,
        email: company.contact.email,
        telephone: company.contact.phone,
        address: postalAddress,
        slogan: company.tagline,
      }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#localbusiness`,
        name: company.name,
        image: `${siteUrl}/images/hero-bg.jpg`,
        url: siteUrl,
        telephone: company.contact.phone,
        email: company.contact.email,
        address: postalAddress,
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
      }}
    />
  );
}

/**
 * Enables the sitelinks search box and ties every page back to one named
 * site entity rather than a collection of unrelated URLs.
 */
export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: company.shortName,
        description: company.about,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-ZW",
      }}
    />
  );
}

/**
 * Renders the FAQ block as a FAQPage so the questions are eligible for
 * rich results. Generated from the same `faq` data module the accordion
 * renders, so the two can never disagree — a mismatch between the markup
 * and the visible answers is a manual-action risk, not just untidy.
 */
export function FaqJsonLd({ items = faq }: { items?: FaqItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. "/blog". Omit for the current page. */
  path?: string;
}

export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          ...(crumb.path ? { item: `${siteUrl}${crumb.path}` } : {}),
        })),
      }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  slug: string;
}

export function ArticleJsonLd({ title, description, image, datePublished, slug }: ArticleJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image: image.startsWith("http") ? image : `${siteUrl}${image}`,
        datePublished,
        dateModified: datePublished,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
        author: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-ZW",
      }}
    />
  );
}

interface ServiceJsonLdProps {
  name: string;
  description: string;
  path: string;
}

export function ServiceJsonLd({ name, description, path }: ServiceJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: `${siteUrl}${path}`,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "Zimbabwe" },
        serviceType: name,
      }}
    />
  );
}
