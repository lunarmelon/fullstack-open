const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
	beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5173");
	});

	test("login form is shown", async ({ page }) => {
		const locator = page.getByText("Login").first();
		await expect(locator).toBeVisible();
	});
});
