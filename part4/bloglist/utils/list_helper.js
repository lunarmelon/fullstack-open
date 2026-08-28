const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const likeSum = blogs.reduce(
		(sum, currentBlog) => sum + currentBlog.likes,
		0,
	);

	return likeSum;
};

const favoriteBlog = (blogs) => {
	if (blogs.length > 0) {
		const mostLiked = blogs.reduce(
			(largest, current) => (current.likes > largest.likes ? current : largest),
			blogs[0],
		);

		return mostLiked;
	} else {
		return {};
	}
};

module.exports = { dummy, totalLikes, favoriteBlog };
