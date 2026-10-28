import type { LucideIcon } from "lucide-react";
import { paymentsNote } from "@/data/commitments";
import {
  Monitor,
  Shield,
  GraduationCap,
  Palette,
  KeyRound,
  Globe,
  ShoppingCart,
  Smartphone,
  Settings,
  HardDrive,
  Wrench,
  Wind,
  Wifi,
  Printer,
  Cpu,
} from "lucide-react";

export interface ServiceCategory {
  icon: LucideIcon;
  title: string;
  /** One line. Used in cards, the quote form, and meta descriptions. */
  description: string;
  /**
   * Two or three sentences of substance: what the work actually involves and
   * what the client ends up with. The one-line `description` sells; this
   * answers the question the visitor asks next.
   */
  detail: string;
  items: string[];
  /**
   * Named software, platforms, and parts this service covers — the things a
   * visitor scans for to check we handle their specific case.
   *
   * Every entry here is drawn from that service's own `items`, so this is a
   * different presentation of an existing claim rather than a new one. Leave
   * it out where a service has no named products to list; a chip row padded
   * with vague capability words reads as filler.
   */
  worksWith?: string[];
  /** Who the service actually suits, in plain terms. */
  bestFor: string;
  /**
   * A photo from public/images that shows this work, shown at the top of the
   * card. Omitted where no photo genuinely shows the service; the card then
   * shows generated artwork (ServiceArt) instead of an unrelated picture.
   */
  image?: string;
  /**
   * TODO(content): typical turnaround, e.g. "Same day" / "2–3 working days".
   * Deliberately left unset — these are commitments the business has to be
   * able to honour, so they need the owner's numbers, not invented ones.
   * The card renders this row only when it is present.
   */
  turnaround?: string;
  /** A caveat the visitor needs before relying on the claim, e.g. third-party fees. */
  note?: string;
}

