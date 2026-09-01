<script lang="ts">
    import IconButton from "$lib/components/IconButton.svelte";
    import { urlCache } from "$lib/utils/urlCache.svelte";
    import LoadingBar from "./LoadingBar.svelte";

    interface Props {
        // this switches the left and right buttons for up and down
        vertical?: boolean;
        // this sets the number in the top left and also determines the visibility of the left arrow
        itemNumber?: number;
        // sets the visibility of the right arrow
        lastItem?: boolean;
        // The progress as a floating point from 0 to 1
        uploadProgress?: number;
        // The state of the uploaded item
        state?: "processed" | "processing" | "error";
        // highlights the info icon
        dataNeeded?: boolean;
        /** The fileKey for the image <-- this will be used over any URL */
        fileKey?: string;
        /** The url for the item */
        url?: string;
        // this shows up in the error message
        imageName?: string;
        // The text displayed for an error
        errorText?: string;
        // Callback function for deleting an item
        ondelete?: () => void;
        // Callback function for changing the position of an image
        changePos?: (direction: number) => void;
        // Callback function for opening the more information modal
        moreInfo?: () => void;
    }

    let {
        vertical = false,
        itemNumber = 0,
        lastItem = false,
        uploadProgress = 0.3,
        state = "processed",
        dataNeeded = false,
        url = "",
        fileKey = "",
        imageName = "Unknown",
        errorText = "There was an error uploading this image",
        ondelete,
        changePos,
        moreInfo,
    }: Props = $props();
</script>

<div id="container">
    <div id="top-bar">
        {#if state == "processed"}
            <span>{itemNumber}</span>
        {/if}
        <div id="controls">
            {#if state == "processed"}
                {#if itemNumber > 1}
                    <IconButton
                        iconName={vertical
                            ? "icon-arrow-up"
                            : "icon-arrow-left"}
                        altTitle="Move left"
                        onclick={() => changePos?.(-1)}
                    />
                {/if}
                {#if !lastItem}
                    <IconButton
                        iconName={vertical
                            ? "icon-arrow-down"
                            : "icon-arrow-right"}
                        altTitle="Move right"
                        onclick={() => changePos?.(1)}
                    />
                {/if}
                <!-- TODO Dan: the warning color on the icon isn't functional yet -->
                <IconButton
                    iconName="icon-info"
                    altTitle="Information"
                    warningColor={dataNeeded}
                    onclick={moreInfo}
                />
                <IconButton
                    iconName="icon-trash"
                    altTitle="Delete photo"
                    onclick={ondelete}
                />
            {/if}
        </div>
    </div>
    <div id="content-container">
        {#if state == "processing"}
            <p>{imageName}</p>
            <!-- <LoadingBar progress={uploadProgress} /> -->
            <p>Converting...</p>
        {:else if state == "error"}
            <p>{imageName}</p>
            <p class="error-text">{errorText}</p>
        {:else}
            <img
                alt={imageName ?? ""}
                src={!!fileKey
                    ? urlCache.getOrFetch(fileKey)
                    : !!url
                      ? url
                      : ""}
            />
        {/if}
    </div>
</div>

<!-- TODO add h1 tag for seo -->

<style>
    #container {
        border: var(--outline-thickness) solid var(--color-light);
        display: flex;
        flex-direction: column;
    }
    #top-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: var(--button-area-padding);
    }
    #top-bar span {
        height: var(--button-area);
        width: var(--button-area);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #controls {
        display: flex;
        flex-direction: row;
        gap: var(--button-gap);
    }
    #content-container {
        margin: var(--em);
        flex-grow: 1;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        flex-direction: column;
        gap: var(--em);
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    #content-container > img {
        max-height: 268px;
        max-width: 100%;
    }
    #upload-progress-bar {
        height: var(--em);
        border: var(--outline-thickness) solid var(--color-light);
        background-color: var(--color-light);
        transition: width 0.3s ease;
    }
</style>
