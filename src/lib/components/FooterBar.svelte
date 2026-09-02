<script>
	let {
		leftContent = null,
		centerContent = null,
		rightContent = null,
	} = $props();
</script>

<div id="footer-bar">
	<div id="left-container">{@render leftContent?.()}</div>
	<div id="center-content">{@render centerContent?.()}</div>
	<div id="right-content">{@render rightContent?.()}</div>
</div>

<style>
	#footer-bar {
		/* background-color: var(--bg); */
		z-index: 2;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--outer-margin);
		padding-top: var(--mini-gap);
		padding-bottom: var(--em);
		display: flex;
		background-color: var(--color-bg);
		height: var(--em);
		align-items: center;
		justify-content: space-between;
	}

	/* Left and right areas should grow to fill space even when empty.
	   Use a zero basis so they claim available space regardless of content. */
	#left-container,
	#right-container {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		align-items: center;
	}

	#right-container {
		justify-content: flex-end;
	}
</style>
