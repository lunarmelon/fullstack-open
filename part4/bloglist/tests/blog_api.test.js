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

test("missing likes property defaults to 0", async () => {
	const newBlog = {
		title: "Go To Statement Considered Harmful",
		author: "Miles Edgeworth",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
	};

	const addedBlog = await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	assert.strictEqual(addedBlog.body.likes, 0);
});

test("blog without title or url is not added", async () => {
	const newBlog = {
		author: "Athena Cykes",
	};

	await api.post("/api/blogs").send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();

	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("a blog can be deleted", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToDelete = blogsAtStart[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAtEnd = await helper.blogsInDb();

	const ids = blogsAtEnd.map((b) => b.id);
	assert(!ids.includes(blogToDelete.id));

	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("a blog can be updated", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToUpdate = blogsAtStart[1];

	const updatedData = {
		title: blogToUpdate.title,
		author: blogToUpdate.author,
		url: blogToUpdate.url,
		likes: 23,
	};

	const updatedBlog = await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send(updatedData)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	assert(updatedBlog.body.likes, 9);
});

after(async () => {
	await mongoose.connection.close();
});
