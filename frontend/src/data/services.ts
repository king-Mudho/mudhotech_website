import type { LucideIcon } from "lucide-react";
import {
  Monitor, Shield, GraduationCap, Palette, KeyRound,
  Globe, ShoppingCart, Smartphone, Settings,
  HardDrive, Wrench, Wind, Wifi, Printer, Cpu,
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
   * Local image only — no new stock URLs. Omitted where nothing in
   * public/images genuinely depicts the work; the card falls back to an
   * icon panel, which looks deliberate, whereas an unrelated photo of a
   * server room above "CV formatting" does not.
   */
  image?: string;
  /**
   * TODO(content): typical turnaround, e.g. "Same day" / "2–3 working days".
   * Deliberately left unset — these are commitments the business has to be
   * able to honour, so they need the owner's numbers, not invented ones.
   * The card renders this row only when it is present.
   */
  turnaround?: string;
}

// ─── SOFTWARE SERVICES ───────────────────────────────────
export const softwareServices: ServiceCategory[] = [
  {
    icon: Monitor,
    title: "Core Software Installation & Setup",
    description: "A blank or broken machine handed back ready to work — operating system, drivers, and the software your team uses daily.",
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
      "Windows 10 / 11", "macOS", "Ubuntu", "Kali Linux", "Microsoft Office",
      "Adobe Acrobat", "Chrome", "Edge", "Firefox", "Brave",
    ],
    bestFor: "New machines, rebuilds after a repair, and PCs that have slowed to a crawl.",
    image: "/images/service-software.jpg",
  },
  {
    icon: Shield,
    title: "Security & Maintenance",
    description: "Clean out what is already on the machine, then set up the protection and backups that stop it happening again.",
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
    description: "Reference managers, formatting, and originality checks for work that has to meet a submission standard.",
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
    description: "Creative software installed and tuned to your hardware, plus straightforward design work when you need it.",
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
    image: "/images/section-creative.jpg",
  },
  {
    icon: KeyRound,
    title: "Digital Support & Troubleshooting",
    description: "The jobs that start with “it won’t turn on” or “I’m locked out” — diagnosed before anything is charged.",
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
];