// ─── SOFTWARE SETUP & SUPPORT ────────────────────────────
// Part of the "keep technology working" path: shown on /it-support, not on
// the build page, which is reserved for development work.
export const softwareServices: ServiceCategory[] = [
  {
    icon: Monitor,
    title: "Core Software Installation & Setup",
    description:
      "A blank or broken machine handed back ready to work — operating system, drivers, and the software your team uses daily.",
    detail:
      "We install and activate the operating system, fit the correct drivers for your exact hardware rather than a generic set, and configure the productivity suite so the machine is usable the moment you collect it. Anything already on the drive is backed up before a wipe, and we hand over with accounts signed in and updates running.",
    items: [
      "Windows installation & reinstallation",
      "macOS installation & setup",
      "Linux (Ubuntu/Kali) installation & dual boot",
      "Microsoft Office (Word, Excel, PowerPoint, Access, Outlook)",
      "Windows & Office activation",
      "Driver pack installation & updates",
      "Adobe software (Photoshop, Illustrator, Acrobat)",
      "PDF tools — conversion, editing, merging & annotation",
      "Browser installation (Chrome, Edge, Firefox, Brave)",
    ],
    worksWith: [
      "Windows 10 / 11",
      "macOS",
      "Ubuntu",
      "Kali Linux",
      "Microsoft Office",
      "Adobe Acrobat",
      "Chrome",
      "Edge",
      "Firefox",
      "Brave",
    ],
    bestFor: "New machines, rebuilds after a repair, and PCs that have slowed to a crawl.",
  },
  {
    icon: Shield,
    title: "Security & Maintenance",
    image: "/images/section-security.jpg",
    description:
      "Clean out what is already on the machine, then set up the protection and backups that stop it happening again.",
    detail:
      "Removal comes first, then the configuration most people skip: real-time protection that is actually switched on, scheduled scans, and a backup that runs without anyone remembering to start it. Where a drive has been formatted or a USB stick has failed, we attempt recovery before anything further is written to it — so bring it in before reusing it.",
    items: [
      "Antivirus installation & configuration",
      "Malware & spyware removal",
      "PC performance optimization & cleanup",
      "Disk cleanup & defragmentation",
      "System backup & restore setup",
      "Data recovery from formatted drives or USBs",
    ],
    bestFor: "Machines showing pop-ups, ransom notes, or unexplained slowdown — and anyone with no working backup.",
  },
  {
    icon: GraduationCap,
    title: "Academic & Productivity Tools",
    image: "/images/section-blog-insights.jpg",
    description:
      "Reference managers, formatting, and originality checks for work that has to meet a submission standard.",
    detail:
      "For students, researchers, and anyone submitting formatted work to a deadline. We install the reference manager, connect it to your word processor so citations update themselves, and format the document to the exact style your institution requires — then show you how to keep it that way.",
    items: [
      "Plagiarism check & correction (Turnitin, Grammarly)",
      "CV, Resume & Cover Letter writing + formatting",
      "Referencing software setup (Zotero, Mendeley, EndNote)",
      "Document formatting (APA, MLA, Harvard styles)",
      "PowerPoint design & presentation improvement",
      "PDF-to-Word, Word-to-PDF & format conversion",
    ],
    worksWith: ["Turnitin", "Grammarly", "Zotero", "Mendeley", "EndNote", "APA", "MLA", "Harvard", "Microsoft Word"],
    bestFor: "Dissertations, theses, journal submissions, and job applications.",
  },
  {
    icon: Palette,
    title: "Design & Creative Tools",
    image: "/images/section-creative.jpg",
    description:
      "Creative software installed and tuned to your hardware, plus straightforward design work when you need it.",
    detail:
      "Editing suites installed and licensed properly, with scratch disks and colour settings configured so they run on the machine you actually own rather than the one the system requirements assume. Where you need a poster or flyer rather than a whole brand identity, we can produce that too.",
    items: [
      "Canva, Photoshop & Illustrator setup",
      "Video editing software (Filmora, Adobe Premiere, CapCut)",
      "Audio editing software (Audacity)",
      "Poster & flyer design for events or projects",
    ],
    worksWith: ["Adobe Photoshop", "Illustrator", "Premiere Pro", "Canva", "CapCut", "Filmora", "Audacity"],
    bestFor: "Event promoters, small marketing teams, and anyone editing video on a laptop.",
  },
  {
    icon: KeyRound,
    title: "Digital Support & Troubleshooting",
    image: "/images/section-contact-support.jpg",
    description:
      "The jobs that start with “it won’t turn on” or “I’m locked out” — diagnosed before anything is charged.",
    detail:
      "We find the fault and tell you what it is before any work is agreed, including when the honest answer is that the hardware rather than the software is at fault. Recoverable data is pulled off first wherever a drive is still readable, because a rebuild that loses your files is not a fix.",
    items: [
      "Password recovery (Windows, Wi-Fi, email accounts)",
      "Software crash & freeze troubleshooting",
      "Blue screen (BSOD) problem fixing",
      "File corruption repair",
      "Laptop/PC boot or startup problem repair",
    ],
    bestFor: "Locked accounts, blue screens, boot loops, and files that will no longer open.",
  },
  {
    icon: Settings,
    title: "Business Software Setup",
    image: "/images/hero-quote.jpg",
    description: "Business software installed, configured, and kept running so your team can rely on it.",
    detail:
      "Accounting and office software set up with your chart of accounts, users, and permissions already in place rather than left at defaults. Ongoing maintenance keeps licences current and updates applied, so renewal season is not the first time anyone looks at it.",
    items: [
      "Accounting Software (QuickBooks, Sage)",
      "Office Tools Setup",
      "Antivirus & Security Software",
      "System Optimization",
    ],
    worksWith: ["QuickBooks", "Sage", "Microsoft Office"],
    bestFor: "Small finance and admin teams without in-house IT.",
  },
];

// ─── BUILD: DEVELOPMENT SERVICES ─────────────────────────
// The "build and improve digital products" path, shown on /web-software.
export const devServices: ServiceCategory[] = [
  {
    icon: Globe,
    title: "Websites & Custom Web Systems",
    image: "/images/service-software.jpg",
    description: "Purpose-built web platforms designed around how your organization actually operates.",
    detail:
      "Built to match your existing process rather than forcing your team onto someone else's. Scope, timeline, and cost are agreed in writing before development starts, and the finished system is handed over with documentation and training so you are not dependent on us to run it.",
    items: [
      "Corporate Websites",
      "Booking & Reservation Systems",
      "Inventory Management Systems",
      "POS & Business Automation",
    ],
    bestFor: "Organizations outgrowing spreadsheets, paper registers, or three systems that do not talk to each other.",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    image: "/images/service-ecommerce.jpg",
    description: "Online stores that accept the payment methods your customers already have on their phones.",
    detail:
      "A storefront wired to local payment rails, not just international cards — so customers can pay the way they already do. Stock, orders, and payments live in one place, which means the shop floor and the website stop disagreeing about what is available.",
    items: [
      "Secure Online Stores",
      "Payment integration (EcoCash, ZimSwitch, card payments)",
      "Order & Inventory Management",
      "Mobile Payment Integration",
    ],
    worksWith: ["EcoCash", "ZimSwitch", "Card payments", "Mobile money"],
    note: paymentsNote,
    bestFor: "Retailers selling in person who want the same stock list online.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    image: "/images/hero-blog.jpg",
    description: "Apps that put your service on the device your customers are already holding.",
    detail:
      "Android first, because that is what most of the market is carrying. Cross-platform where one codebase can serve both stores and keep your costs down, native where the app genuinely needs the hardware, and a progressive web app where asking someone to install anything is the thing losing you users.",
    items: ["Android Development", "iOS Development", "Cross-Platform Apps", "Progressive Web Apps"],
    // No `worksWith` here: it would just repeat the four `items` above
    // verbatim as chips, which reads as padding rather than information.
    bestFor: "Services used on the move — deliveries, field teams, bookings, and customer self-service.",
  },
];

