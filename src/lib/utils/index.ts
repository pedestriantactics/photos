export const fetchMarkdownPosts = async () => {
  const allPostFiles = import.meta.glob('/src/routes/\\(posts\\)/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
      const postPath = path.slice(11, -3);
      const postSlug = path.split('/').at(-1)?.replace('.md', '')

			return {
				meta: metadata,
        path: postPath,
        slug: postSlug
			};
		})
	);

	return allPosts;
};
