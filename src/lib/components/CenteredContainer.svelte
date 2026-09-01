<!-- this container centers elements on the screen horizontally and vertically -->
<!-- if the element is too tall for the page it automatically pins it to the top of the container -->

<script lang="ts">
	import { onMount, type Snippet } from "svelte";

	interface Props {
		// The content for the container
		content: Snippet;
		overrideVerticalCentering?: boolean;
	}

	let { content, overrideVerticalCentering }: Props = $props();

	// this is used for the upload page where the page size dynamically changes on upload
	// this wasn't firing correctly

	// ------------------------
	// OVERFLOW DETECTOR
	// ------------------------
	let overflowCheck: HTMLDivElement | null = null;
	let isOverflowing = $state(false);
	let headerAreaHeight = 120;

	onMount(() => {
		overflowChecker();
		window.addEventListener("resize", overflowChecker);
	});

	function overflowChecker() {
		if (!overflowCheck) return;
		const viewportHeight = window.innerHeight;
		if (overrideVerticalCentering) {
			isOverflowing = true;
		} else {
			isOverflowing =
				overflowCheck.scrollHeight >
				viewportHeight - headerAreaHeight * 2;
				
		}
	}
</script>

<div id="container" class:isOverflowing style="padding-bottom: {isOverflowing ? `${headerAreaHeight}px` : '0'}">
	<div id="content" bind:this={overflowCheck}>
		{@render content()}
	</div>
</div>

<style>
	#container {
		width: calc(100% - var(--outer-margin) * 2);
		height: calc(100vh - var(--outer-margin) * 2);
		margin: var(--outer-margin);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#content {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	#container.isOverflowing {
		align-items: flex-start;
		margin-top: var(--top-margin);
		height: auto;
	}
</style>
