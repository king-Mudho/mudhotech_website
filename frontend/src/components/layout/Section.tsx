import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}

export function Section({ children, className, muted = false, id }: SectionProps) {
  return (
    <section id={id} className={cn("section-padding", muted ? "bg-secondary/50" : "bg-background", className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
