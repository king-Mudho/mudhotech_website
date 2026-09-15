import { test, expect } from "@playwright/test";

const CATEGORIES = ["Laptops", "Desktops", "Smartphones", "Hardware Repairs", "Software Setup", "Networking"];

test.beforeEach(async ({ page }) => {
  await page.goto("/portfolio");
  await page.getByRole("tab", { name: "Gallery" }).click();
});

test("gallery exposes every device category", async ({ page }) => {
  for (const category of CATEGORIES) {
    await expect(page.getByRole("button", { name: category, exact: true })).toBeVisible();
  }
});

test("every category shows multiple images", async ({ page }) => {
  for (const category of CATEGORIES) {
    await page.getByRole("button", { name: category, exact: true }).click();

    const images = page.locator("[role='tabpanel'][data-state='active'] img");
    await expect
      .poll(() => images.count(), { message: `expected several images under "${category}"` })
      .toBeGreaterThan(1);
  }
});

/**
 * The gallery points at externally-hosted photography. A dead URL renders as
 * an empty tile with no console error and no failed assertion anywhere else —
 * one had already gone 404 in production before this test existed. Checking
 * naturalWidth is the only reliable way to catch it.
 */
test("no gallery image is broken", async ({ page }) => {
  await page.getByRole("button", { name: "All", exact: true }).click();

  const images = page.locator("[role='tabpanel'][data-state='active'] img");
  await expect.poll(() => images.count()).toBeGreaterThan(10);

  const count = await images.count();
  const broken: string[] = [];

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await img.scrollIntoViewIfNeeded();
    // Wait for the browser to settle this image one way or the other.
    await expect
      .poll(async () => img.evaluate((el: HTMLImageElement) => el.complete), { timeout: 15_000 })
      .toBe(true);

    const { width, src } = await img.evaluate((el: HTMLImageElement) => ({
      width: el.naturalWidth,
      src: el.currentSrc || el.src,
    }));
    if (width === 0) broken.push(src);
  }

  expect(broken, `broken gallery images:\n${broken.join("\n")}`).toEqual([]);
});
