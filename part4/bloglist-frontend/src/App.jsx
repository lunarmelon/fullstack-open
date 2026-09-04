import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
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

	const updateBlog = (blogObject, id) => {
		blogService.update(blogObject, id).then((returnedBlog) => {
			setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
			blogService.getAll().then((blogs) => setBlogs(blogs));
		});
	};

	const deleteBlog = (id) => {
		blogService.remove(id);
		blogService.getAll().then((blogs) => setBlogs(blogs));
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

	const blogForm = () => (
		<Togglable buttonLabel="create blog">
			<BlogForm createBlog={addBlog} />
		</Togglable>
	);

	const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
	const blogList = () => (
		<div>
			<h2>blogs</h2>
			{sortedBlogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					addLike={updateBlog}
					removeBlog={deleteBlog}
				/>
			))}
		</div>
	);

	return (
		<div>
			<Notification className="notification" message={message} />
			{!user && loginForm()}
			{user && (
				<div>
					<p>{user.name} logged in</p>
					<button onClick={handleLogout}>logout</button>
					{blogForm()}
				</div>
			)}
			<div className="bloglist">{user && blogList()}</div>
		</div>
	);
};

export default App;
