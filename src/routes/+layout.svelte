<script lang="ts">
	import "../styles/reset.css";
	import "../styles/styles.css";

	import { page } from '$app/state';
	import PostModal from '$lib/components/PostModal.svelte';
	import PostPage from './(posts)/[slug]/+page.svelte';

	// 1. Declare `data` inside $props()
	let { children, data } = $props();

	function closeModal() {
		history.back(); // Restores original URL and clears page state
	}

	// 2. Safely read data?.title with fallback
	let pageTitle = $derived(
		page.state.showModal && page.state.postData?.title
			? page.state.postData.title
			: data?.title || 'Dan Taylor'
	);
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
    <title>{pageTitle}</title>

    <!-- <meta
        name="description"
        content="Photos by Dan Taylor"
    /> -->
</svelte:head>

{@render children()}

{#if page.state.showModal}
  <PostModal
    bind:showModal={() => !!page.state.showModal, (val) => { if (!val) closeModal(); }}
  >
    <PostPage data={page.state.postData} />
  </PostModal>
{/if}
