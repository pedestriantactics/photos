<script lang="ts">
    import { onMount } from "svelte";
    import HeaderBar from "$lib/components/HeaderBar.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import { page } from "$app/state";
</script>

<svelte:head>
    <title>{"Dan Taylor - About"}</title>
</svelte:head>

<HeaderBar
    title="Dan Taylor"
    titleLink="../"
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

<div id="container">
    <div id="description-wrapper">
        <div id="description">
            <p>
                I worked in <a href="https://danandrewtaylor.com">industrial design and user experience design</a> since graduating from Western Washington University in 2016.
                I frequently found myself conducting studio photography for various products, interior and exterior photography of products on-location, and videography.
            </p>
            <p>
                I see photography as an opportunity to slow down and appreciate things as-is, without the pressure of finding new solutions to problems.
                I enjoy listening intently to spaces, using manual lenses, and experimenting with various post-processing methods.

            <p>
                Some of my video work is on <a href="https://vimeo.com/danandrewtaylor">Vimeo</a>.
            </p>
            </div>
    </div>
</div>

<style>
    #container {
        margin: var(--outer-margin);
        margin-top: var(--top-margin);
        display: flex;
        height: calc(100vh - var(--top-margin) - (var(--outer-margin)*2));
    }

    #description-wrapper {
        width: 100%;
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
        display: flex;
        flex-direction: column;
        gap: var(--em);
    }

    #description p {
    }
</style>
