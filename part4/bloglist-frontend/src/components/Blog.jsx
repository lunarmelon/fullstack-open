import { useParams } from "react-router-dom";

const Blog = ({ blog, addLike, removeBlog, user }) => {
	const id = useParams().id;

	if (!blog) {
		return null;
	}

	const isCreator = user?.id === blog.user || user?.id === blog.user?.id;

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
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
			id,
		);
	};

	const deleteBlog = (event) => {
		event.preventDefault();
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
			removeBlog(id);
		}
	};

	return (
		<div className="blog">
			<div style={blogStyle}>
				<h1>
					{blog.author}: {blog.title}
				</h1>
				<a href={blog.url}>{blog.url}</a>
				<br />
				likes {blog.likes} {user && <button onClick={updateBlog}>like</button>}
				<br />
				{blog?.user?.name}
				<br />
				{isCreator && user && <button onClick={deleteBlog}>remove</button>}
			</div>
		</div>
	);
};

export default Blog;
