import { describe, it, expect } from "vitest";
import {
  contactSchema,
  quoteSchema,
  softwareServiceRequestSchema,
  newsletterSchema,
  serviceTypeOptions,
} from "@/lib/schemas";

describe("contactSchema", () => {
  const valid = {
    name: "Tendai Moyo",
    email: "tendai@example.com",
    subject: "Website enquiry",
    message: "I would like to discuss a new website for my business.",
  };

  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an optional phone", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "+263771234567" }).success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "email")).toBe(true);
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({ ...valid, name: "T" });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than 2000 characters", () => {
    const result = contactSchema.safeParse({ ...valid, message: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });
});

describe("quoteSchema", () => {
  const valid = {
    name: "Rumbi Chikwanha",
    email: "rumbi@example.com",
    serviceType: "Web Development",
    description: "We need an online store with local payment options.",
  };

  it("accepts a valid payload", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a service type", () => {
    const result = quoteSchema.safeParse({ ...valid, serviceType: "" });
    expect(result.success).toBe(false);
  });

  it("accepts each allowed preferred-contact value", () => {
    for (const preferredContact of ["email", "phone", "whatsapp"] as const) {
      expect(quoteSchema.safeParse({ ...valid, preferredContact }).success).toBe(true);
    }
  });

  it("rejects an unknown preferred-contact value", () => {
    expect(quoteSchema.safeParse({ ...valid, preferredContact: "carrier-pigeon" }).success).toBe(false);
  });
});

describe("softwareServiceRequestSchema", () => {
  const valid = {
    name: "Farai Dube",
    email: "farai@example.com",
    serviceCategory: "Security & Maintenance",
    details: "Antivirus keeps disabling itself after restart.",
  };

  it("accepts a valid payload", () => {
    expect(softwareServiceRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a service category", () => {
    expect(softwareServiceRequestSchema.safeParse({ ...valid, serviceCategory: "" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "reader@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("honeypot field", () => {
  const valid = {
    name: "Tendai Moyo",
    email: "tendai@example.com",
    subject: "Website enquiry",
    message: "I would like to discuss a new website for my business.",
  };

  it("accepts an empty honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "" }).success).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });
});

describe("serviceTypeOptions", () => {
  it("exposes the 10 options the quote form needs", () => {
    expect(serviceTypeOptions).toHaveLength(10);
    expect(new Set(serviceTypeOptions).size).toBe(serviceTypeOptions.length);
  });
});