// ─── HARDWARE / IT SUPPORT SERVICES ──────────────────────
export const hardwareServices: ServiceCategory[] = [
  {
    icon: HardDrive,
    title: "Hardware Installation & Upgrades",
    image: "/images/service-hardware.jpg",
    description: "Targeted component upgrades that make an existing machine worth keeping.",
    detail:
      "An upgrade is usually cheaper than a replacement, and we will tell you when it is not. We check what your board and chassis actually support before recommending anything, then fit it and migrate your existing installation across so you keep your files and settings.",
    items: [
      "RAM installation & upgrades",
      "SSD/HDD installation, cloning & migration",
      "Laptop storage upgrade (SATA/M.2/NVMe)",
      "Graphics card (GPU) installation & optimization",
      "Power supply (PSU) replacement",
      "Motherboard installation & component setup",
      "CPU installation, thermal paste & cooling setup",
      "Keyboard, touchpad & speaker replacement",
      "PC casing & fan installation (RGB, airflow)",
    ],
    worksWith: [
      "RAM",
      "SSD & HDD",
      "M.2 / NVMe",
      "SATA",
      "GPUs",
      "Power supplies",
      "Motherboards",
      "CPUs",
      "Case fans",
    ],
    bestFor: "Machines that are slow rather than broken, and anyone weighing a repair against a replacement.",
  },
  {
    icon: Wrench,
    title: "Laptop & Desktop Repairs",
    image: "/images/section-repairs.jpg",
    description: "Physical faults diagnosed properly and fixed once — screens, hinges, ports, and boards.",
    detail:
      "Diagnostics are free and come before any quote, so you know what is wrong and what it costs before committing. Where a board-level repair is possible we will attempt it rather than defaulting to a full replacement part, and we will say plainly when a machine is not economic to repair.",
    items: [
      "Laptop screen replacement (LED, LCD, IPS)",
      "Broken hinges & casing repair",
      "Keyboard replacement (water damage, broken keys)",
      "Trackpad repair & replacement",
      "Charging port (DC jack) repair",
      "Motherboard troubleshooting & repair",
      "Overheating fix (cleaning, thermal paste, fan)",
      "No-display / black screen troubleshooting",
      "Desktop PC power issues",
    ],
    worksWith: ["LED / LCD / IPS panels", "Hinges & casings", "Keyboards", "Trackpads", "DC jacks", "Motherboards"],
    bestFor: "Dropped laptops, liquid spills, cracked screens, and machines that no longer charge.",
  },
  {
    icon: Wind,
    title: "Cleaning & Preventive Maintenance",
    image: "/images/service-cleaning.jpg",
    description: "Scheduled cleaning that stops heat quietly shortening the life of your machines.",
    detail:
      "Dust is the most common cause of thermal throttling and fan failure, and it is entirely preventable. A full strip-down, fan service, and thermal paste replacement typically restores performance that owners had written off as the machine simply getting old.",
    items: [
      "Full internal cleaning & dust removal",
      "Fan cleaning & lubrication",
      "Heat sink cleaning & thermal paste replacement",
      "Laptop cooling pad setup",
      "Airflow optimization for desktops & gaming PCs",
    ],
    worksWith: ["Thermal paste", "Cooling fans", "Heat sinks", "Cooling pads"],
    bestFor: "Machines running hot or loud, and offices wanting a maintenance schedule rather than emergencies.",
  },
  {
    icon: Wifi,
    title: "Networking & Connectivity",
    image: "/images/service-networking.jpg",
    description: "Wi-Fi and cabling that reach every room and hold up when everyone is online at once.",
    detail:
      "We survey where the signal actually drops rather than guessing from the router, then fix it with placement, channel configuration, cabling, or additional access points as the building requires. Structured cabling is labelled and documented, so the next person to work on it is not starting from scratch.",
    items: [
      "Wi-Fi setup, configuration & troubleshooting",
      "Router installation & optimization",
      "LAN cabling & Ethernet setup",
      "Network speed optimization & diagnostics",
      "Internet connection troubleshooting",
      "Home & office network setup",
    ],
    worksWith: ["Wi-Fi routers", "Access points", "Ethernet / LAN", "Structured cabling"],
    bestFor: "Offices with dead zones, dropped connections, or a new floor to wire.",
  },
  {
    icon: Printer,
    title: "Peripheral & Device Setup",
    image: "/images/service-peripherals.jpg",
    description: "Printers, scanners, and displays connected, shared, and actually working for everyone.",
    detail:
      "Most peripheral problems are driver and sharing configuration rather than faulty hardware. We set the device up once, share it correctly across the machines that need it, and leave the settings documented so a new laptop can be added without another call-out.",
    items: [
      "Printer installation, setup & troubleshooting",
      "Scanner setup & calibration",
      "Monitor setup (dual display, resolution issues)",
      "External hard drive & SSD setup",
      "Webcam, microphone & speaker installation",
      "Bluetooth & Wi-Fi adapter installation",
    ],
    worksWith: ["Printers", "Scanners", "Monitors", "External drives", "Webcams", "Bluetooth adapters"],
    bestFor: "Shared office equipment, new starters, and home workers setting up a second screen.",
  },
  {
    icon: Cpu,
    title: "Advanced Hardware Support",
    image: "/images/hero-it-support.jpg",
    description: "Board-level diagnostics and firmware work for faults that defeat a parts swap.",
    detail:
      "When the obvious replacements have not fixed it, the fault is usually on the board or in firmware. We run component-level diagnostics on memory, processor, and graphics to isolate it, and can recover data from drives that are failing but not yet dead.",
    items: [
      "BIOS/UEFI configuration & updates",
      "Firmware upgrades for hardware components",
      "Hardware diagnostics (RAM, CPU, GPU tests)",
      "Data migration between failing drives",
      "Motherboard-level repairs (short-circuit, IC issues)",
    ],
    worksWith: ["BIOS / UEFI", "Component firmware", "RAM / CPU / GPU diagnostics", "Failing drives"],
    bestFor: "Intermittent faults, machines other workshops have returned unfixed, and drives showing SMART warnings.",
  },
];

