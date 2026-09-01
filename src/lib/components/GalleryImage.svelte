<!-- <script lang="ts">
	export let photo: Pick<Photo, "imageUrl" | "imageTitle" | "focalLength" | "ISO" | "aperture" | "shutterSpeed">;
	let imageLoaded = false;
</script>

<div class="image-container {imageLoaded ? 'fade-in' : ''}">
	<img alt={photo.imageTitle} src={photo.imageUrl} on:load={() => (imageLoaded = true)}/>
	<div class="gallery-image-footer">
		<p class="caption">{photo.imageTitle}</p>
		<p class="caption">
			{photo.focalLength}<span class="separator"></span>
			{photo.ISO}<span class="separator"></span>
			{photo.aperture}<span class="separator"></span>
			{photo.shutterSpeed}
		</p>
	</div>
</div>

<style>
	.image-container {
		opacity: 0;
		transition: opacity 0.4s;
	}

	.image-container.fade-in {
		opacity: 1;
	}
	.gallery-image-footer {
		margin-top: var(--grid-gap);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}
	img {
		max-width: calc(
			100vw - (2 * var(--image-spacing)) - (2 * var(--image-sliver))
		);
		max-height: calc(100vh - (2 * var(--top-margin)));
	}
</style> -->
