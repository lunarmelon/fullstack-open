const { test, expect, beforeEach, describe } = require("@playwright/test");
const { createBlog, loginWith } = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("api/testing/reset");
		await request.post("/api/users", {
			data: {
				name: "Phoenix Wright",
				username: "flyingattorney",
				password: "edgelove",
			},
		});
		await request.post("/api/users", {
			data: {
				name: "Athena Cykes",
				username: "metisapollo",
				password: "blackquill",
			},
		});

		await page.goto("/");
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
			await loginWith(page, "flyingattorney", "edgelove");
		});

		test("a new blog can be created", async ({ page }) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await createBlog(
				page,
				"Blog 1",
				"Diego Armando",
				"https://neocities.org",
			);

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();
		});

		test("a blog can be liked", async ({ page }) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await createBlog(
				page,
				"Blog 1",
				"Diego Armando",
				"https://neocities.org",
			);

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
			await createBlog(
				page,
				"Blog 1",
				"Diego Armando",
				"https://neocities.org",
			);

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
			await createBlog(
				page,
				"Blog 1",
				"Diego Armando",
				"https://neocities.org",
			);

			await expect(
				page.getByText("a new blog Blog 1 by Diego Armando added"),
			).toBeVisible();
			await expect(page.getByText("Blog 1 Diego Armando")).toBeVisible();

			await page.getByRole("button", { name: "view" }).click();
			await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

			await page.getByRole("button", { name: "logout" }).click();

			await loginWith(page, "metisapollo", "blackquill");

			await page.getByRole("button", { name: "view" }).click();
			await expect(
				page.getByRole("button", { name: "remove" }),
			).not.toBeVisible();
		});

		test("blogs are arranged by the number of likes, the blog with most likes first", async ({
			page,
		}) => {
			await page.getByRole("button", { name: "create blog" }).click();
			await createBlog(
				page,
				"Blog 1",
				"Diego Armando",
				"https://neocities.org",
			);
			await createBlog(page, "Blog 2", "Mia Fey", "https://google.com");
			await createBlog(page, "Blog 3", "Trucy Wright", "https://x.com");

			const blog1 = page.locator(".blog").filter({ hasText: "Blog 1" });

			await blog1.getByRole("button", { name: "view" }).click();
			await blog1.getByRole("button", { name: "like" }).click();
			await blog1.getByText("likes 1").waitFor();
			await blog1.getByRole("button", { name: "like" }).click();
			await blog1.getByText("likes 2").waitFor();

			var blog3 = page.locator(".blog").filter({ hasText: "Blog 3" });
			await blog3.getByRole("button", { name: "view" }).click();
			await blog3.getByRole("button", { name: "like" }).click();
			await blog3.getByText("likes 1").waitFor();

			const blogElements = page.locator(".blog");

			await expect(blogElements.nth(0)).toContainText("Blog 1");
			await expect(blogElements.nth(1)).toContainText("Blog 3");
			await expect(blogElements.nth(2)).toContainText("Blog 2");
		});
	});
});
