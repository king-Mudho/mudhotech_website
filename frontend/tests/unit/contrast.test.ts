import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Colour contrast of the theme tokens, in both themes.
 *
 * Dark mode shipped with white text on a bright accent (3.0:1) and with bands
 * that turned bright blue or light grey, because nobody checked the `.dark`
 * values. These tests read app/globals.css directly, so changing a token to
 * something unreadable fails here rather than in production.
 */

const css = readFileSync(resolve(__dirname, "../../app/globals.css"), "utf8");

function tokens(selector: string): Record<string, [number, number, number]> {
  const start = css.indexOf(selector);
  const block = css.slice(start, css.indexOf("}", start));
  const out: Record<string, [number, number, number]> = {};
  for (const m of block.matchAll(/--([a-z-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/g)) {
    out[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return out;
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [luminance(hslToRgb(a)), luminance(hslToRgb(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Text token on background token, each needing WCAG AA for body text. */
const pairs: [string, string][] = [
  ["foreground", "background"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["accent", "background"],
  ["accent-foreground", "accent"],
  ["accent-foreground", "accent-hover"],
  ["accent-strong", "secondary"],
  ["hero-foreground", "hero"],
  ["hero-accent", "hero"],
  ["band-foreground", "band"],
  ["hero-accent", "band"],
  ["whatsapp-foreground", "whatsapp"],
];

describe.each([
  ["light", ":root {"],
  ["dark", ".dark {"],
])("%s theme tokens", (_theme, selector) => {
  const t = tokens(selector);

  it.each(pairs)("%s on %s reaches 4.5:1", (text, bg) => {
    expect(t[text], `--${text} missing`).toBeDefined();
    expect(t[bg], `--${bg} missing`).toBeDefined();
    expect(contrast(t[text], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

describe("theme-invariant bands", () => {
  // These sections carry white text and a white logo, so they must sit on a
  // background that stays dark in both themes. bg-primary and bg-foreground
  // both turn light or bright in dark mode.
  it.each(["src/components/layout/Footer.tsx", "src/components/marketing/WhyMudhoTech.tsx"])(
    "%s uses the band colour",
    (file) => {
      const source = readFileSync(resolve(__dirname, "../..", file), "utf8");
      expect(source).toContain("bg-band text-band-foreground");
      expect(source).not.toMatch(/className="[^"]*\bbg-(primary|foreground)\b/);
    },
  );
});