// ─── DEVELOPMENT SERVICES ─────────────────────────────────
export const devServices: ServiceCategory[] = [
  {
    icon: Globe,
    title: "Custom Web Systems",
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
    image: "/images/service-software.jpg",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Online stores that accept the payment methods your customers already have on their phones.",
    detail:
      "A storefront wired to local payment rails, not just international cards — so customers can pay the way they already do. Stock, orders, and payments live in one place, which means the shop floor and the website stop disagreeing about what is available.",
    items: [
      "Secure Online Stores",
      "Payment Integration (EcoCash, ZimSwitch, Stripe)",
      "Order & Inventory Management",
      "Mobile Payment Integration",
    ],
    worksWith: ["EcoCash", "ZimSwitch", "Stripe", "Mobile money"],
    bestFor: "Retailers selling in person who want the same stock list online.",
    image: "/images/service-ecommerce.jpg",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Apps that put your service on the device your customers are already holding.",
    detail:
      "Android first, because that is what most of the market is carrying. Cross-platform where one codebase can serve both stores and keep your costs down, native where the app genuinely needs the hardware, and a progressive web app where asking someone to install anything is the thing losing you users.",
    items: [
      "Android Development",
      "iOS Development",
      "Cross-Platform Apps",
      "Progressive Web Apps",
    ],
    // No `worksWith` here: it would just repeat the four `items` above
    // verbatim as chips, which reads as padding rather than information.
    bestFor: "Services used on the move — deliveries, field teams, bookings, and customer self-service.",
  },
  {
    icon: Settings,
    title: "Software Installation & Maintenance",
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

// ─── HARDWARE / IT SUPPORT SERVICES ──────────────────────
export const hardwareServices: ServiceCategory[] = [
  {
    icon: HardDrive,
    title: "Hardware Installation & Upgrades",
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
    worksWith: ["RAM", "SSD & HDD", "M.2 / NVMe", "SATA", "GPUs", "Power supplies", "Motherboards", "CPUs", "Case fans"],
    bestFor: "Machines that are slow rather than broken, and anyone weighing a repair against a replacement.",
    image: "/images/service-hardware.jpg",
  },
  {
    icon: Wrench,
    title: "Laptop & Desktop Repairs",
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
    image: "/images/section-repairs.jpg",
  },
  {
    icon: Wind,
    title: "Cleaning & Preventive Maintenance",
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
    image: "/images/hero-it-support.jpg",
  },
  {
    icon: Wifi,
    title: "Networking & Connectivity",
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
    image: "/images/service-networking.jpg",
  },
  {
    icon: Printer,
    title: "Peripheral & Device Setup",
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

// ─── GALLERY / PORTFOLIO IMAGES ──────────────────────────
// TODO(content): placeholder stock photography — replace with MudhoTech's
// own/licensed device photography before launch. See docs/OPEN-QUESTIONS.md #4.
//
// Every URL below was checked to return HTTP 200 before being added. One
// previously-shipped image (photo-1558618666-…) had started 404-ing and has
// been replaced. If you swap any of these, verify the new URL loads first —
// a dead entry renders as an empty tile with no error.
export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=600&h=400&fit=crop`;

export const galleryImages: GalleryImage[] = [
  // Laptops
  { src: unsplash("photo-1496181133206-80ce9b88a853"), alt: "Modern laptop open on a wooden desk", category: "Laptops" },
  { src: unsplash("photo-1531297484001-80022131f5a1"), alt: "Sleek silver laptop on a plain surface", category: "Laptops" },
  { src: unsplash("photo-1517336714731-489689fd1ca8"), alt: "Laptop displaying code on a desk", category: "Laptops" },
  { src: unsplash("photo-1541807084-5c52b6b3adef"), alt: "Laptop keyboard viewed from above", category: "Laptops" },
  { src: unsplash("photo-1498050108023-c5249f4df085"), alt: "Developer laptop with code editor open", category: "Laptops" },

  // Desktops
  { src: unsplash("photo-1593062096033-9a26b09da705"), alt: "Desktop PC with illuminated components", category: "Desktops" },
  { src: unsplash("photo-1547082299-de196ea013d6"), alt: "Multi-monitor desktop workspace", category: "Desktops" },
  { src: unsplash("photo-1587831990711-23ca6441447b"), alt: "Tidy desktop workstation setup", category: "Desktops" },
  { src: unsplash("photo-1527443224154-c4a3942d3acf"), alt: "Desktop computer tower and peripherals", category: "Desktops" },
  { src: unsplash("photo-1616763355603-9755a640a287"), alt: "Office desktop computer in use", category: "Desktops" },

  // Smartphones
  { src: unsplash("photo-1511707171634-5f897ff02aa9"), alt: "Smartphone resting on a desk", category: "Smartphones" },
  { src: unsplash("photo-1585771724684-38269d6639fd"), alt: "Several smartphones side by side", category: "Smartphones" },
  { src: unsplash("photo-1512941937669-90a1b58e7e9c"), alt: "Smartphone held in one hand", category: "Smartphones" },
  { src: unsplash("photo-1580910051074-3eb694886505"), alt: "Smartphone screen showing applications", category: "Smartphones" },
  { src: unsplash("photo-1592899677977-9c10ca588bbd"), alt: "Modern smartphone on a neutral background", category: "Smartphones" },

  // Hardware Repairs
  { src: unsplash("photo-1588872657578-7efd1f1555ed"), alt: "Technician repairing a laptop", category: "Hardware Repairs" },
  { src: unsplash("photo-1518770660439-4636190af475"), alt: "Close-up of a circuit board", category: "Hardware Repairs" },
  { src: unsplash("photo-1601737487795-dab272f52420"), alt: "Laptop opened for internal repair", category: "Hardware Repairs" },
  { src: unsplash("photo-1597852074816-d933c7d2b988"), alt: "Computer components laid out for servicing", category: "Hardware Repairs" },
  { src: unsplash("photo-1608222351212-18fe0ec7b13b"), alt: "Hardware diagnostics in progress", category: "Hardware Repairs" },

  // Software Setup
  { src: unsplash("photo-1629131726692-1accd0c53ce0"), alt: "Software installation on screen", category: "Software Setup" },
  { src: unsplash("photo-1517694712202-14dd9538aa97"), alt: "Writing code on a laptop", category: "Software Setup" },
  { src: unsplash("photo-1461749280684-dccba630e2f6"), alt: "Source code displayed on a monitor", category: "Software Setup" },
  { src: unsplash("photo-1555949963-aa79dcee981c"), alt: "Terminal window with configuration output", category: "Software Setup" },
  { src: unsplash("photo-1571171637578-41bc2dd41cd2"), alt: "Operating system setup on a workstation", category: "Software Setup" },

  // Networking
  { src: unsplash("photo-1597872200969-2b65d56bd16b"), alt: "Network server rack", category: "Networking" },
  { src: unsplash("photo-1544197150-b99a580bb7a8"), alt: "Network cabling in a server cabinet", category: "Networking" },
  { src: unsplash("photo-1558494949-ef010cbdcc31"), alt: "Data centre server racks", category: "Networking" },
  { src: unsplash("photo-1451187580459-43490279c0fa"), alt: "Network connectivity concept image", category: "Networking" },
  { src: unsplash("photo-1526374965328-7f61d4dc18c5"), alt: "Network monitoring visualisation", category: "Networking" },
];
