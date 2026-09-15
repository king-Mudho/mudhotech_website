import { describe, it, expect } from "vitest";
import { HONEYPOT_FIELD_NAME, isHoneypotTripped } from "@/lib/honeypot";
import { cn } from "@/lib/utils";
import { fadeUp, fadeUpDelayed } from "@/lib/motion";

describe("honeypot", () => {
  it("treats an empty or missing value as untripped", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
    expect(isHoneypotTripped(null)).toBe(false);
  });

  it("treats any real content as tripped", () => {
    expect(isHoneypotTripped("http://spam.example")).toBe(true);
    expect(isHoneypotTripped("x")).toBe(true);
  });

  it("uses a field name that matches the Django-side validator", () => {
    expect(HONEYPOT_FIELD_NAME).toBe("website");
  });
});

describe("cn", () => {
  it("merges conflicting tailwind classes, last one winning", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});

describe("fadeUp", () => {
  it("animates from hidden to fully visible", () => {
    expect(fadeUp.initial).toEqual({ opacity: 0, y: 24 });
    expect(fadeUp.whileInView).toEqual({ opacity: 1, y: 0 });
  });

  it("only animates once, so content never re-hides on scroll-back", () => {
    expect(fadeUp.viewport.once).toBe(true);
  });
});

describe("fadeUpDelayed", () => {
  it("staggers by index", () => {
    expect(fadeUpDelayed(0).transition.delay).toBe(0);
    expect(fadeUpDelayed(2).transition.delay).toBeCloseTo(0.14);
  });

  it("caps the delay so late items in a long grid aren't left invisible", () => {
    expect(fadeUpDelayed(50).transition.delay).toBe(0.35);
  });

  it("keeps the shared entrance/exit states", () => {
    expect(fadeUpDelayed(3).initial).toEqual(fadeUp.initial);
    expect(fadeUpDelayed(3).whileInView).toEqual(fadeUp.whileInView);
  });
});
