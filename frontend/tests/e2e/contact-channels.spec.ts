import { test, expect } from "@playwright/test";

const WHATSAPP_NUMBER = "263712700941";
const PHONE = "+263775398749";
const EMAIL = "mudhotechsolutions@gmail.com";

test.describe("contact channels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("click-to-call uses a dialable tel: link", async ({ page }) => {
    const call = page.locator('a[href^="tel:"]').first();
    await expect(call).toBeVisible();
    // Spaces break tel: on some dialers; the plus must survive for
    // international dialling.
    await expect(call).toHaveAttribute("href", `tel:${PHONE}`);
  });

  test("email link opens the visitor's mail client", async ({ page }) => {
    const mail = page.locator('a[href^="mailto:"]').first();
    await expect(mail).toBeVisible();
    await expect(mail).toHaveAttribute("href", new RegExp(`^mailto:${EMAIL}`));
  });

  test("WhatsApp links use a digits-only number and open in a new tab", async ({ page }) => {
    const wa = page.locator('a[href*="wa.me"]');
    const count = await wa.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await wa.nth(i).getAttribute("href");
      // wa.me rejects "+" and spaces — it opens an empty chat instead of the
      // business account, with no visible error.
      expect(href).toMatch(new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}(\\?|$)`));
      expect(href).not.toContain("+");
      expect(href).not.toContain(" ");
      await expect(wa.nth(i)).toHaveAttribute("target", "_blank");
    }
  });

  test("the WhatsApp card opens a chat that is already started", async ({ page }) => {
    const card = page.locator('a[href*="wa.me"][href*="text="]').first();
    const href = await card.getAttribute("href");
    const text = decodeURIComponent(new URL(href!).searchParams.get("text") ?? "");
    expect(text).toContain("MudhoTech");
  });

  test('"Send via WhatsApp" carries the typed enquiry across', async ({ page }) => {
    await page.getByLabel("Name").fill("Tendai Moyo");
    await page.getByLabel("Email").fill("tendai@example.com");
    await page.getByLabel("Subject").fill("New website");
    await page.getByLabel("Message").fill("We need a booking system for our clinic.");

    // Asserting the href rather than opening the tab: the destination is
    // wa.me, so actually navigating would leave the test dependent on an
    // external service being reachable.
    const link = page.getByRole("link", { name: /send via whatsapp/i });
    await expect(link).toBeVisible();

    const url = new URL((await link.getAttribute("href"))!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);

    const text = decodeURIComponent(url.searchParams.get("text") ?? "");
    expect(text).toContain("Tendai Moyo");
    expect(text).toContain("tendai@example.com");
    expect(text).toContain("New website");
    expect(text).toContain("We need a booking system for our clinic.");
  });

  test("the WhatsApp send link stays usable before anything is typed", async ({ page }) => {
    const link = page.getByRole("link", { name: /send via whatsapp/i });
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
    expect(decodeURIComponent(url.searchParams.get("text") ?? "")).toContain("Hello MudhoTech");
  });

  test("the map is not loaded from Google until the visitor asks for it", async ({ page }) => {
    // The embed sets Google's cookies, so it stays out of the DOM until
    // requested — see src/components/layout/MapEmbed.tsx.
    await expect(page.locator('iframe[title*="office location" i]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: /open in google maps/i })).toBeVisible();
  });

  test("the embedded map points at the office once loaded", async ({ page }) => {
    await page.getByRole("button", { name: /load the map/i }).click();

    const map = page.locator('iframe[title*="office location" i]');
    await expect(map).toHaveCount(1);
    const src = await map.getAttribute("src");
    expect(src).toContain("Graniteside");
  });
});
