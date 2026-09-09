import { Button, TextField } from "@mui/material";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const addBlog = (event) => {
		event.preventDefault();
		createBlog({
			title: title,
			author: author,
			url: url,
		});

		setTitle("");
		setAuthor("");
		setUrl("");
	};

	return (
		<form onSubmit={addBlog}>
			<h2>create new</h2>
			<TextField
				label="title"
				value={title}
				onChange={({ target }) => setTitle(target.value)}
			/>
			<br />
			<TextField
				label="author"
				value={author}
				onChange={({ target }) => setAuthor(target.value)}
				style={{ marginTop: 10 }}
			/>
			<br />
			<TextField
				label="url"
				value={url}
				onChange={({ target }) => setUrl(target.value)}
				style={{ marginTop: 10 }}
			/>
			<br />
			<Button type="submit" variant="contained" style={{ marginTop: 10 }}>
				create
			</Button>
		</form>
	);
};

export default BlogForm;
