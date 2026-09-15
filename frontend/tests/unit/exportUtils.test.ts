import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportToCSV, contactColumns, quoteColumns } from "@/lib/exportUtils";

function captureCsv(): { getContent: () => string } {
  let captured = "";
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  // Capture happens in the Blob subclass below — jsdom's Blob has no
  // synchronous text() accessor, so we read the constructor parts instead.
  URL.createObjectURL = vi.fn(() => "blob:mock") as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;

  const originalBlob = globalThis.Blob;
  globalThis.Blob = class extends originalBlob {
    constructor(parts: BlobPart[], options?: BlobPropertyBag) {
      super(parts, options);
      captured = parts.join("");
    }
  } as unknown as typeof Blob;

  return {
    getContent: () => {
      globalThis.Blob = originalBlob;
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
      return captured;
    },
  };
}

describe("exportToCSV", () => {
  beforeEach(() => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes a header row from the column labels", () => {
    const capture = captureCsv();
    exportToCSV([], contactColumns, "test");
    const csv = capture.getContent();
    expect(csv.split("\n")[0]).toBe('"Name","Email","Phone","Subject","Message","Status","Received"');
  });

  it("escapes embedded double quotes by doubling them", () => {
    const capture = captureCsv();
    exportToCSV([{ name: 'He said "hello"', email: "a@b.com" }], [{ key: "name", label: "Name" }], "test");
    const csv = capture.getContent();
    expect(csv).toContain('"He said ""hello"""');
  });

  it("keeps commas and newlines inside a single quoted cell", () => {
    const capture = captureCsv();
    exportToCSV([{ message: "Line one,\nLine two" }], [{ key: "message", label: "Message" }], "test");
    const csv = capture.getContent();
    expect(csv).toContain('"Line one,\nLine two"');
  });

  it("renders null and undefined as empty cells", () => {
    const capture = captureCsv();
    exportToCSV([{ phone: null, business: undefined }], [
      { key: "phone", label: "Phone" },
      { key: "business", label: "Business" },
    ], "test");
    const csv = capture.getContent();
    expect(csv.split("\n")[1]).toBe('"",""');
  });
});

describe("column definitions", () => {
  it("contact columns cover every field the admin table exports", () => {
    expect(contactColumns.map((c) => c.key)).toEqual([
      "name", "email", "phone", "subject", "message", "status", "created_at",
    ]);
  });

  it("quote columns cover every field the admin table exports", () => {
    expect(quoteColumns.map((c) => c.key)).toEqual([
      "name", "business", "email", "phone", "service_type", "description", "status", "created_at",
    ]);
  });
});
