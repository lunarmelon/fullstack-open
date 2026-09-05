import { useState } from "react";

const Blog = ({ blog, addLike, removeBlog, user }) => {
	const [detailsVisible, setDetailsVisible] = useState(false);

	const isCreator = user.id === blog.user;
	console.log(blog.user);
	console.log(user.id);
	//console.log(isCreator);
	//console.log(user.username, blog.user.username);
	//console.log(user.name, blog.user.name);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const hideWhenVisible = {
		display: detailsVisible ? "none" : "",
	};
	const showWhenVisible = {
		display: detailsVisible ? "" : "none",
	};

	const updateBlog = (event) => {
		event.preventDefault();
		addLike(
			{
				user: blog?.user?._id,
				likes: blog.likes + 1,
				author: blog.author,
				title: blog.title,
				url: blog.url,
			},
			blog.id,
		);
	};

	const deleteBlog = (event) => {
		event.preventDefault();
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
			removeBlog(blog.id);
		}
	};

	return (
		<div>
			<div style={blogStyle}>
				{blog.title} {blog.author}
				<button style={hideWhenVisible} onClick={() => setDetailsVisible(true)}>
					view
				</button>
				<button
					style={showWhenVisible}
					onClick={() => setDetailsVisible(false)}
				>
					hide
				</button>
				<div style={showWhenVisible}>
					{blog.url}
					<br />
					likes {blog.likes} <button onClick={updateBlog}>like</button>
					<br />
					{blog?.user?.name}
					<br />
					{isCreator && <button onClick={deleteBlog}>remove</button>}
				</div>
			</div>
		</div>
	);
};

export default Blog;
