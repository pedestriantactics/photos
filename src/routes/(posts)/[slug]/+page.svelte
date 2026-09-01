<script lang="ts">
    import { onMount } from "svelte";
    import HeaderBar from "$lib/components/HeaderBar.svelte";
    import FooterBar from "$lib/components/FooterBar.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import { page } from "$app/state";

    let { data } = $props();

    // interface Props {
    // 	/** ID of the gallery being edited if applicable */
    // 	id?: string;
    // 	/** Initial loaded state of the form if we're editing an existing gallery */
    // 	post: Post;
    // 	displayName: string;
    // }
    let shootDate = new Date(data.shootDate);
    let formattedDate = shootDate.toISOString().slice(0, 10);
    function removeFileExtension(inFileName: string) {
      return inFileName.replace(/\.[^/.]+$/, "");
    }
    let centerTitle = formattedDate;
    if (data.title && data.title != "") centerTitle = formattedDate + " " + data.title;

    let currentPhotoIndex: number = $state(1);
    let scrollContainer: HTMLElement | null = null;
    let totalCount: number = Math.max(
        1,
        (data.images.length ?? 0) + (data.description ? 1 : 0),
    );

    const updateIndex = () => {
        if (!scrollContainer) return;

        const scrollLeft = scrollContainer.scrollLeft;
        const viewportCenter = scrollLeft + scrollContainer.clientWidth / 2;
        const containers = Array.from(
            scrollContainer.querySelectorAll<HTMLElement>(".item-container"),
        );

        if (containers.length === 0) {
            totalCount = 1;
            currentPhotoIndex = 1;
            return;
        }

        let closestIndex = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < containers.length; i++) {
            const c = containers[i];
            const cCenter = c.offsetLeft + c.offsetWidth / 2;
            const dist = Math.abs(viewportCenter - cCenter);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestIndex = i;
            }
        }

        currentPhotoIndex = closestIndex + 1;
        totalCount = containers.length;
    };

    onMount(() => {


      console.log(data);

        // delegated click handler so we don't re-bind when list changes
        if (scrollContainer) {
            scrollContainer.addEventListener("click", (ev) => {
                const target = (ev.target as Element).closest(
                    ".item-container",
                ) as HTMLElement | null;
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                    });
                }
            });
        }

        updateIndex();

        // observe resizes which can change centers
        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined" && scrollContainer) {
            ro = new ResizeObserver(() => updateIndex());
            ro.observe(scrollContainer);
            scrollContainer
                .querySelectorAll<HTMLElement>(".item-container")
                .forEach((c) => ro!.observe(c));
        }

        return () => {
            if (ro) ro.disconnect();
        };
    });
</script>

<svelte:head>
    <title>{data.title ?? data.shootDate}</title>
    {#if data.description}
        <meta
            name="description"
            content="{data.shootDate}: {data.description}"
        />
    {/if}
</svelte:head>

<HeaderBar
    title="Dan Taylor"
    titleLink="../"
    {centerTitle}
    buttons={headerButtons}
/>

{#snippet headerButtons()}
    <IconButton
        iconName="icon-x"
        altTitle="Back"
        onclick={() => {
            window.location.href = `../`;
        }}
    />
{/snippet}

{#snippet footerLeft()}
    <!-- <IconButton
		iconName="icon-arrow-left"
		altTitle="Back"
		onclick={() => {
			window.location.href = `./`;
		}}
	/> -->
{/snippet}

{#snippet footerRight()}
    {#if totalCount > 1}
        <p>{currentPhotoIndex || 1} / {totalCount}</p>
    {/if}
{/snippet}

<FooterBar leftContent={footerLeft} rightContent={footerRight} />

<div
    class="scroll-snap disable-scrollbars"
    bind:this={scrollContainer}
    on:scroll={updateIndex}
>
    {#if data.description}
        <div class="item-container">
            <div id="description-wrapper">
                <p id="description" class="description">
                    {data.description}
                </p>
            </div>
        </div>
    {/if}
    {#each data.images as postImage}
        <div class="item-container">
            <div class="image-wrapper">
                <img
                    src={"../../images/photos/" + data.slug + "/" + postImage.fileName}
                    alt={postImage.caption}
                />
                <div class="image-footer captions">
                    <p>{removeFileExtension(postImage.fileName)}</p>
                    <!-- {#if postImage.caption}
                    <p>{postImage.caption}</p>
                    {/if} -->
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    :root {
        --image-max-height: calc(
            100vh - var(--header-bar-height) - var(--header-bar-height) -
                (4 * var(--em))
        );
        --item-max-width: calc(
            100vw - (2 * (var(--image-sliver) + var(--image-gap)))
        );
        --image-gap: 8vw;
        --image-sliver: calc(1 * var(--em));
    }

    .scroll-snap {
        z-index: -1;
        /* background-color: blue; */
        /* background-color: var(--bg); */
        overflow-x: auto;
        /* overscroll-behavior-x: contain; */
        scroll-snap-type: x mandatory;
        display: flex;
        gap: var(--image-gap);
        /* add a gap between items */
        flex-direction: row;
        /* make it fixed in the browser */
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    /* hide the scrollbar
	/* Chrome/Safari/Webkit */
    .disable-scrollbars::-webkit-scrollbar {
        background: transparent;
        width: 0px;
    }

    /* Firefox */
    /* IE 10+ */
    .disable-scrollbars {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .item-container {
        scroll-snap-stop: always;
        scroll-snap-align: center;

        /* Center first and last items */

        display: flex;
        justify-content: center;
        align-items: center;
        /* height: 100%; */
        max-width: var(--item-max-width);
        /* width: 100%; */
        /* width: calc(100vw - (2 * var(--outer-margin))); */
        flex-shrink: 0;
        /* background-color: #aaa; */
    }

    .item-container:first-child {
        margin-left: calc(50vw);
    }

    .item-container:last-child {
        margin-right: calc(50vw);
    }

    #description-wrapper {
        width: var(--item-max-width);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #description {
        /* font-size: 24px;
		line-height: 1.2;
		letter-spacing: .02em;
		font-weight: 300; */
        max-width: 30em;
    }

    .image-wrapper {
        /* background-color: #bbb; */
        text-align: center;
    }

    .image-footer {
        display: flex;
        justify-content: space-between;
        gap: var(--em);
        height: calc(2 * var(--caption));
        align-items: end;
    }

    .image-footer p {
        margin-bottom: 0;
    }

    .image-footer div {
        display: flex;
        gap: var(--em);
    }

    img {
        height: auto;
        width: auto;
        max-width: 100%;
        max-height: var(--image-max-height);
        object-fit: contain;
        /* background-color: red; */
    }

    @media (max-width: 600px) {
        /* TODO: need to target the header bar */
    }
</style>
