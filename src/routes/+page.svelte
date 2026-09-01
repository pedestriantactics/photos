<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	let { data } = $props();


interface LayoutParams {
  colGap: number;
  items: HTMLElement[];
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

<svelte:head>
<title>Dan Taylor</title>
</svelte:head>

<HeaderBar title="Dan Taylor" titleLink="" />

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
                About container content
            </p>
        </div>
    <!-- {/if} -->
    <div class="masonry">
        <!-- end test -->
        {#if filteredPosts}
            {#each filteredPosts as post}
                <div class="box">
                <!-- <GridImage {post} /> -->
                <!-- <div class="image-container"> -->
                    <a class="unstyled-link" href={post.postPath}>
                        <img src={post.postPath} alt={post.title} />
                        <!-- {#if imageFooter} -->
                        <div class="gallery-image-footer">
                            <p id="post-title" class="caption">
                                <span>{post.shootDate?.toISOString()}</span>
                                {#if post.title}
                                    <span>
                                        <span class="separator"></span>
                                        {post.title}
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
    gap: var(--em);
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--em);
}

#about-container {
    width: calc(33.3vw - (2 * var(--outer-margin)));
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
