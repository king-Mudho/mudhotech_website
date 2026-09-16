import { describe, it, expect } from "vitest";
import { blogPosts } from "@/data/blogPosts";
import { softwareServices, devServices, hardwareServices, galleryImages } from "@/data/services";
import { company } from "@/data/company";
import { engagementSteps } from "@/data/engagementModel";
import { faq } from "@/data/faq";
import { roadmap } from "@/data/roadmap";
import { serviceCommitments, supportChannels } from "@/data/serviceCommitments";
import { potentialPartners, collaborationAreas } from "@/data/partnerships";
import { portfolioProjects, repairShowcases } from "@/data/portfolio";

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
    expect(softwareServices).toHaveLength(5);
    expect(devServices).toHaveLength(4);
    expect(hardwareServices).toHaveLength(6);
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

  it("points every service image at a local file, never a remote host", () => {
    // Remote stock would need a next.config remotePatterns entry and would
    // reintroduce the placeholder imagery docs/OPEN-QUESTIONS.md #4 flags.
    for (const category of [...softwareServices, ...devServices, ...hardwareServices]) {
      if (category.image) expect(category.image.startsWith("/images/")).toBe(true);
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

  it("tags every gallery image with a category and alt text", () => {
    for (const image of galleryImages) {
      expect(image.alt.length).toBeGreaterThan(0);
      expect(image.category.length).toBeGreaterThan(0);
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
  it("gives every project tech chips and a measurable result", () => {
    for (const project of portfolioProjects) {
      expect(project.tech.length).toBeGreaterThan(0);
      expect(project.result.length).toBeGreaterThan(0);
    }
  });

  it("gives every repair showcase the problem/work/result/turnaround set", () => {
    for (const repair of repairShowcases) {
      expect(repair.problem.length).toBeGreaterThan(0);
      expect(repair.work.length).toBeGreaterThan(0);
      expect(repair.result.length).toBeGreaterThan(0);
      expect(repair.turnaround.length).toBeGreaterThan(0);
    }
  });
});
