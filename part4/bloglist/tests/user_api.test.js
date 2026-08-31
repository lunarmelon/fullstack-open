const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("secret", 10);
		const user = new User({ username: "root", passwordHash });

		await user.save();
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "steelprosecutor",
			name: "Miles Edgeworth",
			password: "wrightlove",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(usernames.includes(newUser.username));
	});

	test("a user is not created if username or password are missing", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: "Apollo Justice",
			password: "klapollo",
		};

		await api.post("/api/users").send(newUser).expect(400);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length);

		const names = usersAtEnd.map((u) => u.name);
		assert(!names.includes(newUser.name));
	});

	test("a user is not created if username or password are not at least 3 characters long", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "ms",
			name: "Apollo Justice",
			password: "kla",
		};

		await api.post("/api/users").send(newUser).expect(400);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(!usernames.includes(newUser.username));
	});

	after(async () => {
		await mongoose.connection.close();
	});
});
