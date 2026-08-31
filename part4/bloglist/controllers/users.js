const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

usersRouter.post("/", async (request, response) => {
	const { username, name, password } = request.body;

	if (!username || !password) {
		response.status(400).json({ error: "username or password missing" });
	}

	if (username.length >= 3 && password.length >= 3) {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		response.status(201).json(savedUser);
	} else {
		response.status(400).json({
			error: "username and password must be at least 3 characters long",
		});
	}
});

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		url: 1,
		title: 1,
		author: 1,
	});

	response.json(users);
});

module.exports = usersRouter;
