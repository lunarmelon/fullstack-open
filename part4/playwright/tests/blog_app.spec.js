const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("http://localhost:3003/api/testing/reset");
		await request.post("http://localhost:3003/api/users", {
			data: {
				name: "Phoenix Wright",
				username: "flyingattorney",
				password: "edgelove",
			},
		});
		await request.post("http://localhost:3003/api/users", {
			data: {
				name: "Athena Cykes",
				username: "metisapollo",
				password: "blackquill",
			},
		});

		await page.goto("http://localhost:5173");
	});

	test("Login form is shown", async ({ page }) => {
		const locator = page.getByText("Login").first();
		await expect(locator).toBeVisible();
	});

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			await page.getByRole("button", { name: "login" }).click();
			await page.getByLabel("username").fill("flyingattorney");
			await page.getByLabel("password").fill("edgelove");
			await page.getByRole("button", { name: "login" }).click();

			await expect(page.getByText("Phoenix Wright logged in")).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await page.getByRole("button", { name: "login" }).click();
			await page.getByLabel("username").fill("flyingattorney");
			await page.getByLabel("password").fill("wrong");
			await page.getByRole("button", { name: "login" }).click();

			await expect(page.getByText("wrong credentials")).toBeVisible();
		});
	});

	describe("When logged in", () => {
		beforeEach(async ({ page }) => {
			await page.getByRole("button", { name: "login" }).click();
			await page.getByLabel("username").fill("flyingattorney");
			await page.getByLabel("password").fill("edgelove");
			await page.getByRole("button", { name: "login" }).click();
		});

		test("a new blog can be created", async ({ page }) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await page.getByLabel("title").fill("Blog 1");
			await page.getByLabel("author").fill("Diego Armando");
			await page.getByLabel("url").fill("https://neocities.org");
			await page.getByRole("button", { name: "create" }).click();

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();
		});

		test("a blog can be liked", async ({ page }) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await page.getByLabel("title").fill("Blog 1");
			await page.getByLabel("author").fill("Diego Armando");
			await page.getByLabel("url").fill("https://neocities.org");
			await page.getByRole("button", { name: "create" }).click();

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();

			await page.getByRole("button", { name: "view" }).click();
			await page.getByRole("button", { name: "like" }).click();
			await expect(page.getByText("likes 1")).toBeVisible();
		});

		test("the user can delete a blog", async ({ page }) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await page.getByLabel("title").fill("Blog 1");
			await page.getByLabel("author").fill("Diego Armando");
			await page.getByLabel("url").fill("https://neocities.org");
			await page.getByRole("button", { name: "create" }).click();

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();

			await page.getByRole("button", { name: "view" }).click();
			page.on("dialog", (dialog) => dialog.accept());
			await page.getByRole("button", { name: "remove" }).click();

			await expect(page.getByText("Blog 1 Diego Armando")).not.toBeVisible();
		});

		test("only the user who added the blog can see the remove button", async ({
			page,
		}) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await page.getByLabel("title").fill("Blog 1");
			await page.getByLabel("author").fill("Diego Armando");
			await page.getByLabel("url").fill("https://neocities.org");
			await page.getByRole("button", { name: "create" }).click();

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();

			await page.getByRole("button", { name: "view" }).click();
			await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

			await page.getByRole("button", { name: "logout" }).click();

			await page.getByRole("button", { name: "login" }).click();
			await page.getByLabel("username").fill("metisapollo");
			await page.getByLabel("password").fill("blackquill");
			await page.getByRole("button", { name: "login" }).click();

			await page.getByRole("button", { name: "view" }).click();
			await expect(
				page.getByRole("button", { name: "remove" }),
			).not.toBeVisible();
		});
	});
});
