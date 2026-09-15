import type { LucideIcon } from "lucide-react";
import {
  Monitor, Shield, GraduationCap, Palette, KeyRound,
  Globe, ShoppingCart, Smartphone, Settings,
  HardDrive, Wrench, Wind, Wifi, Printer, Cpu,
} from "lucide-react";

export interface ServiceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}

// ─── SOFTWARE SERVICES ───────────────────────────────────
export const softwareServices: ServiceCategory[] = [
  {
    icon: Monitor,
    title: "Core Software Installation & Setup",
    description: "Get your machine ready with a complete software setup — from operating systems to productivity tools.",
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
  },
  {
    icon: Shield,
    title: "Security & Maintenance",
    description: "Keep your system safe, fast, and backed up with professional security solutions.",
    items: [
      "Antivirus installation & configuration",
      "Malware & spyware removal",
      "PC performance optimization & cleanup",
      "Disk cleanup & defragmentation",
      "System backup & restore setup",
      "Data recovery from formatted drives or USBs",
    ],
  },
  {
    icon: GraduationCap,
    title: "Academic & Productivity Tools",
    description: "Tools and services for students, researchers, and professionals to work smarter.",
    items: [
      "Plagiarism check & correction (Turnitin, Grammarly)",
      "CV, Resume & Cover Letter writing + formatting",
      "Referencing software setup (Zotero, Mendeley, EndNote)",
      "Document formatting (APA, MLA, Harvard styles)",
      "PowerPoint design & presentation improvement",
      "PDF-to-Word, Word-to-PDF & format conversion",
    ],
  },
  {
    icon: Palette,
    title: "Design & Creative Tools",
    description: "Creative software installation, setup, and basic design services.",
    items: [
      "Canva, Photoshop & Illustrator setup",
      "Video editing software (Filmora, Adobe Premiere, CapCut)",
      "Audio editing software (Audacity)",
      "Poster & flyer design for events or projects",
    ],
  },
  {
    icon: KeyRound,
    title: "Digital Support & Troubleshooting",
    description: "Quick diagnosis and fixes for software crashes, boot issues, and more.",
    items: [
      "Password recovery (Windows, Wi-Fi, email accounts)",
      "Software crash & freeze troubleshooting",
      "Blue screen (BSOD) problem fixing",
      "File corruption repair",
      "Laptop/PC boot or startup problem repair",
    ],
  },
];

// ─── DEVELOPMENT SERVICES ─────────────────────────────────
export const devServices: ServiceCategory[] = [
  {
    icon: Globe,
    title: "Custom Web Systems",
    description: "Purpose-built web platforms designed around how your organization actually operates.",
    items: [
      "Corporate Websites",
      "Booking & Reservation Systems",
      "Inventory Management Systems",
      "POS & Business Automation",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Secure, locally-relevant online stores with payment methods your customers already use.",
    items: [
      "Secure Online Stores",
      "Payment Integration (EcoCash, ZimSwitch, Stripe)",
      "Order & Inventory Management",
      "Mobile Payment Integration",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform apps that extend your services to your customers' phones.",
    items: [
      "Android Development",
      "iOS Development",
      "Cross-Platform Apps",
      "Progressive Web Apps",
    ],
  },
  {
    icon: Settings,
    title: "Software Installation & Maintenance",
    description: "Business software installed, configured, and kept running so your team can rely on it.",
    items: [
      "Accounting Software (QuickBooks, Sage)",
      "Office Tools Setup",
      "Antivirus & Security Software",
      "System Optimization",
    ],
  },
];

// ─── HARDWARE / IT SUPPORT SERVICES ──────────────────────
export const hardwareServices: ServiceCategory[] = [
  {
    icon: HardDrive,
    title: "Hardware Installation & Upgrades",
    description: "Boost your machine's performance with professional component upgrades.",
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
  },
  {
    icon: Wrench,
    title: "Laptop & Desktop Repairs",
    description: "Expert diagnosis and repair for all common hardware faults.",
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
  },
  {
    icon: Wind,
    title: "Cleaning & Preventive Maintenance",
    description: "Extend the life of your devices with regular professional cleaning.",
    items: [
      "Full internal cleaning & dust removal",
      "Fan cleaning & lubrication",
      "Heat sink cleaning & thermal paste replacement",
      "Laptop cooling pad setup",
      "Airflow optimization for desktops & gaming PCs",
    ],
  },
  {
    icon: Wifi,
    title: "Networking & Connectivity",
    description: "Reliable network setup and troubleshooting for homes and offices.",
    items: [
      "Wi-Fi setup, configuration & troubleshooting",
      "Router installation & optimization",
      "LAN cabling & Ethernet setup",
      "Network speed optimization & diagnostics",
      "Internet connection troubleshooting",
      "Home & office network setup",
    ],
  },
  {
    icon: Printer,
    title: "Peripheral & Device Setup",
    description: "Get all your peripherals connected and working perfectly.",
    items: [
      "Printer installation, setup & troubleshooting",
      "Scanner setup & calibration",
      "Monitor setup (dual display, resolution issues)",
      "External hard drive & SSD setup",
      "Webcam, microphone & speaker installation",
      "Bluetooth & Wi-Fi adapter installation",
    ],
  },
  {
    icon: Cpu,
    title: "Advanced Hardware Support",
    description: "Motherboard-level repairs and advanced diagnostics for complex issues.",
    items: [
      "BIOS/UEFI configuration & updates",
      "Firmware upgrades for hardware components",
      "Hardware diagnostics (RAM, CPU, GPU tests)",
      "Data migration between failing drives",
      "Motherboard-level repairs (short-circuit, IC issues)",
    ],
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
