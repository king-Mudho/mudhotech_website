import { test, expect } from "@playwright/test";

const ADMIN_USER = process.env.E2E_ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "DevAdmin123!";

// These tests share one admin account and one set of lead rows: they sign in
// repeatedly, seed submissions, and mutate statuses that sibling tests then
// list. Run in parallel they race each other (and pile onto the login
// endpoint's rate limit), which produced intermittent failures.
test.describe.configure({ mode: "serial" });

test("unauthenticated visit to /admin redirects to the login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login\?redirect=%2Fadmin/);
  await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
});

test("admin API rejects unauthenticated requests", async ({ request }) => {
  const response = await request.get("/api/admin/submissions?type=contact");
  expect(response.status()).toBe(401);
});

test("admin can sign in and reach the dashboard", async ({ page }) => {
  await page.goto("/admin/login");

  await page.getByLabel("Username").fill(ADMIN_USER);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Lead Dashboard" })).toBeVisible();
});

test("admin can change a lead status and it persists", async ({ page }) => {
  // Unique per run: this test seeds a real row and the suite has no teardown,
  // so a fixed name accumulates duplicates across runs and every locator for
  // it becomes ambiguous.
  const stamp = Date.now();
  const name = `Status Test ${stamp}`;
  const email = `status-test-${stamp}@example.com`;

  // Seed through the real public pipeline rather than the database, so this
  // exercises the same path a visitor takes.
  await page.goto("/contact");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Subject").fill("Status change e2e");
  await page.getByLabel("Message").fill("Seeded by the e2e suite to test status changes.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/message sent/i)).toBeVisible();

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USER);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByRole("heading", { name: "Lead Dashboard" })).toBeVisible();

  await page.getByPlaceholder("Search…").fill(email);
  await expect(page.getByRole("cell", { name, exact: true })).toBeVisible();

  await page.getByLabel(`Change status for ${name}`).click();
  await page.getByRole("option", { name: "Read" }).click();

  // Reload rather than trusting the optimistic UI — this asserts the change
  // actually reached the database.
  await page.reload();
  await page.getByPlaceholder("Search…").fill(email);
  await expect(page.getByLabel(`Change status for ${name}`)).toContainText(/read/i);
});

test("admin dashboard tabs all render", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USER);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByRole("heading", { name: "Lead Dashboard" })).toBeVisible();

  await page.getByRole("tab", { name: "Analytics" }).click();
  await expect(page.getByText("Total Contacts")).toBeVisible();

  await page.getByRole("tab", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Email Notifications" })).toBeVisible();

  await page.getByRole("tab", { name: /^Quotes/ }).click();
  await expect(page.getByRole("columnheader", { name: "Service" })).toBeVisible();
});

test("signing out restores the login redirect", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USER);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByRole("heading", { name: "Lead Dashboard" })).toBeVisible();

  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
