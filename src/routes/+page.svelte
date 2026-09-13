<script lang="ts">
    import { writable } from "svelte/store";
    import IconButton from "$lib/components/IconButton.svelte";
    import { onMount, onDestroy, tick } from "svelte";
    import HeaderBar from "$lib/components/HeaderBar.svelte";
    import { page } from "$app/state";
	import { goto } from '$app/navigation';

    // for the post modal
    import { pushState, preloadData } from '$app/navigation';


    async function openPostModal(e, href) {
        // Allow opening in new tab via Cmd/Ctrl + Click
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();

        const result = await preloadData(href);

        if (result.type === 'loaded' && result.status === 200) {
          pushState(href, {
            showModal: true,
            postData: result.data
          });
        } else {
          window.location.href = href;
        }
      }

    let { data } = $props();

    let windowWidth = writable(
        typeof window !== "undefined" ? window.innerWidth : 0,
    );



    // categories

    // Derive the current category from URL search params.
	// Defaults to 'all' if the param is missing.
	let currentCategory = $derived(
		page.url.searchParams.get('category') ?? 'all'
	);

	// Extract unique categories dynamically from the loaded posts
	let allCategories = $derived([
		'all',
		...new Set(data.posts.flatMap((post) => post.meta.categories || []))
	]);

	// Filter posts based on currentCategory
	let filteredPosts = $derived(
		currentCategory === 'all'
			? data.posts
			: data.posts.filter((post) =>
					post.meta.categories?.includes(currentCategory)
				)
	);

	// // Function to update URL search parameters
	// function setCategory(category: string) {
	// 	const url = new URL(page.url);

	// 	if (category === 'all') {
	// 		url.searchParams.delete('category');
	// 	} else {
	// 		url.searchParams.set('category', category);
	// 	}

	// 	goto(url.toString(), {
	// 		keepFocus: true,
	// 		noScroll: true,
	// 		replaceState: true
	// 	});
	// }


    function formatDate(inDate: Date) {
      let inDateDate = new Date(inDate);
      return inDateDate.toISOString().slice(0, 10);
    }

    function openMail() {
		const user = "hi";
		const domain = "imdantaylor.com";
		const subject = ""
		window.location.href = "mailto:" + user + "@" + domain + "?subject=" + subject;
	}

	// begin new masonry code
    /**
     * Define types for internal usage
     */
    interface LayoutParams {
      colGap: number;
      items: HTMLElement[];
    }

    function runMasonryLayout() {
      const masonryLayouts = document.querySelectorAll<HTMLElement>('.masonry');

      masonryLayouts.forEach(async (container) => {
        if (isMasonrySupported(container)) return;

        const colGap = parseFloat(getComputedStyle(container).columnGap);
        const items = getChildren(container);

        container.style.gridAutoRows = 'auto';
        container.style.setProperty('row-gap', '1px', 'important');

        try {
          await areImagesLoaded(container);
        } catch (e) {
          // Silent fail
        }

        layout({ colGap, items });
      });
    }

    // Update setCategory to be async
    async function setCategory(category: string) {
        const url = new URL(page.url);

        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }

        // 1. Update the URL and trigger Svelte's state change
        goto(url.toString(), {
            keepFocus: true,
            noScroll: true,
            replaceState: true
        });

        // 2. Wait for Svelte 5 to update the DOM elements
        await tick();

        // 3. Recalculate the masonry layout positions
        runMasonryLayout();
    }

    onMount(() => {
      // Run the initial layout calculation
      runMasonryLayout();

      // Keep your ResizeObserver setup intact here
      const masonryLayouts = document.querySelectorAll<HTMLElement>('.masonry');
      masonryLayouts.forEach((container) => {
        if (isMasonrySupported(container)) return;
        const colGap = parseFloat(getComputedStyle(container).columnGap);

        const observer = new ResizeObserver(() => {
          const items = getChildren(container);
          layout({ colGap, items });
        });

        observer.observe(container);
      });
    });

    /**
     * Checks if the container uses a masonry grid setup
     */
    function isMasonrySupported(container: HTMLElement): boolean {
      if (typeof window === 'undefined') return false;
      return getComputedStyle(container).gridTemplateRows === 'masonry';
    }

    /**
     * Retrieves children, handling Astro's specific slot logic
     */
    function getChildren(container: HTMLElement): HTMLElement[] {
      let children = container.children;

      // Compensate for Astro Slots
      if (children[0] && children[0].nodeName === 'ASTRO-SLOT') {
        children = children[0].children;
      }
      return Array.from(children) as HTMLElement[];
    }

    /**
     * Returns a promise that resolves when all images in the container are loaded
     */
    async function areImagesLoaded(container: HTMLElement): Promise<void> {
      const images = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
      const promises = images.map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) return resolve();
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      await Promise.all(promises);
    }

    /**
     * Calculates and applies the grid row spans based on element height
     */
    function layout({ colGap, items }: LayoutParams): void {
      items.forEach((item) => {
        const ib = item.getBoundingClientRect();
        // Use Math.round to ensure we have a whole number for the span
        item.style.gridRowEnd = `span ${Math.round(ib.height + colGap)}`;
      });
    }

