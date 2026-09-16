import { test, expect } from "@playwright/test";

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contact");

  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByLabel("Subject").fill("E2E contact test");
  await page.getByLabel("Message").fill("This message was submitted by the Playwright e2e suite.");

  const response = page.waitForResponse(
    (res) => res.url().includes("/api/submissions/contact") && res.request().method() === "POST",
  );
  await page.getByRole("button", { name: /send message/i }).click();

  expect((await response).status()).toBe(200);
  await expect(page.getByText(/message sent/i)).toBeVisible();
});

test("contact form blocks invalid input client-side", async ({ page }) => {
  await page.goto("/contact");

  let requestFired = false;
  page.on("request", (req) => {
    if (req.url().includes("/api/submissions/contact")) requestFired = true;
  });

  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/valid email address/i)).toBeVisible();
  expect(requestFired).toBe(false);
});

test("quote form submits successfully", async ({ page }) => {
  await page.goto("/quote");

  await page.getByLabel("Name").fill("E2E Quoter");
  await page.getByLabel("Email").fill("quote-e2e@example.com");

  await page.getByLabel("Service Needed").click();
  await page.getByRole("option", { name: "Web Development" }).click();

  await page.getByLabel("Project Description").fill("Please quote for a small business website with a blog.");

  const response = page.waitForResponse(
    (res) => res.url().includes("/api/submissions/quote") && res.request().method() === "POST",
  );
  await page.getByRole("button", { name: /request a quote/i }).click();

  expect((await response).status()).toBe(200);
  await expect(page.getByText(/quote request sent/i)).toBeVisible();
});

test("blog search filters posts and a post opens with related articles", async ({ page }) => {
  await page.goto("/blog");

  await expect(page.getByRole("heading", { name: /5 Signs Your Business Needs/i })).toBeVisible();

  await page.getByPlaceholder("Search articles…").fill("cloud");
  await expect(page.getByRole("heading", { name: /Benefits of Cloud Computing/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /5 Signs Your Business Needs/i })).toHaveCount(0);

  await page.getByRole("heading", { name: /Benefits of Cloud Computing/i }).click();
  await expect(page).toHaveURL(/\/blog\/cloud-computing-small-businesses/);
  await expect(page.getByRole("heading", { name: "Related Articles" })).toBeVisible();
});

test("unknown routes render the 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});

test("unknown blog slug renders the 404 page", async ({ page }) => {
  const response = await page.goto("/blog/no-such-post");
  expect(response?.status()).toBe(404);
});

test("sitemap includes every blog slug", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);

  const xml = await response.text();
  for (const slug of [
    "business-digital-transformation",
    "protect-business-cyber-threats",
    "cloud-computing-small-businesses",
    "school-management-systems",
  ]) {
    expect(xml).toContain(`/blog/${slug}`);
  }
});
