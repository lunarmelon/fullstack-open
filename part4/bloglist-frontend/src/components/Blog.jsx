import { Button, Card, CardContent, Typography } from "@mui/material";
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

	const buttonStyle = { background: "rgb(255, 0, 0)" };

	return (
		<div className="blog">
			<Card variant="outlined" sx={{ marginTop: 1 }}>
				<CardContent>
					<Typography variant="h4">{blog.title}</Typography>
					<p>by {blog.author}</p>
					<p>
						<a href={blog.url}>{blog.url}</a>
					</p>
					<p>Added by {blog?.user?.name}</p>
					{blog.likes} likes
					{user && (
						<Button
							color="inherit"
							onClick={updateBlog}
							sx={{
								color: "blue", // Matches text color
								borderColor: "blue", // Matches border color
								borderWidth: 1, // Slightly thicker border to match the image
								borderRadius: "5px", // Subtle rounded corners
								borderStyle: "solid",
								margin: 1,
							}}
						>
							like
						</Button>
					)}
					{isCreator && user && (
						<Button
							onClick={deleteBlog}
							sx={{
								color: "red", // Matches text color
								borderColor: "red", // Matches border color
								borderWidth: 1, // Slightly thicker border to match the image
								borderRadius: "5px", // Subtle rounded corners
								borderStyle: "solid",
								margin: 1,
							}}
						>
							remove
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Blog;
