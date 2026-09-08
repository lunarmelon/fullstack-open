import { useEffect, useState } from "react";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
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
	const navigate = useNavigate();

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
		blogService.getAll().then((blogs) => setBlogs(blogs));
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
		navigate("/");
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
		navigate("/");
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
			navigate("/");
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
		setUser(null);
		blogService.setToken(null);
		navigate("/login");
	};

	const padding = {
		padding: 5,
	};
	console.log(user);
	const match = useMatch("/blogs/:id");
	const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

	return (
		<div>
			<Notification className="notification" message={message} />
			<div>
				<Link style={padding} to="/">
					blogs
				</Link>
				{!user && (
					<Link style={padding} to="/login">
						login
					</Link>
				)}
				{user && (
					<Link style={padding} to="/create">
						new blog
					</Link>
				)}
				{user && (
					<button style={padding} onClick={handleLogout}>
						logout
					</button>
				)}
			</div>
			<Routes>
				<Route path="/create" element={<BlogForm createBlog={addBlog} />} />
				<Route
					path="/blogs/:id"
					element={
						<Blog
							blog={blog}
							addLike={updateBlog}
							removeBlog={deleteBlog}
							user={user}
						/>
					}
				/>
				<Route
					path="/login"
					element={
						!user && (
							<LoginForm
								handleLogin={handleLogin}
								username={username}
								password={password}
								handleUsername={({ target }) => setUsername(target.value)}
								handlePassword={({ target }) => setPassword(target.value)}
							/>
						)
					}
				/>
				<Route
					path="/"
					element={
						<div className="bloglist">
							<BlogList
								blogs={blogs}
								updateBlog={updateBlog}
								deleteBlog={deleteBlog}
								user={user}
							/>
						</div>
					}
				/>
			</Routes>
		</div>
	);
};

export default App;
