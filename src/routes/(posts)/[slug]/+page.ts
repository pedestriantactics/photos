export const prerender = false;

export async function load({ params, url }: { params: { slug: string }, url: URL }) {
  const data = await import(`../${params.slug}.md`)

	const {
		title,
		shootDate,
		description,
    images,
		slug = params.slug
  } = data.metadata

	if (data.metadata.images && data.metadata.images.length > 0) {
    // create a new list of images except in it add a "title" field that uses the fileName but strips the extension
    // for example, if the fileName is "hello.jpg", the title would be "hello"
    data.metadata.images = data.metadata.images.map((image: { fileName: string, imageTitle?: string, caption?: string }) => ({
      ...image,
      imageTitle: image.fileName.replace(/\.[^/.]+$/, "")
    }))
  }

	return {
	title,
	shootDate,
	description,
  images,
	slug
	}
}
