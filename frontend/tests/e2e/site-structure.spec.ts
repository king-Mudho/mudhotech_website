import { test, expect } from "@playwright/test";

test("the homepage offers the two service paths up front", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Websites, systems & apps/ }).click();
  await expect(page).toHaveURL(/\/web-software$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Websites, Business Systems & Apps");

  await page.goto("/");
  await page.getByRole("link", { name: /IT support & repairs/ }).click();
  await expect(page).toHaveURL(/\/it-support$/);
});

test("problem cards land on the matching section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /How we fix it\s+for Networking & Connectivity/ }).click();
  await expect(page).toHaveURL(/\/it-support#networks$/);
  await expect(page.locator("#networks").getByRole("heading", { name: "Networks & Devices" })).toBeInViewport();
});

test("development and support services live on separate pages", async ({ page }) => {
  await page.goto("/web-software");
  await expect(page.getByRole("heading", { name: "E-Commerce Solutions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Core Software Installation & Setup" })).toHaveCount(0);

  await page.goto("/it-support");
  for (const id of ["repairs", "networks", "software", "request-support"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(
    page.locator("#software").getByRole("heading", { name: "Core Software Installation & Setup" }),
  ).toBeVisible();
});

test("payment claims carry the merchant-account caveat", async ({ page }) => {
  await page.goto("/web-software");
  await expect(page.getByText(/use your business's own merchant accounts/).first()).toBeVisible();
});

test("the portfolio shows no stock photography as client work", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const external: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "image" && !request.url().startsWith(origin)) external.push(request.url());
  });
  await page.goto("/portfolio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Our Work");
  await expect(page.getByRole("heading", { name: "No case studies published yet" })).toBeVisible();

  const examples = page.locator("li", { has: page.getByText("Illustrative example", { exact: true }) });
  await expect(examples.first()).toBeVisible();
  const count = await examples.count();
  expect(count).toBeGreaterThan(0);
  expect(external).toEqual([]);
});

test("the support request form asks for an optional phone number", async ({ page }) => {
  await page.goto("/it-support#request-support");
  await expect(page.getByLabel(/Phone or WhatsApp/)).toBeVisible();
});

test("the support request form takes the device and how to reach it", async ({ page }) => {
  await page.goto("/it-support#request-support");
  await expect(page.getByLabel(/Device or system/)).toBeVisible();
  const handover = page.getByRole("group", { name: /How should we get to it/ });
  await handover.getByRole("radio", { name: /Graniteside office/ }).check();
  await expect(handover.getByRole("radio", { name: /Graniteside office/ })).toBeChecked();
  await expect(handover.getByRole("radio")).toHaveCount(3);
});

test("the homepage states facts a visitor can check", async ({ page }) => {
  await page.goto("/");
  for (const fact of [/Graniteside, Harare/, /Mon–Fri 8 AM–5 PM/, /within one business day/i]) {
    await expect(page.locator("dl").getByText(fact)).toBeVisible();
  }
});

test("no cookie banner appears when analytics are not configured", async ({ page }) => {
  test.skip(!!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, "analytics configured in this environment");
  // Wait for hydration: a client-rendered banner would have appeared by then.
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "IT Support" }).click();
    await expect(page).toHaveURL(/\/it-support$/);
    await expect(menu).toBeHidden();
  });

  test("keeps every page free of horizontal scrolling", async ({ page }) => {
    for (const path of ["/", "/web-software", "/it-support", "/portfolio", "/contact", "/quote"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("homepage 3D background", () => {
  const globe = "section canvas[aria-hidden='true']";

  test("starts after load, stays out of the way, and animates", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator(globe);
    await expect(canvas).toHaveAttribute("data-ready", "true");
    await expect(canvas).toHaveCSS("pointer-events", "none");
    const frame = () => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    const first = await frame();
    await expect.poll(frame).not.toBe(first);
    // The hero's links stay clickable through it.
    await page.getByRole("link", { name: /IT support & repairs/ }).click();
    await expect(page).toHaveURL(/\/it-support$/);
  });

  test("holds still when the visitor asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const canvas = page.locator(globe);
    await expect(canvas).toHaveAttribute("data-ready", "true");
    const frame = () => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    const first = await frame();
    await page.waitForTimeout(500);
    expect(await frame()).toBe(first);
  });

  test("appears in every page's hero, so the pages match", async ({ page }) => {
    for (const path of ["/it-support", "/about", "/blog"]) {
      await page.goto(path);
      await expect(page.locator(globe)).toHaveCount(1);
    }
  });
});
