import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
	const blog = {
		title: "Go To Statement Considered Harmful",
		author: "Miles Edgeworth",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 23,
	};

	test("only renders the blog's title and author by default", () => {
		render(<Blog blog={blog} />);
		expect(
			screen.getByText(/Go To Statement Considered Harmful/),
		).toBeVisible();
		expect(screen.getByText(/Miles Edgeworth/)).toBeVisible();

		expect(screen.getByText(/homepages.cwi.nl/)).not.toBeVisible();
		expect(screen.getByText(/likes 23/)).not.toBeVisible();
	});

	test("after clicking the button, url and likes are displayed", async () => {
		render(<Blog blog={blog} />);
		const user = userEvent.setup();
		const button = screen.getByText("view");
		await user.click(button);

		expect(screen.getByText(/homepages.cwi.nl/)).toBeVisible();
		expect(screen.getByText(/likes 23/)).toBeVisible();
	});

	test("likes event handler is called twice if like button is clicked twice", async () => {
		const like = vi.fn();
		const user = userEvent.setup();

		render(<Blog blog={blog} addLike={like} />);

		const detailsButton = screen.getByText("view");
		await user.click(detailsButton);

		const likeButton = screen.getByText("like");
		await user.click(likeButton);
		await user.click(likeButton);

		expect(like.mock.calls).toHaveLength(2);
	});
});
