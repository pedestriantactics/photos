<script lang="ts">
    import type { Component, Snippet } from "svelte";

    type IconProps = $$Generic<Record<string, any>>;

    /** Customize the classes applied to the button */
    export interface Props {
        /** What type of button to render */
        type?: "button" | "submit" | "reset";
        /** What style of button to render */
        variant?: "primary" | "default";
        /** Is the button loading */
        loading?: boolean;
        /** The size of the Button */
        size?: "sm" | "md" | "lg" | "xl";
        /** Is the the button disabled */
        disabled?: boolean;
        /** Display only the icon? */
        iconOnly?: boolean;
        /** Label for the button, used for accessibility and for content if no children are provided */
        label: string;
        /** The content of the button */
        children?: Snippet;
        /** Callback that is called when the button is clicked */
        onclick?(event: MouseEvent): unknown | Promise<unknown>;
    }

    let {
        type = "button",
        disabled = false,
        variant = "default",
        loading = false,
        iconOnly = false,
        size = "sm",
        label,
        onclick,
        children,
    }: Props = $props();

    let running = $state(false);

    const _loading = $derived(loading || running);

    async function handleClick(event: MouseEvent) {
        if (onclick) {
            try {
                running = true;
                await onclick(event);
            } catch (err) {
                console.error("Unhandled error in button onclick", err);
            } finally {
                running = false;
            }
        }
    }
</script>

<button {type} class={size} onclick={handleClick}>
    {@render contents()}
</button>

{#snippet contents()}
    {#if _loading}
        <div class="button-spinner">
            <p>loading</p>
        </div>
    {:else if !iconOnly}
        {#if children}
            {@render children()}
        {:else}
            <span>{label}</span>
        {/if}
    {/if}
{/snippet}
