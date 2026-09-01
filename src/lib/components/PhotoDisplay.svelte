<script lang="ts">
    import PostEdit from "./PostEdit.svelte";

    interface Props {
        /** Photo object to display */
        photo: Photo;
        /** Tracks the index */
        index: number;
        /** Tracks if the post has a description */
        descriptionIndex: number;
        /** Tracks the current index */
        currentIndex: number;
        /** Event handler for when the next button is pressed */
        nextImage(): void;
        /** Event handler for when the prev button is pressed */
        prevImage(): void;
    }

    let {
        photo,
        index,
        descriptionIndex,
        currentIndex,
        nextImage,
        prevImage,
    }: Props = $props();

    const indexWithDesc = $derived(descriptionIndex + index);
</script>

<!-- wraps the item inside the container including the edit controls -->
<button
    class="image-container gallery-image-button"
    onclick={() => {
        if (indexWithDesc > currentIndex) {
            nextImage();
        } else if (indexWithDesc < currentIndex) {
            prevImage();
        }
    }}
    onkeydown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
            if (indexWithDesc > currentIndex) {
                nextImage();
            } else if (indexWithDesc < currentIndex) {
                prevImage();
            }
        }
    }}
>
    <img src={photo.fileKey} alt={photo.imageTitle} class="gallery-image" />
    <div class="gallery-image-footer">
        <p class="caption">{photo.imageTitle}</p>
        <p class="caption">
            {photo.focalLength + "mm"}<span class="separator"></span>
            {"iso" + photo.ISO}<span class="separator"></span>
            {"f/" + photo.aperture}<span class="separator"></span>
            {photo.shutterSpeed + "S"}
        </p>
    </div>
</button>

<!-- This is for tracking the edit stuff -->

<style>
    .gallery-image {
        /* TODO Dan: small images need to scale up, this only scales down large images */
        /* Make image scale to fit container, maintaining aspect ratio */
        max-width: var(--gallery-item-max-width);
        max-height: var(--gallery-item-max-height);
    }

    .gallery-image-footer {
        margin-top: var(--grid-gap);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
</style>
