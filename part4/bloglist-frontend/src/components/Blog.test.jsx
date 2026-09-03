import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
	const blog = {
		title: "Go To Statement Considered Harmful",
		author: "Miles Edgeworth",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 23,
	};
	beforeEach(() => {
		render(<Blog blog={blog} />);
	});

	test("<Blog/> only renders the blog's title and author by default", () => {
		expect(
			screen.getByText(/Go To Statement Considered Harmful/),
		).toBeVisible();
		expect(screen.getByText(/Miles Edgeworth/)).toBeVisible();

		expect(screen.getByText(/homepages.cwi.nl/)).not.toBeVisible();
		expect(screen.getByText(/likes 23/)).not.toBeVisible();
	});
});
