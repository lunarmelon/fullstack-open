const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogList) => {
	const likeSum = blogList.reduce(
		(sum, currentBlog) => sum + currentBlog.likes,
		0,
	);

	return likeSum;
};

module.exports = { dummy, totalLikes };
