import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogFormVisible, setBlogFormVisible] = useState(false);
	const [blogs, setBlogs] = useState([]);
	const [message, setMessage] = useState(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const addBlog = (blogObject) => {
		blogService.create(blogObject).then((returnedBlog) => {
			setBlogs(blogs.concat(returnedBlog));
			setMessage(
				`a new blog ${blogObject.title} by ${blogObject.author} added`,
			);
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		});
	};

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername("");
			setPassword("");
		} catch {
			setMessage("wrong credentials");
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	};

	const handleLogout = async (event) => {
		event.preventDefault();
		window.localStorage.removeItem("loggedBlogappUser");
	};

	const loginForm = () => (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>
						username{" "}
						<input
							type="text"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="text"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);

	const blogForm = () => {
		const hideWhenVisible = { display: blogFormVisible ? "none" : "" };
		const showWhenVisible = { display: blogFormVisible ? "" : "none" };

		return (
			<div>
				<div style={hideWhenVisible}>
					<button onClick={() => setBlogFormVisible(true)}>
						create new blog
					</button>
				</div>
				<div style={showWhenVisible}>
					<BlogForm createBlog={addBlog} />
					<button onClick={() => setBlogFormVisible(false)}>cancel</button>
				</div>
			</div>
		);
	};

	const blogList = () => (
		<div>
			<h2>blogs</h2>
			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	);

	return (
		<div>
			<Notification message={message} />
			{!user && loginForm()}
			{user && (
				<div>
					<p>{user.name} logged in</p>
					<button onClick={handleLogout}>logout</button>
					{blogForm()}
				</div>
			)}
			{user && blogList()}
		</div>
	);
};

export default App;
