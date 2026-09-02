<script lang="ts">
    import { writable } from "svelte/store";
    import IconButton from "$lib/components/IconButton.svelte";
    import { onMount, onDestroy } from "svelte";
    import HeaderBar from "$lib/components/HeaderBar.svelte";
    import { page } from "$app/state";

    let { data } = $props();

    let windowWidth = writable(
        typeof window !== "undefined" ? window.innerWidth : 0,
    );
    // #regionend

    // $: activeTag = $page.url.searchParams.get("tag");

    // // filter out hidden posts
    // let nonHiddenPosts = posts.filter((post) => !post.hidden);

    // sort posts by upload date
    // posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // $: filteredPosts = activeTag && activeTag !== "all"
    // 	? nonHiddenPosts.filter((post) => post.tags.includes(activeTag))
    // 	: nonHiddenPosts;




    // begin new masonry code
    /**
     * Define types for internal usage
     */
    interface LayoutParams {
      colGap: number;
      items: HTMLElement[];
    }

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

    onMount(() => {

      const masonryLayouts = document.querySelectorAll<HTMLElement>('.masonry');

      masonryLayouts.forEach(async (container) => {
        if (isMasonrySupported(container)) return;

        const colGap = parseFloat(getComputedStyle(container).columnGap);
        const items = getChildren(container);

        // this started as 1px and dan changed it to auto because of layout issues
        container.style.gridAutoRows = 'auto';
        container.style.setProperty('row-gap', '1px', 'important');

        try {
          // Wait for media to load before calculating layout
          await areImagesLoaded(container);
        } catch (e) {
          // Silent fail as per original implementation
        }

        layout({ colGap, items });

        const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
          for (const entry of entries) {
            layout({ colGap, items });
          }
        });

        observer.observe(container);
        console.log("started observing")
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
    <!-- <div id="gallery-links">
    <p>Landscape</p>
    <p>Portrait</p>
    <p>Detals</p>
  </div> -->
    <div id="gallery-container">
        <!-- TODO Jesse: get the user bio -->
            <div id="about-container">
                <p>
                    I frequently conducted product, interior, and outdoor photography while working in industrial design. I'm currently focusing on capturing human's relationship with infrastructure through photo and <a href="https://vimeo.com/danandrewtaylor">video</a>.
                </p>
            </div>
        <!-- {/if} -->
        <div class="masonry">
            <!-- end test -->
            {#if data.posts}
                {#each data.posts as post}
                    <div class="box">
                    <!-- <GridImage {post} /> -->
                    <!-- <div class="image-container"> -->
                        <a class="unstyled-link" href={post.slug}>
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
    #gallery-links {
        width: var(--gallery-title-width);
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

    @media (max-width: 520px) {

        #about-container {
            width: 100%;
        }
    }

    .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
