import { AppBar, Button, Container, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [notification, setNotification] = useState(null);
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
			setNotification({
				text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
				type: "success",
			});
			setTimeout(() => {
				setNotification(null);
			}, 4000);
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
			setNotification({ text: `${user.name} logged in`, type: "success" });
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		} catch {
			setNotification({ text: "wrong credentials", type: "error" });
			setTimeout(() => {
				setNotification(null);
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

	const match = useMatch("/blogs/:id");
	const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

	const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

	return (
		<Container>
			<AppBar position="static">
				<Toolbar>
					<Button color="inherit" component={Link} to="/" sx={style}>
						blogs
					</Button>
					{!user && (
						<Button color="inherit" component={Link} to="/login" sx={style}>
							login
						</Button>
					)}
					{user && (
						<Button color="inherit" component={Link} to="/create" sx={style}>
							new blog
						</Button>
					)}
					{user && (
						<Button color="inherit" onClick={handleLogout} sx={style}>
							logout
						</Button>
					)}
				</Toolbar>
			</AppBar>
			<Notification className="notification" notification={notification} />
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
		</Container>
	);
};

export default App;
