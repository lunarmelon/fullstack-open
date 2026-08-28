const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	assert.strictEqual(result, 1);
});

describe("total likes", () => {
	const listWithOneBlog = [
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 5,
			__v: 0,
		},
	];

	const biggerList = [
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 54,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17f9",
			title: "Blog 2",
			author: "Phoenix Wright",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 9,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17e8",
			title: "Go To Statement Considered Harmful",
			author: "Apollo Justice",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 52,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17l8",
			title: "Go To Statement Considered Harmful",
			author: "Miles Edgeworth",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 23,
			__v: 0,
		},
		{
			_id: "5a422aa71b54a676234d17a8",
			title: "Go To Statement Considered Harmful",
			author: "Franziska von Karma",
			url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
			likes: 12,
			__v: 0,
		},
	];

	test("of empty list is zero", () => {
		const result = listHelper.totalLikes([]);
		assert.strictEqual(result, 0);
	});

	test("when list has only one blog, equals the likes of that", () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		assert.strictEqual(result, 5);
	});

	test("of a bigger list is calculated right", () => {
		const result = listHelper.totalLikes(biggerList);
		assert.strictEqual(result, 150);
	});
});
