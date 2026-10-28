import type { LucideIcon } from "lucide-react";
import { Cloud, GraduationCap, Newspaper, Rocket, ShieldCheck } from "lucide-react";

/** Artwork icon for a blog category; new categories fall back to a neutral one. */
const icons: Record<string, LucideIcon> = {
  "Digital Strategy": Rocket,
  Cybersecurity: ShieldCheck,
  "Cloud Computing": Cloud,
  "Education Tech": GraduationCap,
};

export function blogIcon(category: string): LucideIcon {
  return icons[category] ?? Newspaper;
}
