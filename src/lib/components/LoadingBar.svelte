<script lang="ts">
	let {
		// from 0 to 1
		progress = 0,
		width = "100%",
	} = $props();
</script>

<div id="loading-bar-container" style={`width: ${width};`}>
	<div
		id="loading-bar-fill"
		style={`width: ${Math.min(Math.max(progress, 0), 1) * 100}%;`}
	></div>
</div>

<style>
	#loading-bar-container {
		height: var(--em);
		border: var(--outline-thickness) solid var(--color-light);
	}

	#loading-bar-fill {
		height: 100%;
		background-color: var(--color-light);
		transition: width 0.2s ease;
	}
</style>
