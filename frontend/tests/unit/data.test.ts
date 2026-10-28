import { describe, it, expect } from "vitest";
import { blogPosts } from "@/data/blogPosts";
import { softwareServices, devServices, hardwareServices, supportGroups } from "@/data/services";
import { company } from "@/data/company";
import { engagementSteps } from "@/data/engagementModel";
import { faq } from "@/data/faq";
import { roadmap } from "@/data/roadmap";
import { serviceCommitments, supportChannels } from "@/data/serviceCommitments";
import { potentialPartners, collaborationAreas } from "@/data/partnerships";
import { caseStudies, exampleProjects, isPublished } from "@/data/portfolio";

describe("blogPosts", () => {
  it("has the 4 starter posts the spec requires", () => {
    expect(blogPosts).toHaveLength(4);
  });

  it("has a unique slug for every post", () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses ISO-parseable dates so sitemap lastModified is valid", () => {
    for (const post of blogPosts) {
      expect(Number.isNaN(new Date(post.date).getTime())).toBe(false);
    }
  });

  it("gives every post a non-empty title, excerpt, image, and body", () => {
    for (const post of blogPosts) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.excerpt.length).toBeGreaterThan(0);
      expect(post.image.startsWith("/images/")).toBe(true);
      expect(post.content.length).toBeGreaterThan(0);
    }
  });
});

describe("services", () => {
  it("has the category counts the spec requires", () => {
    expect(softwareServices).toHaveLength(6);
    expect(devServices).toHaveLength(3);
    expect(hardwareServices).toHaveLength(6);
  });

  it("lists every support service exactly once on /it-support", () => {
    const grouped = supportGroups.flatMap((group) => group.services.map((service) => service.title));
    const support = [...softwareServices, ...hardwareServices].map((service) => service.title);
    expect([...grouped].sort()).toEqual([...support].sort());
  });

  it("keeps setup and support work off the development page", () => {
    // /web-software is the build path; installation, repairs and
    // troubleshooting belong to /it-support.
    const support = new Set([...softwareServices, ...hardwareServices].map((service) => service.title));
    for (const service of devServices) expect(support.has(service.title)).toBe(false);
  });

  it("caveats every payment integration claim", () => {
    // Merchant accounts, fees, and provider eligibility are the client's,
    // not ours; Stripe does not onboard Zimbabwe-registered businesses.
    for (const service of [...devServices, ...softwareServices, ...hardwareServices]) {
      const mentionsPayments = [...service.items, ...(service.worksWith ?? [])].some((text) =>
        /ecocash|zimswitch|stripe|card payment/i.test(text),
      );
      if (mentionsPayments) expect(service.note).toMatch(/merchant account/i);
    }
  });

  it("gives every category at least one item and a description", () => {
    for (const category of [...softwareServices, ...devServices, ...hardwareServices]) {
      expect(category.items.length).toBeGreaterThan(0);
      expect(category.description.length).toBeGreaterThan(0);
      expect(category.icon).toBeDefined();
    }
  });

  it("has a unique title per category within each group", () => {
    for (const group of [softwareServices, devServices, hardwareServices]) {
      const titles = group.map((c) => c.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it("gives every category the detail and audience copy the card renders", () => {
    for (const category of [...softwareServices, ...devServices, ...hardwareServices]) {
      expect(category.detail.length).toBeGreaterThan(80);
      expect(category.bestFor.length).toBeGreaterThan(0);
    }
  });

  it("carries no photographs: service cards use generated artwork", () => {
    // Stock photos were removed from the cards (ServiceArt draws them now);
    // this stops one creeping back through the data file.
    for (const category of [...softwareServices, ...devServices, ...hardwareServices]) {
      expect(category).not.toHaveProperty("image");
    }
  });

  it("never repeats a service's own items back as works-with chips", () => {
    // A chip row that restates the checklist above it is padding, not
    // information — see the Mobile App Development card.
    for (const category of [...softwareServices, ...devServices, ...hardwareServices]) {
      if (!category.worksWith) continue;
      const items = category.items.map((i) => i.toLowerCase());
      const duplicated = category.worksWith.filter((tool) => items.includes(tool.toLowerCase()));
      expect(duplicated).toEqual([]);
    }
  });
});

describe("company", () => {
  it("exposes the contact details the footer and JSON-LD read", () => {
    expect(company.contact.phone).toMatch(/^\+263/);
    expect(company.contact.whatsapp).toMatch(/^\+263/);
    expect(company.contact.email).toContain("@");
  });

  it("lists the 10 target markets", () => {
    expect(company.targetMarkets).toHaveLength(10);
  });

  it("lists the 7 stated values", () => {
    expect(company.values).toHaveLength(7);
  });

  it("leaves registration/VAT blank until confirmed (docs/OPEN-QUESTIONS.md #3)", () => {
    expect(company.registrationNumber).toBe("");
    expect(company.vatNumber).toBe("");
  });
});

describe("engagementSteps", () => {
  it("has the 7 steps in order with no gaps", () => {
    expect(engagementSteps).toHaveLength(7);
    expect(engagementSteps.map((s) => s.step)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("gives every step at least one point", () => {
    for (const step of engagementSteps) {
      expect(step.points.length).toBeGreaterThan(0);
    }
  });
});

describe("supporting content modules", () => {
  it("faq entries all have a question and answer", () => {
    expect(faq.length).toBeGreaterThan(0);
    for (const entry of faq) {
      expect(entry.q.length).toBeGreaterThan(0);
      expect(entry.a.length).toBeGreaterThan(0);
    }
  });

  it("roadmap has the 3 phases", () => {
    expect(roadmap).toHaveLength(3);
    for (const phase of roadmap) {
      expect(phase.points.length).toBeGreaterThan(0);
    }
  });

  it("service commitments and support channels are populated", () => {
    expect(serviceCommitments).toHaveLength(7);
    expect(supportChannels).toHaveLength(6);
  });

  it("partnership lists are populated", () => {
    expect(potentialPartners).toHaveLength(8);
    expect(collaborationAreas).toHaveLength(6);
  });
});

describe("portfolio", () => {
  const draftStudy = {
    slug: "example",
    title: "Example",
    client: "A retailer in Harare",
    sector: "Retail",
    path: "build",
    challenge: "Stock counted on paper.",
    solution: "A shared stock system.",
  } as const;

  it("publishes only case studies the client has agreed to", () => {
    expect(isPublished({ ...draftStudy, permissionConfirmed: false })).toBe(false);
    expect(isPublished({ ...draftStudy, permissionConfirmed: true })).toBe(true);
  });

  it("gives every case study the problem and solution, with local images only", () => {
    for (const study of caseStudies) {
      expect(study.challenge.length).toBeGreaterThan(0);
      expect(study.solution.length).toBeGreaterThan(0);
      for (const image of study.images ?? []) expect(image.src.startsWith("/images/")).toBe(true);
    }
  });

  it("keeps illustrative examples free of outcomes and figures", () => {
    // They are labelled "Illustrative example" on the page; a number or a
    // result would turn them back into an unverified claim.
    for (const example of exampleProjects) {
      expect(example.involves.length).toBeGreaterThan(0);
      expect(`${example.title} ${example.problem} ${example.involves.join(" ")}`).not.toMatch(
        /\d+%|\bdoubled\b|\btripled\b|\bcut\b/i,
      );
      expect(example.href.startsWith("/web-software") || example.href.startsWith("/it-support")).toBe(true);
    }
  });
});
