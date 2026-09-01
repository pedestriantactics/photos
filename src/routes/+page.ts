
export let prerender = false;

export async function load(data: unknown) {
  const allPostFiles = import.meta.glob("./(posts)/*.md");
  console.log(allPostFiles)
    const iterablePostFiles = Object.entries(allPostFiles)

    const allPosts = await Promise.all(
        iterablePostFiles.map(async ([path, resolver]) => {
            const { metadata } = await resolver() as {
				// we only need the data for the grid
          metadata: {
            title: string,
		shootDate: string,
		images: {
			fileName: string
		}[]
                }
            };

          const postPath = path.replace('./', '').replace('.md', '')

            if (!metadata) {
                // log to the console
                throw new Error(`No metadata found for ${path}`);
            }

            return {
                formattedDate: metadata.shootDate,
                title: metadata.title || "",
                // category: metadata.category || "",
                images: metadata.images || [],
                postPath: postPath,
            };
        }),
    );
    // Sort posts by date
    const sortedPosts = allPosts.sort((a, b) => new Date(b.formattedDate).getTime() - new Date(a.formattedDate).getTime()).slice();
    return { data: sortedPosts };
}
