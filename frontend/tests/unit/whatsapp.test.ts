import { describe, it, expect } from "vitest";
import { whatsappNumber, whatsappUrl, telHref, mailtoHref, composeEnquiry } from "@/lib/whatsapp";
import { company } from "@/data/company";

describe("whatsappNumber", () => {
  it("strips the plus and spaces — wa.me silently opens a blank chat otherwise", () => {
    expect(whatsappNumber()).toBe("263712700941");
  });

  it("produces digits only", () => {
    expect(whatsappNumber()).toMatch(/^\d+$/);
  });

  it("keeps the Zimbabwe country code", () => {
    expect(whatsappNumber().startsWith("263")).toBe(true);
  });
});

describe("whatsappUrl", () => {
  it("builds a bare chat link when given no message", () => {
    expect(whatsappUrl()).toBe("https://wa.me/263712700941");
  });

  it("URL-encodes the prefilled message", () => {
    const url = whatsappUrl("Hello there & welcome");
    expect(url).toContain("?text=");
    expect(url).toContain("%26"); // & must be encoded, or it truncates the message
    expect(url).not.toContain(" ");
  });

  it("survives newlines, which the composed enquiry relies on", () => {
    expect(whatsappUrl("line one\nline two")).toContain("%0A");
  });
});

describe("telHref", () => {
  it("removes spaces but keeps the leading plus for international dialling", () => {
    expect(telHref()).toBe("tel:+263775398749");
  });
});

describe("mailtoHref", () => {
  it("uses the company address", () => {
    expect(mailtoHref()).toBe(`mailto:${company.contact.email}`);
  });

  it("encodes an optional subject", () => {
    expect(mailtoHref("Quote request & enquiry")).toContain("subject=Quote%20request%20%26%20enquiry");
  });
});

describe("composeEnquiry", () => {
  it("includes every supplied field", () => {
    const text = composeEnquiry({
      name: "Tendai Moyo",
      email: "tendai@example.com",
      subject: "New website",
      message: "We need a booking system.",
    });
    expect(text).toContain("Tendai Moyo");
    expect(text).toContain("tendai@example.com");
    expect(text).toContain("New website");
    expect(text).toContain("We need a booking system.");
  });

  it("omits blank fields rather than printing empty labels", () => {
    const text = composeEnquiry({ name: "Tendai Moyo" });
    expect(text).toContain("Tendai Moyo");
    expect(text).not.toContain("Email:");
    expect(text).not.toContain("Subject:");
  });

  it("still greets when the form is entirely empty", () => {
    expect(composeEnquiry({})).toContain("Hello MudhoTech");
  });
});