</script>

<HeaderBar title="Dan Taylor" titleLink="" buttons={headerButtons} />

{#snippet headerButtons()}
    <IconButton
        iconName="icon-envelope"
        altTitle="Back"
        onclick={openMail}
    />
{/snippet}

<!-- TODO: layout needs to adapt to mobile -->
<!-- TODO: gallery links need to be sticky -->

<div id="container">
    <div id="gallery-links-container">
        <div id="gallery-links">
            <button
                class:active={currentCategory === 'all'}
                onclick={() => setCategory("all")}
            >All</button>

            <button
                class:active={currentCategory === 'architecture'}
                onclick={() => setCategory("architecture")}
            >Architecture</button>

            <button
                class:active={currentCategory === 'client'}
                onclick={() => setCategory("client")}
            >Client</button>

            <button
                class:active={currentCategory === 'details'}
                onclick={() => setCategory("details")}
            >Details</button>
        </div>
    </div>
    <div id="gallery-container">
            <!-- <div id="about-container">
                <p>
                    While working in industrial design I frequently conducted product, interior, and outdoor photography.
                    I'm currently focusing on capturing humans' relationship with infrastructure through photo and <a href="https://vimeo.com/danandrewtaylor">video</a>.
                </p>
            </div> -->
        <div class="masonry">
            <!-- end test -->
            {#if filteredPosts}
                {#each filteredPosts as post}
                    <div class="box">
                    <!-- <GridImage {post} /> -->
                    <!-- <div class="image-container"> -->
                        <a class="unstyled-link" href="{post.slug}"
                        onclick={(e) => openPostModal(e, `/${post.slug}`)}
                      >
                            <img src={"images/photos/" + post.slug + "/" + post.meta.images[0].fileName} alt={post.meta.title} />
                            <!-- {#if imageFooter} -->
                            <div class="gallery-image-footer">
                                <p id="post-title" class="caption">
                                    <span>{formatDate(post.meta.shootDate)}</span><span class="spacer"></span>
                                    {#if post.meta.title}
                                        <span>
                                            <span class="separator"></span>
                                            {post.meta.title}
                                        </span>
                                    {/if}
                                </p>
                            </div>
                            <!-- {/if} -->
                        </a>
                    <!-- </div> -->
                    </div>
                {/each}
                {/if}
        </div>
    </div>
</div>

<style>

    /* new masonry */
    .masonry {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: masonry;
      gap: var(--mini-gap);
      grid-auto-flow: dense;

      > *,
      > astro-slot > * {
        align-self: start;
        grid-column-end: span var(--span, 1);
      }
    }

    /*.box {
      display: flex;
      flex-flow: column;
      gap: 1rem;
      border: 2px solid black;
      padding: 1rem;
      border-radius: 0.5rem;
      background: white;
    }*/

    /* end new masonry */

    /*grid image*/

    .box {
        width: 100%;
        container-type: inline-size;
    }

    img {
        width: 100%;
        height: auto;
        display: block;
    }

    .gallery-image-footer {
        margin-top: var(--mini-gap);
        margin-bottom: var(--mini-gap);
        width: 100%;
        /* height: 1.5rem; */
        display: flex;
        justify-content: space-between;
    }

    /* query the gallery image footer for it's width and hide the last  */
    @container (max-width: 250px) {
        #post-title {
            display: none;
        }
    }
    /*end grid image*/

    #container {
        margin: var(--outer-margin);
        margin-top: var(--top-margin);
        display: flex;
        flex-direction: row;
    }
    #gallery-links-container {
        width: var(--gallery-title-width);
    }
    #gallery-links {
        width: var(--gallery-title-width);
        position: fixed;
        /*top: 1000px;*/
    }
    #gallery-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: calc(var(--em) * 3);
    }

    .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--em);
    }

    #about-container {
        align-self: flex-end;
        width: calc(66.6vw - (2 * var(--outer-margin)));
    }

    button {
      display: grid;
      grid-template-columns: 1em 1fr;
      justify-items: left;
      margin-left: -1em;
    }

    button::before {
        content:"";
    }

    button.active::before {
      content: "-"; /* The character you want to add */
    }

    /*make it smaller for huge screens*/
    @media (min-width: 1800px) {

        #about-container {
            width: 33.33%;
        }
    }

    @media (max-width: 900px) {
        #about-container {
            width: calc(66.6vw - (2 * var(--outer-margin)));
        }
    }

    @media (max-width: 800px) {
        #about-container {
            width: calc(50vw - (2 * var(--outer-margin)));
        }
        .masonry {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
    }

    /*category links move to the top*/
     @media (max-width: 600px) {
         #container {
             flex-direction: column;
             gap: var(--em);
         }
        #gallery-links-container {
            width: 100%;
        }
        #gallery-links {
            position: relative;
        }
    }

    @media (max-width: 520px) {

        #about-container {
            width: 100%;
        }

        .gallery-image-footer {
            display: none;
        }
    }

    .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
