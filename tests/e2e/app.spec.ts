import { expect, test } from "@playwright/test";

test.describe("AI Job Tracker smoke flows", () => {
  test("loads the public home page", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "AI Job Tracker" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in or register" })).toHaveAttribute("href", "/auth");
  });

  test("supports persistent dark mode", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle color mode" });

    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("shows the analytics empty state without tracked companies", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem("ai-job-tracker-companies"));
    await page.goto("/analytics");

    await expect(page.getByRole("heading", { name: "Search analytics" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Analytics will appear here" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Add a company" })).toHaveAttribute("href", "/company-tracker");
  });
});
