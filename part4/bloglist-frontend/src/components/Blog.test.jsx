import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("<Blog/> only renders the blog's title and author by default", () => {
	const blog = {
		title: "Go To Statement Considered Harmful",
		author: "Miles Edgeworth",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 23,
	};

	render(<Blog blog={blog} />);

	const element = screen.getByText(
		"Go To Statement Considered Harmful Miles Edgeworth",
	);
	expect(element).toBeDefined();
});
