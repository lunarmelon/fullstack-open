import { useState } from "react";

const Blog = ({ blog, addLike }) => {
	const [detailsVisible, setDetailsVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const hideWhenVisible = {
		...blogStyle,
		display: detailsVisible ? "none" : "",
	};
	const showWhenVisible = {
		...blogStyle,
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

	return (
		<div>
			<div style={hideWhenVisible}>
				{blog.title} {blog.author}
				<button onClick={() => setDetailsVisible(true)}>view</button>
			</div>
			<div style={showWhenVisible}>
				{blog.title} {blog.author}
				<button onClick={() => setDetailsVisible(false)}>hide</button>
				<br />
				{blog.url}
				<br />
				likes {blog.likes} <button onClick={updateBlog}>like</button>
				<br />
				{blog?.user?.name}
			</div>
		</div>
	);
};

export default Blog;

