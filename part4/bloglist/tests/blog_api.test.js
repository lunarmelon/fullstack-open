const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	let blogObject = new Blog(helper.initialBlogs[0]);
	await blogObject.save();

	blogObject = new Blog(helper.initialBlogs[1]);
	await blogObject.save();
});

test("blog posts are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
});

test("all blogs returned", async () => {
	const response = await api.get("/api/blogs");

	assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog can be viewed", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToView = blogsAtStart[0];

	const resultBlog = await api
		.get(`/api/blogs/${blogToView.id}`)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("a valid blog can be added", async () => {
	const newBlog = {
		title: "Go To Statement Considered Harmful",
		author: "Miles Edgeworth",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 23,
	};

	await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const response = await api.get("/api/blogs");

	const contents = response.body.map((r) => r.author);

	assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

	assert(contents.includes("Miles Edgeworth"));
});

after(async () => {
	await mongoose.connection.close();
});
