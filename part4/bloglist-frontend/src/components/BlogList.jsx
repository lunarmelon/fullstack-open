import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
	const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
	return (
		<div>
			<h1>Blogs</h1>
			<ul>
				{sortedBlogs.map((blog) => (
					<li key={blog.id}>
						<Link to={`/blogs/${blog.id}`}>
							{blog.title} by {blog.author}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BlogList;
