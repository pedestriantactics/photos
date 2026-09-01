<script lang="ts">
    import IconButton from "$lib/components/IconButton.svelte";
    let {
        title = "",
        type = "text",
        state = "default",
        hint,
        value = $bindable(""),
        errorText = "Error!",
        rightButtonVisible = false,
        rightButtonIconName = "icon-trash",
        onClickRightButton,
        size = "normal"
    }: Props = $props();
</script>

<div id="container">
    <!-- TODO Dan: vertically center this -->
    {#if title}
        <span class="form-field-title caption">{title}</span>
    {/if}
    {#if state === "default"}
        {#if type === "textArea"}
            <textarea placeholder={hint} bind:value></textarea>
        {:else if type === "date"}
            <input
                type="date"
                data-size={size}
                class="input-date"
                placeholder={hint}
                bind:value
            />
        {:else}
            <input data-size={size} size="5" type="text" placeholder={hint} bind:value />
        {/if}
    {:else if state === "disabled"}
        {#if type === "textArea"}
            <textarea placeholder={hint} bind:value disabled></textarea>
        {:else if type === "date"}
            <input
                type="date"
                data-size={size}
                class="input-date"
                placeholder={hint}
                bind:value
                disabled
            />
        {:else}
            <input
                size="5"
                data-size={size}
                type="text"
                placeholder={hint}
                bind:value
                disabled
            />
        {/if}
    {:else if state === "error"}
        {#if type === "textArea"}
            <div id="error-container">
                <textarea class="error" placeholder={hint} bind:value
                ></textarea>
                <span id="error-text">{errorText}</span>
            </div>
        {:else if type === "date"}
            <input
                type="date"
                data-size={size}
                class="input-date"
                placeholder={hint}
                bind:value
                disabled
            />
        {:else}
            <div id="error-container">
                <input
                    size="5"
                    data-size={size}
                    class="error"
                    type="text"
                    placeholder={hint}
                    bind:value
                />
                <span class="error-text">{errorText}</span>
            </div>
        {/if}
    {/if}
    {#if rightButtonVisible}
        <IconButton
            iconName={rightButtonIconName}
            onclick={onClickRightButton}
        />
    {/if}
</div>

<style>
    :root {
        --form-min-height: 40px;
    }

    input[data-size="small"] {
      width: 6em;
      flex-grow: 0;
    }

    #container {
        display: flex;
        flex-direction: row;
        align-items: top;
        /* the gap between the title and the field */
        gap: var(--mini-gap);
        /*min-height: var(--form-min-height);*/
    }

    #container > :first-child {
        width: var(--form-title-width);
        display: flex;
        align-items: center;
        min-height: var(--form-min-height);
    }

    #error-container {
        display: flex;
        flex-direction: column;
        gap: var(--mini-gap);
    }

    .error {
        border-color: var(--color-warning);
    }

    @media (max-width: 320px) {
        /*makes the title not take up the original height*/
        :root {
            --form-min-height: 0;
        }

        #container {
            flex-direction: column;
        }
    }
</style>
