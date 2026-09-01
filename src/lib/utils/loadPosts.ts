// DATA: this is where posts are currently loaded from
import { writable } from 'svelte/store';

export const postsStore = writable<Post[]>([]);

interface Post {
    filename: string;
	shootDate: string;
	postDate: string;
	title: string;
    description: string;
    hidden: boolean;
	previewImage: string;
    images: string[];
	tags: string[];
}

let isLoaded = false;

// Helper function to format date as yyyy-mm-dd
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function loadPosts() {
    // if (isLoaded) {
    //     return get(postsStore);
    // }

    const allPostFiles = import.meta.glob("/src/posts/*.md");
    // console.log(allPostFiles);
    const iterablePostFiles = Object.entries(allPostFiles);

    const allPosts = await Promise.all(
        iterablePostFiles.map(async ([path, resolver]) => {
            const { metadata } = await resolver() as {
                metadata: {
                    shootDate: string, postDate: string, title: string, description: string, hidden: boolean, previewImage: string, images: string[], tags: string[]
                }
            };

            const postPath = path.replace('/src/posts/', '').replace('.md', '');

            if (!metadata) {
                throw new Error(`No metadata found for ${path}`);
            }

            const updatedImages = metadata.images.map(image => `/images/${postPath}/${image}`);
			
			// also add the image path to the preview image
			const updatedPreviewImage = `/images/${postPath}/${metadata.previewImage}`;

			// tags could be blank
			if (!metadata.tags) {
				metadata.tags = [];
			}
			
            return {
                filename: postPath,
                shootDate: formatDate(metadata.shootDate),
                postDate: formatDate(metadata.postDate),
                title: metadata.title,
                description: metadata.description || "",
                hidden: metadata.hidden || false,
                tags: metadata.tags,
				previewImage: updatedPreviewImage,
                images: updatedImages
            };
        }),
    );

	// changing this so it doesn't filter visible posts here, otherwise you can't permalink
    // const visiblePosts = allPosts.filter(post => !post.hidden);
    const visiblePosts = allPosts;

    postsStore.set(visiblePosts);
    isLoaded = true;

    return visiblePosts;
}