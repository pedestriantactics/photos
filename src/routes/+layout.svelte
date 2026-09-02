<script lang="ts">
	// import favicon from '$lib/assets/favicon.svg';
	import "../styles/reset.css";
	import "../styles/styles.css";

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
    <title>Dan Taylor</title>

    <meta
        name="description"
        content="Photos by Dan Taylor"
    />
</svelte:head>

{@render children()}
