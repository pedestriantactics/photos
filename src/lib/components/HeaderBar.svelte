<script>
    let {
        // the title on the left side of the bar
        title = "Title",
        titleLink = "",
        // these two titles show up in the center of the bar
        centerTitle = "",
        // the container for the buttons, use the snippet to place buttons in this
        buttons = null,
    } = $props();
</script>

<div id="header-bar">
    <div id="container-wide">
        <div id="title">
            {#if titleLink}
                <a class="unstyled-link" href={titleLink}><h1>{title}</h1></a>
            {:else}
                <h1>{title}</h1>
            {/if}
        </div>
        <!-- if either of the second titles are visible turn on the container div for them -->
        {#if centerTitle != ""}
            <div id="center-title">
                <h2>{centerTitle}</h2>
            </div>
        {/if}
        <div id="header-buttons-container">
            {@render buttons?.()}
        </div>
    </div>
    <div id="container-narrow">
        <div id="top-narrow">
            <div id="title">
                {#if titleLink}
                    <a class="unstyled-link" href={titleLink}
                        ><h1>{title}</h1></a
                    >
                {:else}
                    <h1>{title}</h1>
                {/if}
            </div>
            <div id="header-buttons-container">
                {@render buttons?.()}
            </div>
        </div>
        {#if centerTitle != ""}
            <div id="center-title">
                <h2>{centerTitle}</h2>
            </div>
        {/if}
    </div>
</div>

<!-- TODO add h1 tag for seo -->

<style>
    #header-bar {
        /* background-color: var(--bg); */
        z-index: 2;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: var(--outer-margin);
        padding-bottom: var(--em);
        display: flex;
        flex-direction: row;
        background-color: var(--color-bg);
        min-height: var(--button-area);
    }

    /* Left and right areas should grow to fill space even when empty.
	   Use a zero basis so they claim available space regardless of content. */
    #title,
    #header-buttons-container {
        /*flex: 1 1 0;*/
        min-width: 0;
        display: flex;
        align-items: center;
        gap: var(--button-gap);
        flex-grow: 1;
    }

    #header-buttons-container {
        justify-content: flex-end;
    }

    #header-buttons-container :global(div) {
        display: flex;
        flex-direction: row;
    }

    #center-title {
        display: flex;
        gap: var(--em);
    }

    #container-wide,
    #top-narrow {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--em);
    }

    #container-narrow {
        display: none;
    }

    @media (max-width: 720px) {
        #container-wide {
            display: none;
        }
        #container-narrow {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            /*gap: var(--mini-gap);*/
        }
        #center-title {
            flex-grow: 1;
            /*justify-content: center;*/
        }
    }
</style>