// ─── SUPPORT PAGE GROUPS ─────────────────────────────────
// /it-support lists every "keep it working" service in three groups, each an
// anchor the homepage's problem cards link straight to.
export interface ServiceGroup {
  id: "repairs" | "networks" | "software";
  title: string;
  lead: string;
  services: ServiceCategory[];
}

const byTitle = (list: ServiceCategory[], ...titles: string[]) =>
  titles.map((title) => {
    const found = list.find((service) => service.title === title);
    if (!found) throw new Error(`Unknown service: ${title}`);
    return found;
  });

export const supportGroups: ServiceGroup[] = [
  {
    id: "repairs",
    title: "Repairs & Hardware",
    lead: "Laptops and desktops diagnosed, repaired, upgraded, and serviced.",
    services: byTitle(
      hardwareServices,
      "Laptop & Desktop Repairs",
      "Hardware Installation & Upgrades",
      "Advanced Hardware Support",
      "Cleaning & Preventive Maintenance",
    ),
  },
  {
    id: "networks",
    title: "Networks & Devices",
    lead: "Wi-Fi, cabling, and the printers and screens everyone shares.",
    services: byTitle(hardwareServices, "Networking & Connectivity", "Peripheral & Device Setup"),
  },
  {
    id: "software",
    title: "Software Setup & Troubleshooting",
    lead: "Operating systems, business and creative software, security, and the faults that stop a machine working.",
    services: byTitle(
      softwareServices,
      "Core Software Installation & Setup",
      "Digital Support & Troubleshooting",
      "Security & Maintenance",
      "Business Software Setup",
      "Design & Creative Tools",
      "Academic & Productivity Tools",
    ),
  },
];
