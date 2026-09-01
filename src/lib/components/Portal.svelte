<script lang="ts">
    import { onMount, type Snippet } from "svelte";

    interface Props {
        /** Target element to render the portal into. If not provided, a new div will be created and appended to the body */
        target?: HTMLElement;
        /** Should we ignore the portal and render the children directly? */
        ignore?: boolean;
        /** Children to render inside of the portal */
        children?: Snippet;
    }

    let { target = document.body, ignore = false, children }: Props = $props();

    let ref: null | HTMLElement = $state(null);
    let portal: HTMLElement;

    if (!ignore) {
        onMount(() => {
            if (!ref) return;
            portal = document.createElement("div");
            portal.className = "portal";
            target.appendChild(portal);
            portal.appendChild(ref);
            return () => {
                target.removeChild(portal);
            };
        });
    }
</script>

{#if ignore}
    {@render children?.()}
{:else}
    <div class="portal">
        <div bind:this={ref}>
            {@render children?.()}
        </div>
    </div>
{/if}

<style>
    .portal {
        display: none;
    }
</style>
