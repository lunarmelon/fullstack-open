import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";

describe("<Blog />", () => {
	const blog = {
		title: "Go To Statement Considered Harmful",
		author: "Athena Cykes",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 23,
		user: {
			id: "473298473829743892749b238457485734",
			name: "Miles Edgeworth",
		},
	};

	// test("only renders the blog's title and author by default", () => {
	// 	render(<Blog blog={blog} />);
	// 	expect(
	// 		screen.getByText(/Go To Statement Considered Harmful/),
	// 	).toBeVisible();
	// 	expect(screen.getByText(/Miles Edgeworth/)).toBeVisible();
	//
	// 	expect(screen.getByText(/homepages.cwi.nl/)).not.toBeVisible();
	// 	expect(screen.getByText(/likes 23/)).not.toBeVisible();
	// });
	//
	// test("after clicking the button, url and likes are displayed", async () => {
	// 	render(<Blog blog={blog} />);
	// 	const user = userEvent.setup();
	// 	const button = screen.getByText("view");
	// 	await user.click(button);
	//
	// 	expect(screen.getByText(/homepages.cwi.nl/)).toBeVisible();
	// 	expect(screen.getByText(/likes 23/)).toBeVisible();
	// });
	//
	// test("likes event handler is called twice if like button is clicked twice", async () => {
	// 	const like = vi.fn();
	// 	const user = userEvent.setup();
	//
	// 	render(<Blog blog={blog} addLike={like} />);
	//
	// 	const detailsButton = screen.getByText("view");
	// 	await user.click(detailsButton);
	//
	// 	const likeButton = screen.getByText("like");
	// 	await user.click(likeButton);
	// 	await user.click(likeButton);
	//
	// 	expect(like.mock.calls).toHaveLength(2);
	// });

	test("blog information is displayed to unauthenticated users, buttons are not", async () => {
		render(
			<MemoryRouter>
				<Blog blog={blog} user={null} />
			</MemoryRouter>,
		);

		const blogTitle = screen.getByText(/Go To Statement Considered Harmful/);
		const blogUrl = screen.getByText(/homepages.cwi.nl/);
		const blogLikes = screen.getByText(/likes 23/);
		const blogAuthor = screen.getByText(/Miles Edgeworth/);

		expect(blogTitle).toBeVisible();
		expect(blogUrl).toBeVisible();
		expect(blogLikes).toBeVisible();
		expect(blogAuthor).toBeVisible();

		const likeButton = screen.queryByRole("button", { name: "like" });
		const removeButton = screen.queryByRole("button", { name: "remove" });

		expect(likeButton).not.toBeInTheDocument();
		expect(removeButton).not.toBeInTheDocument();
	});

	test("authenticated users who are not the blog's creator are shown only the like button", async () => {
		const mockUser = {
			id: "473298473829743892749b2384",
			name: "Phoenix Wright",
			token: "578439754389754389754389.54389753489574389543",
			username: "flyingattorney",
		};

		render(
			<MemoryRouter>
				<Blog blog={blog} user={mockUser} />
			</MemoryRouter>,
		);

		const likeButton = screen.queryByRole("button", { name: "like" });
		const removeButton = screen.queryByRole("button", { name: "remove" });

		expect(likeButton).toBeVisible();
		expect(removeButton).not.toBeInTheDocument();
	});

	test("the blog's creator is shown the like and remove buttons", () => {
		const mockUser = {
			id: "473298473829743892749b238457485734",
			name: "Miles Edgeworth",
			token: "578439754389754389754389.543897534895743dsdhsa9543",
			username: "steelprosecutor",
		};

		render(
			<MemoryRouter>
				<Blog blog={blog} user={mockUser} />
			</MemoryRouter>,
		);

		const likeButton = screen.queryByRole("button", { name: "like" });
		const removeButton = screen.queryByRole("button", { name: "remove" });

		expect(likeButton).toBeVisible();
		expect(removeButton).toBeVisible();
	});
});
