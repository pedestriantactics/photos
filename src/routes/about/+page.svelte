<script lang="ts">
    import { onMount } from "svelte";
    import HeaderBar from "$lib/components/HeaderBar.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import { page } from "$app/state";

    function openMail() {
		const user = "hi";
		const domain = "imdantaylor.com";
		const subject = ""
		window.location.href = "mailto:" + user + "@" + domain + "?subject=" + subject;
	}
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
            Photography and videography have been an integral part of my process as a <a href="https://danandrewtaylor.com">designer</a> over the past 15 years.
            </p><p>
            I see photography as an opportunity to slow down and appreciate things as I see them – to exist in the moment and be present.
            </p><p>
            The intent of my work is to pay homage to the incredible spaces I’ve visited and tell the stories of people I've met, while highlighting the color reproduction of some of my favorite equipment.
            </p><p>
                You can follow me on <a href="https://vimeo.com/danandrewtaylor">Vimeo</a> and <a href="https://www.instagram.com/danandrewtaylor/">Instagram</a>. Email me <a href="./" onclick={openMail}>here</a>.
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
        max-width: var(--paragraph-max-char-width);
        display: flex;
        flex-direction: column;
        gap: var(--em);
    }

    #description p {
    }
</style>
