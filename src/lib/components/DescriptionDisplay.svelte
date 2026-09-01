<script lang="ts">
    interface Props {
        /** Desctription string */
        description: string;
        /** Tracks if user is in edit mode */
        editing: boolean;
        /** Tracks the current index */
        currentIndex: number;
        /** Trigger to change to the next image */
        nextImage(): void;
        /** Trigger to cahgne to the previous image */
        prevImage(): void;
    }

    let { description, editing, currentIndex, nextImage, prevImage }: Props =
        $props();
</script>

<div class="gallery-item">
    <!-- wraps the item inside the container including the edit controls -->
    <div class="gallery-item-wrapper">
        {#if editing && currentIndex == 0}
            <div class="image-edit-buttons-container">
                <button
                    onclick={() => {
                        // pending action
                    }}
                    class="icon icon-trashIcon"
                    aria-label="Delete"
                ></button>
            </div>
        {/if}
        <button
            id="description-container"
            class="gallery-image-button"
            onclick={() => {
                if (0 > currentIndex) {
                    nextImage();
                } else {
                    prevImage();
                }
            }}
            onkeydown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    if (0 > currentIndex) {
                        nextImage();
                    } else {
                        prevImage();
                    }
                }
            }}
        >
            <p contenteditable={editing}>
                {description}
            </p>
        </button>
    </div>
</div>

<style>
    .gallery-item {
        height: 100%;
        /* background-color: lightgray; */
        scroll-snap-stop: always;
        scroll-snap-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 100%;
    }
    #description-container {
        height: var(--gallery-item-max-height);
        width: var(--gallery-item-max-width);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #description-container p {
        max-width: var(--max-paragraph-width);
    }

    .image-edit-buttons-container {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        z-index: 2;
    }
</style>
