export type ExportRow = object;

function formatValue(val: unknown): string {
  if (val == null) return "";
  return String(val);
}

function cell(row: ExportRow, key: string): string {
  return formatValue((row as Record<string, unknown>)[key]);
}

/**
 * Neutralises spreadsheet formula injection.
 *
 * Every value in these exports came from a public, unauthenticated form.
 * Excel, LibreOffice, and Google Sheets all evaluate a cell that begins with
 * `=`, `+`, `-`, `@`, or a tab/CR, so a submitted name of
 * `=HYPERLINK("http://evil.example","Click")` becomes a live link the moment
 * a staff member opens the CSV. Quoting alone does not stop this — the
 * leading character has to be defused. A leading apostrophe is the standard
 * mitigation and is hidden by the spreadsheet once parsed.
 */
function csvSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function exportToCSV(data: ExportRow[], columns: { key: string; label: string }[], filename: string): void {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    columns.map((c) => `"${csvSafe(cell(row, c.key)).replace(/"/g, '""')}"`).join(","),
  );
  // \r\n: Excel treats a bare \n as a continuation inside some locales.
  const csv = [header, ...rows].join("\r\n");
  // BOM so Excel reads the file as UTF-8 rather than the system codepage —
  // without it, any non-ASCII character in a name or message is mangled.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// jsPDF is imported dynamically so it stays out of the initial admin bundle.
export async function exportToPDF(
  data: ExportRow[],
  columns: { key: string; label: string }[],
  filename: string,
  title: string,
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: data[0] && columns.length > 5 ? "landscape" : "portrait" });

  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Exported on ${new Date().toLocaleDateString("en-ZW", { day: "numeric", month: "long", year: "numeric" })} · ${data.length} record${data.length === 1 ? "" : "s"}`,
    14,
    27,
  );

  autoTable(doc, {
    startY: 34,
    head: [columns.map((c) => c.label)],
    body: data.map((row) => columns.map((c) => cell(row, c.key))),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${filename}.pdf`);
}

export const contactColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Received" },
];

export const quoteColumns = [
  { key: "name", label: "Name" },
  { key: "business", label: "Business" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "service_type", label: "Service" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Received" },
];
