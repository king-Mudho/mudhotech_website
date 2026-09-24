export const faq = [
  { q: "What services do you offer?", a: "Software development, website development, mobile applications, cloud solutions, ICT consultancy, managed IT services, cybersecurity guidance, and digital transformation support." },
  { q: "Do you develop custom software?", a: "Yes — software is designed around each client's operational requirements." },
  { q: "Can you modernize existing systems?", a: "Yes — we assess current systems and recommend upgrades, integrations, or redevelopment where appropriate." },
  { q: "Do you provide support after deployment?", a: "Yes — ongoing maintenance, updates, troubleshooting, and user support." },
  { q: "Which sectors do you serve?", a: "Government institutions, NGOs, educational institutions, healthcare providers, financial services, retailers, manufacturers, agricultural businesses, mining companies, and SMEs." },
];

export type FaqItem = { q: string; a: string };

/**
 * Page-specific sets. Every answer restates a claim already made in
 * `services.ts` or `processes.ts` — no prices, turnaround times, or
 * warranties, which need the owner's numbers (see TODO(content) there).
 */
export const supportFaq: FaqItem[] = [
  { q: "Do I have to bring my computer in?", a: "Either works. Drop the device at our Graniteside office, or book an on-site visit for office equipment and networks. Many software problems can also be handled by remote assistance." },
  { q: "Will I lose my files?", a: "Recoverable data is pulled off first wherever a drive is still readable, and backed up before anything is wiped. We can also recover data from drives that are failing but not yet dead." },
  { q: "What does a diagnosis cost?", a: "Nothing. We diagnose the problem and tell you what it will cost to fix before any work begins — you decide whether to go ahead." },
  { q: "Can you stop viruses coming back?", a: "Removal comes first, then the part most people skip: real-time protection that is actually switched on, scheduled scans, and a backup that runs on its own." },
  { q: "Do you set up office networks?", a: "Yes — network setup, Wi-Fi coverage, and structured cabling that is labelled and documented, so the next person to work on it is not starting from scratch." },
];

export const buildFaq: FaqItem[] = [
  { q: "How do I know what it will cost?", a: "Scope, timeline, and cost are agreed in writing before development starts. You get a costed proposal first — no work begins until you approve it." },
  { q: "Can customers pay with EcoCash?", a: "Yes. Online stores and systems can take local payment rails such as EcoCash and ZimSwitch, as well as international cards through Stripe." },
  { q: "Will we be dependent on you to run it?", a: "No. Every system is handed over with documentation and training for your team, so you can run it yourselves. Ongoing maintenance and support are available if you want them." },
  { q: "Can you improve a system we already have?", a: "Yes — we assess what you have and recommend upgrades, integrations, or redevelopment where it is actually needed, rather than starting from scratch by default." },
  { q: "Do you also support the software after launch?", a: "Yes — maintenance, updates, troubleshooting, and user support continue after deployment." },
];
