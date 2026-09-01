<script lang="ts">
    import type { Snippet } from "svelte";
    import Button, {
        type Props as ButtonProps,
    } from "$components/Button.svelte";

    interface Props {
        title?: string | Snippet;
        class?: string;
        padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
        gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
        radius?: "none" | "5" | "10" | "25" | "50";
        action?: Snippet | ButtonProps;
        children: Snippet;
    }

    let {
        title,
        class: classes = "",
        padding = "md",
        gap = "sm",
        radius = "none",
        action,
        children,
    }: Props = $props();
</script>

<div class="card gap-{gap} r-{radius} p-{padding} {classes}">
    {#if title}
        <header class="row justify-between gap-md">
            <div class="row gap-sm">
                {#if typeof title === "function"}
                    {@render title?.()}
                {:else}
                    <h3 class="heading sm">
                        {title}
                    </h3>
                {/if}
            </div>
            <div class="row gap-sm">
                {#if typeof action === "function"}
                    {@render action?.()}
                {:else if action}
                    <Button size="sm" {...action} />
                {/if}
            </div>
        </header>
    {/if}

    {@render children?.()}
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: clip;
        background-color: var(--bg-3);
    }
</style>
