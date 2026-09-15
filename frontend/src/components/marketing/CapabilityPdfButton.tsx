"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { collaborationAreas, potentialPartners } from "@/data/partnerships";
import { roadmap } from "@/data/roadmap";

/**
 * Generates the Capability Statement PDF from the same data modules the page
 * renders — single source of truth (docs/07-content-data-model.md §10).
 * jsPDF is imported dynamically so it stays out of the initial bundle.
 */
export function CapabilityPdfButton() {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const navy = [10, 26, 48] as const;
      const accent = [0, 122, 255] as const;

      doc.setFillColor(...navy);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(company.shortName, 14, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(company.tagline, 14, 23);

      doc.setTextColor(...navy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Company Fact Sheet", 14, 45);

      autoTable(doc, {
        startY: 50,
        theme: "grid",
        headStyles: { fillColor: [...accent] },
        head: [["Field", "Detail"]],
        body: [
          ["Company Name", company.name],
          ["Business Type", company.businessType],
          ["Registered Office", company.registeredOffice],
          ["Registration No.", company.registrationNumber || "To be confirmed"],
          ["Telephone", company.contact.phone],
          ["WhatsApp", company.contact.whatsapp],
          ["Email", company.contact.email],
          ["Website", company.contact.website],
          ["Target Markets", company.targetMarkets.join(", ")],
        ],
        styles: { fontSize: 9, cellPadding: 3 },
      });

      let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Partnership Opportunities", 14, y);
      autoTable(doc, {
        startY: y + 5,
        theme: "grid",
        headStyles: { fillColor: [...accent] },
        head: [["Potential Partners", "Collaboration Areas"]],
        body: potentialPartners.map((partner, i) => [partner, collaborationAreas[i] ?? ""]),
        styles: { fontSize: 9, cellPadding: 3 },
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Future Roadmap", 14, y);
      autoTable(doc, {
        startY: y + 5,
        theme: "grid",
        headStyles: { fillColor: [...accent] },
        head: [["Phase", "Focus"]],
        body: roadmap.map((phase) => [phase.phase, phase.points.join("\n")]),
        styles: { fontSize: 9, cellPadding: 3 },
      });

      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(company.motto, 14, pageHeight - 10);

      doc.save("MudhoTech-Capability-Statement.pdf");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button onClick={generate} variant="accent" size="lg" disabled={generating}>
      <Download className="h-4 w-4" />
      {generating ? "Generating…" : "Download as PDF"}
    </Button>
  );
}
