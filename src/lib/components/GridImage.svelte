<script lang="ts">
    import type { PostDisplay } from "$lib/schemas/post";
    import { urlCache } from "$lib/utils/urlCache.svelte";
    import { page } from "$app/state";

    interface Props {
        /** The post object */
        post: PostDisplay;
    }

    let { post }: Props = $props();

    // Forms the date for each post (YYYY-MM-DD)
    // let formattedDate: string = (() => {
    //     let month = String(post.shootDate.getMonth() + 1).padStart(2, "0");
    //     let day = String(post.shootDate.getDate()).padStart(2, "0");
    //     let year = post.shootDate.getFullYear();

    //     return `${year}-${month}-${day}`;
    // })();

    // If created at or title exists then their is an footer to the image
    // let imageFooter = $derived(post.shootDate || post.title);
</script>

<div class="image-container">
    <a class="unstyled-link" href="{page.url.pathname}/{post._id}">
        <img src={urlCache.getOrFetch(post.asset.fileKey)} alt={post.title} />
        <!-- {#if imageFooter} -->
        <div class="gallery-image-footer">
            <p class="caption">
                <span>{post.shootDate}</span>
                {#if post.title}
                    <span id="post-title">
                        <span class="separator"></span>
                        {post.title}
                    </span>
                {/if}
            </p>
        </div>
        <!-- {/if} -->
    </a>
</div>

<style>
    .image-container {
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
</style>
