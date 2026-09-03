import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
	test("event handler is called with the right details when a new blog is created", async () => {
		const createBlog = vi.fn();
		const user = userEvent.setup();

		render(<BlogForm createBlog={createBlog} />);

		const titleInput = screen.getByLabelText("title");
		const authorInput = screen.getByLabelText("author");
		const urlInput = screen.getByLabelText("url");
		const sendButton = screen.getByText("create");

		await user.type(titleInput, "New blog");
		await user.type(authorInput, "Apollo Justice");
		await user.type(urlInput, "http://neocities.org");
		await user.click(sendButton);

		expect(createBlog.mock.calls).toHaveLength(1);
		expect(createBlog.mock.calls[0][0].title).toBe("New blog");
		expect(createBlog.mock.calls[0][0].author).toBe("Apollo Justice");
		expect(createBlog.mock.calls[0][0].url).toBe("http://neocities.org");
	});
});
