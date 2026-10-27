/**
 * Work shown on /portfolio.
 *
 * This file used to hold invented projects with invented results ("Doubled
 * online order volume within one quarter") and invented repair case studies.
 * They were hidden, but one edit away from publication. It now has two lists:
 *
 * - `caseStudies`: real, completed MudhoTech work. Empty until the owner adds
 *   some. An entry is only rendered once `permissionConfirmed` is true.
 * - `exampleProjects`: the kinds of work the business takes on, written from
 *   the service list in data/services.ts. Always labelled on the page as
 *   illustrative, never as client work, and with no outcomes or figures.
 *
 * How to add a case study: docs/CONTENT-GUIDE.md → "Portfolio".
 */

export interface CaseStudy {
  /** URL-safe id, e.g. "harare-retailer-stock-system". */
  slug: string;
  title: string;
  /**
   * The client's name only with their written permission. Otherwise describe
   * them instead, e.g. "A multi-branch retailer in Harare".
   */
  client: string;
  sector: string;
  path: "build" | "support";
  challenge: string;
  solution: string;
  /** Only an outcome the client has confirmed. Leave it out rather than estimate. */
  outcome?: string;
  /** Screenshots or photos in public/images/work/, taken by MudhoTech or supplied by the client. */
  images?: { src: string; alt: string }[];
  year?: number;
  /** Must be true before the entry appears: the client agreed to be featured as written. */
  permissionConfirmed: boolean;
}

export const caseStudies: CaseStudy[] = [];

export const publishedCaseStudies = caseStudies.filter((study) => study.permissionConfirmed);

export interface ExampleProject {
  title: string;
  path: "build" | "support";
  /** Where the matching service is described. */
  href: string;
  problem: string;
  /** What this kind of job usually involves, taken from that service's own list. */
  involves: string[];
}

export const exampleProjects: ExampleProject[] = [
  {
    title: "Stock and sales system for a shop with more than one branch",
    path: "build",
    href: "/web-software",
    problem: "Stock is counted on paper or in separate spreadsheets, so branches disagree about what is available.",
    involves: ["Inventory management", "Point of sale and business automation", "Training and handover to staff"],
  },
  {
    title: "Online store that takes EcoCash",
    path: "build",
    href: "/web-software",
    problem: "A retailer selling in person wants customers to order and pay from their phones.",
    involves: [
      "Secure online store",
      "Payment integration through the business's own merchant account",
      "Order and inventory management in one place",
    ],
  },
  {
    title: "Booking system for a service business",
    path: "build",
    href: "/web-software",
    problem: "Appointments are taken by phone and written in a diary, so double bookings happen.",
    involves: ["Booking and reservation system", "Mobile-friendly customer pages", "Documentation and training"],
  },
  {
    title: "Office Wi-Fi that reaches every room",
    path: "support",
    href: "/it-support#networks",
    problem: "Connections drop in some offices and slow to a crawl when everyone is online.",
    involves: [
      "Survey of where the signal drops",
      "Router and access point configuration",
      "Labelled, documented cabling",
    ],
  },
  {
    title: "Laptop that stopped charging after a fall",
    path: "support",
    href: "/it-support#repairs",
    problem: "The machine no longer charges and the owner needs the files on it.",
    involves: [
      "Diagnosis and a quote before any work",
      "Charging port (DC jack) repair",
      "Data backed up before anything is changed",
    ],
  },
];
