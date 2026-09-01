<!-- this is a universal icon and text button -->
<!-- optionally adding an icon or text element will configure the button to include or not include it -->
<!-- the icon position relative to the text can also be changed -->

<script lang="ts">
    let {
        iconName = "",
        // used for profile initials
        bigTitle = false,
        title = "",
        altTitle = "Button",
        iconOnLeft = true,
        disabled = false,
        // highlights icon in red
        // TODO Dan: make this work
        warningColor = true,
        onclick,
    } = $props();
</script>

<button
    class="icon-button"
    {disabled}
    aria-label={altTitle}
    {onclick}
    style={`filter: opacity(${disabled ? 0.25 : 1});`}
>
    {#if iconName != "" && iconOnLeft}
        <img
            src={`/images/icons/${iconName}.svg`}
            alt={altTitle}
            style={warningColor ? "--icon-color: var(--color-warning)" : ""}
        />
    {/if}
    {#if title != ""}
        {#if bigTitle}
            <h3>{title}</h3>
        {:else}
            <h3 class="caption">{title}</h3>
        {/if}
    {/if}
    {#if iconName != "" && !iconOnLeft}
        <img src={`/images/icons/${iconName}.svg`} alt={altTitle} />
    {/if}
</button>

<style>
    button {
        display: flex;
        flex: row;
        gap: var(--mini-gap);
    }
    .icon-button {
        background: none;
        border: none;
        min-width: var(--button-area);
        height: var(--button-area);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Style for the icon image inside the button */
    .icon-button img {
        width: var(--icon-size);
        height: var(--icon-size);
    }

    @media (prefers-color-scheme: dark) {
        .icon-button img {
            filter: invert(1);
        }
    }
</style>
