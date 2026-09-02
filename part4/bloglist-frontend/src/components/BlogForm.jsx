const BlogForm = (props) => (
	<form onSubmit={props.handleSubmit}>
		<h2>create new</h2>
		<label>
			title
			<input
				type="text"
				value={props.title}
				onChange={props.handleTitleChange}
			/>
		</label>
		<br />
		<label>
			author
			<input
				type="text"
				value={props.author}
				onChange={props.handleAuthorChange}
			/>
		</label>
		<br />
		<label>
			url
			<input type="text" value={props.url} onChange={props.handleUrlChange} />
		</label>
		<br />
		<button type="submit">create</button>
	</form>
);

export default BlogForm;
