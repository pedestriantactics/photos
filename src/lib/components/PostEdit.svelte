<script lang="ts">
    import type { FormContext } from "$lib/browser/form.svelte";
    import type { PostDetailsForm } from "$lib/schemas/gallery";

    interface Props {
        /** our form */
        form: FormContext<PostDetailsForm>;
        /** tracks the editing status */
        editing: boolean;
        /** tracks the index of images */
        index: number;
    }

    let { editing, index, form }: Props = $props();

    const imageCount = form.state.photos.length;
    const descriptionIndex = form.state.description !== "" ? 1 : 0;

    function shiftImage(index: number, direction: boolean): void {
        console.log("index", index);
        const photos = form.state.photos;

        // direction: true = right, false = left;
        const targetIndex = direction ? index + 1 : index - 1;

        // Make sure targetIndex is in bounds
        if (targetIndex < 0 || targetIndex >= photos.length) return;

        // Swap the images
        let temp = photos[targetIndex];
        photos[targetIndex] = photos[index];
        photos[index] = temp;
    }
</script>

{#if editing}
    <div class="image-edit-buttons-container">
        {#if imageCount > 1}
            {#if index > 0 + descriptionIndex}
                <button
                    onclick={() => {
                        shiftImage(index, false);
                    }}
                    class="icon arrow-left"
                    aria-label="Move left"
                ></button>
            {/if}
            {#if index < imageCount - 1}
                <button
                    onclick={() => {
                        shiftImage(index, true);
                    }}
                    class="icon arrow-right"
                    aria-label="Move right"
                ></button>
            {/if}
            <button
                onclick={() => {
                    // pending action
                }}
                class="icon icon-trashIcon"
                aria-label="Delete"
            ></button>
        {/if}
        <button
            onclick={() => {
                // pending action
            }}
            class="icon icon-swapIcon"
            aria-label="Swap"
        ></button>
    </div>
{/if}

<!-- <div class="image-edit-buttons-container">
    <button
        onclick={() => {
            // pending action
        }}
        class="icon icon-trashIcon"
        aria-label="Delete"
    ></button>
</div> -->

<style>
    .image-edit-buttons-container {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        z-index: 2;
    }

    .image-edit-buttons-container button {
        background-color: var(--body-fg);
        height: 2rem;
        width: 2rem;
    }
</style>
