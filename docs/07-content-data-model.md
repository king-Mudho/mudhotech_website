# 07 — Content & Data Model

The website's content is authored once, as typed TypeScript data, and rendered everywhere it's needed (web pages, PDF export, JSON-LD). This doc defines each data module and where its content comes from.

## 1. `src/data/company.ts`
```ts
export const company = {
  name: "MudhoTech Solutions (Private) Limited",
  shortName: "MudhoTech Solutions",
  tagline: "Innovative Digital Solutions. Reliable IT Support. Simplified.",
  secondaryLine: "We Keep Your Systems Running — Fast, Secure, and Smooth.",
  motto: "Innovation • Integrity • Excellence",
  about:
    "MudhoTech Solutions is a Zimbabwean registered ICT company providing full-stack software development, digital transformation, and IT support services.",
  businessType: "Information & Communication Technology (ICT) Company",
  registeredOffice: "8 Shepperton, Graniteside, Harare, Zimbabwe",
  registrationNumber: "", // TODO(content): confirm before launch
  vatNumber: "", // TODO(content): confirm before launch
  contact: {
    phone: "+263 77 539 8749",
    whatsapp: "+263 71 270 0941",
    email: "mudhotechsolutions@gmail.com",
    website: "https://www.mudhotech.co.zw", // TODO(content): confirm canonical domain
  },
  hours: {
    weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
    saturday: "Saturday: By Appointment",
    sunday: "Sunday & Public Holidays: Closed",
  },
  targetMarkets: [
    "Government", "NGOs", "Education", "Healthcare", "Retail",
    "Finance", "Manufacturing", "Agriculture", "Mining", "SMEs",
  ],
  values: [
    "Listen before recommending solutions",
    "Understand your business objectives",
    "Deliver practical and sustainable technology",
    "Maintain transparency throughout the project",
    "Respect confidentiality",
    "Provide dependable post-project support",
    "Continuously improve our services",
  ],
  closingStatement:
    "Together, we create technology solutions that empower organizations to succeed today and prepare for tomorrow.",
};
```

## 2. `src/data/services.ts`
Ported directly from the existing service catalogue structure:
- `softwareServices` — 5 categories (Core Software Installation & Setup, Security & Maintenance, Academic & Productivity Tools, Design & Creative Tools, Digital Support & Troubleshooting)
- `devServices` — 4 categories (Custom Web Systems, E-Commerce Solutions, Mobile App Development, Software Installation & Maintenance)
- `hardwareServices` — 6 categories (Hardware Installation & Upgrades, Laptop & Desktop Repairs, Cleaning & Preventive Maintenance, Networking & Connectivity, Peripheral & Device Setup, Advanced Hardware Support)
- `galleryImages` — device photos tagged by category

Each entry: `{ icon: LucideIcon, title: string, description: string, items: string[] }`

## 3. `src/data/engagementModel.ts`
```ts
export const engagementSteps = [
  { step: 1, title: "Initial Consultation", points: ["Understand the client's business", "Identify business challenges", "Define objectives"] },
  { step: 2, title: "Needs Assessment", points: ["Review existing systems", "Gather requirements", "Assess technical and operational needs"] },
  { step: 3, title: "Solution Design", points: ["Recommend suitable technologies", "Prepare technical architecture", "Define implementation approach"] },
  { step: 4, title: "Proposal & Planning", points: ["Scope of work", "Project timeline", "Cost estimate", "Deliverables"] },
  { step: 5, title: "Implementation", points: ["Development", "Configuration", "Testing", "Deployment"] },
  { step: 6, title: "Training & Handover", points: ["User training", "Documentation", "Knowledge transfer"] },
  { step: 7, title: "Support & Continuous Improvement", points: ["Technical support", "System maintenance", "Performance monitoring", "Enhancement planning"] },
];
```

## 4. `src/data/serviceCommitments.ts`
```ts
export const serviceCommitments = [
  "Professional communication", "Transparent project management", "Timely delivery",
  "Quality workmanship", "Secure and reliable solutions", "Continuous improvement",
  "Responsive support",
];
export const supportChannels = [
  "Remote assistance", "Scheduled maintenance", "Software updates",
  "Troubleshooting", "User guidance", "System performance reviews",
];
```

## 5. `src/data/faq.ts`
Sourced FAQ content, e.g.:
```ts
export const faq = [
  { q: "What services do you offer?", a: "Software development, website development, mobile applications, cloud solutions, ICT consultancy, managed IT services, cybersecurity guidance, and digital transformation support." },
  { q: "Do you develop custom software?", a: "Yes — software is designed around each client's operational requirements." },
  { q: "Can you modernize existing systems?", a: "Yes — we assess current systems and recommend upgrades, integrations, or redevelopment where appropriate." },
  { q: "Do you provide support after deployment?", a: "Yes — ongoing maintenance, updates, troubleshooting, and user support." },
  { q: "Which sectors do you serve?", a: "Government institutions, NGOs, educational institutions, healthcare providers, financial services, retailers, manufacturers, agricultural businesses, mining companies, and SMEs." },
];
```

## 6. `src/data/partnerships.ts`
```ts
export const potentialPartners = [
  "Technology vendors", "Cloud service providers", "Educational institutions",
  "Government agencies", "NGOs", "Business associations",
  "Software companies", "Telecommunications providers",
];
export const collaborationAreas = [
  "Joint solution development", "Technology implementation", "Skills development",
  "Digital transformation initiatives", "Research and innovation", "Community technology projects",
];
```

## 7. `src/data/roadmap.ts`
```ts
export const roadmap = [
  { phase: "Phase 1 — Foundation", points: ["Build a strong client base", "Deliver high-quality ICT solutions", "Strengthen internal processes", "Enhance customer satisfaction"] },
  { phase: "Phase 2 — Expansion", points: ["Introduce additional managed services", "Expand cloud capabilities", "Develop industry-specific software", "Build strategic partnerships"] },
  { phase: "Phase 3 — Regional Growth", points: ["Expand into Southern Africa", "Strengthen enterprise offerings", "Increase investment in innovation", "Explore regional collaboration opportunities"] },
];
```

## 8. `src/data/blogPosts.ts`
```ts
export interface BlogPost {
  slug: string; title: string; excerpt: string; date: string;
  category: string; image: string; readTime: string; content: string[];
}
```
Ported starter posts: *5 Signs Your Business Needs Digital Transformation*, *How to Protect Your Business from Cyber Threats*, *Benefits of Cloud Computing for Small Businesses*, *Why Every School Needs a Management System*.

## 9. Placeholder Content Rule
Team members, testimonials, partner logos, portfolio projects, and repair showcases are **not yet real** — they must be built as structurally complete but clearly marked in code as placeholders (`// TODO(content): replace with real data`), and replaced before the site is presented as live to procurement/investor audiences.

## 10. Single Source of Truth Principle
This data layer is the **only** place this content is authored. The Capability Statement page (M9), the PDF export, the letterhead (M10), the homepage FAQ, the About page sub-sections, and the JSON-LD structured data all read from these same modules — nothing is duplicated as separate prose.
