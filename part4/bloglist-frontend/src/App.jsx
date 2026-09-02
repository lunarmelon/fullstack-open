import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");
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

	const addBlog = (event) => {
		event.preventDefault();
		const blogObject = {
			title: title,
			author: author,
			url: url,
		};

		blogService.create(blogObject).then((returnedBlog) => {
			setBlogs(blogs.concat(returnedBlog));
			setTitle("");
			setAuthor("");
			setUrl("");
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
			console.log("wrong credentials");
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

	const blogForm = () => (
		<form onSubmit={addBlog}>
			<h2>create new</h2>
			<label>
				title
				<input
					type="text"
					value={title}
					onChange={({ target }) => setTitle(target.value)}
				/>
			</label>
			<br />
			<label>
				author
				<input
					type="text"
					value={author}
					onChange={({ target }) => setAuthor(target.value)}
				/>
			</label>
			<br />
			<label>
				url
				<input
					type="text"
					value={url}
					onChange={({ target }) => setUrl(target.value)}
				/>
			</label>
			<br />
			<button type="submit">create</button>
		</form>
	);

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
