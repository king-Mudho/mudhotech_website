// TODO(content): every entry in this file is placeholder material and must be
// replaced with real, verifiable project and repair case studies before the
// site is presented to procurement/investor audiences.
// See docs/OPEN-QUESTIONS.md #4 and docs/07-content-data-model.md §9.

export interface PortfolioProject {
  title: string;
  category: string;
  summary: string;
  tech: string[];
  result: string;
}

export interface RepairShowcase {
  title: string;
  problem: string;
  work: string;
  result: string;
  turnaround: string;
  tags: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "School Management System",
    category: "Education",
    summary: "Student records, attendance, grading, and fee tracking in one platform with mobile money integration.",
    tech: ["React", "Node.js", "PostgreSQL", "EcoCash API"],
    result: "Cut termly report preparation from days to minutes",
  },
  {
    title: "E-Commerce Platform",
    category: "Retail",
    summary: "Online storefront with inventory sync, order management, and local payment gateway integration.",
    tech: ["Next.js", "Stripe", "ZimSwitch", "PostgreSQL"],
    result: "Doubled online order volume within one quarter",
  },
  {
    title: "Fleet Management Dashboard",
    category: "Logistics",
    summary: "Real-time vehicle tracking, maintenance scheduling, and driver performance reporting.",
    tech: ["React", "GPS API", "Recharts", "Node.js"],
    result: "Reduced unscheduled downtime through preventive alerts",
  },
  {
    title: "Corporate Website & Intranet",
    category: "Corporate",
    summary: "Public marketing site plus an internal document portal with role-based access.",
    tech: ["Next.js", "Tailwind CSS", "Django", "PostgreSQL"],
    result: "Consolidated three separate systems into one",
  },
  {
    title: "Clinic Booking System",
    category: "Healthcare",
    summary: "Appointment scheduling, patient records, and automated SMS reminders.",
    tech: ["React", "Django REST", "SMS Gateway"],
    result: "Significant drop in missed appointments",
  },
  {
    title: "Inventory & POS System",
    category: "Retail",
    summary: "Point-of-sale terminal with live stock levels, supplier tracking, and daily reconciliation.",
    tech: ["Electron", "SQLite", "Node.js"],
    result: "Eliminated end-of-day manual stock counts",
  },
];

export const repairShowcases: RepairShowcase[] = [
  {
    title: "Laptop Overheating & Shutdown",
    problem: "Machine shutting down under load; fan audibly struggling; heavy dust build-up.",
    work: "Full internal clean, heat sink service, thermal paste replacement, fan lubrication.",
    result: "Operating temperatures back within normal range; no further shutdowns.",
    turnaround: "Same day",
    tags: ["Cleaning", "Thermal", "Laptop"],
  },
  {
    title: "Cracked Laptop Screen Replacement",
    problem: "Display physically cracked after a drop; touch input intermittently unresponsive.",
    work: "Sourced and fitted a matching IPS panel; verified hinge alignment and cable seating.",
    result: "Full display and input function restored.",
    turnaround: "48 hours",
    tags: ["Screen", "Repair", "Laptop"],
  },
  {
    title: "Office Network Rebuild",
    problem: "Frequent dropouts across a 12-workstation office; unmanaged cabling.",
    work: "Re-cabled to structured Ethernet, replaced router, configured segmented Wi-Fi.",
    result: "Stable connectivity across all workstations.",
    turnaround: "3 days",
    tags: ["Networking", "Office", "Cabling"],
  },
  {
    title: "Failing Hard Drive Data Migration",
    problem: "Drive reporting SMART errors; boot times degrading; user data at risk.",
    work: "Imaged the failing drive, migrated to NVMe SSD, verified data integrity.",
    result: "No data loss; substantially faster boot and load times.",
    turnaround: "24 hours",
    tags: ["Data Recovery", "SSD", "Upgrade"],
  },
];
