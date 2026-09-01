<script lang="ts">
    import IconButton from "$components/IconButton.svelte";
    import { onMount, type Component, type Snippet } from "svelte";

    interface Props {
        // this shows up in the top left of the modal
        title?: string;
        // this is a message that shows up in the modal
        // the content area can also be used instead of this for more custom items
        message?: string;
        // the close button in the upper right
        // if this is a basic warning don't show the close button and just use the confirm or cancel buttons
        xButtonVisible?: boolean;
        // if this is blank the confirm button won't show
        // confirm shows up to the right of cancel
        confirmButtonTitle?: string;
        confirmButtonIcon?: null | Component<any>;
        cancelButtonTitle?: string;
        // an optional function that is triggered when the modal is closed
        onConfirm?: () => void;
        onCancel?: () => void;
        content?: Snippet | null;
        buttons?: Snippet | null;
        size?: "small" | "medium" | "large";
    }

    let {
        title = "",
        message,
        xButtonVisible = false,
        confirmButtonTitle = "",
        cancelButtonTitle = "",
        onConfirm = closeModal,
        onCancel = closeModal,
        content = null,
        buttons = null,
        size = "small",
    }: Props = $props();

    let visible = $state(false);

    // The dialog element itself (assuming it gets referenced in the markup)
    let dialog: HTMLDialogElement;

        // Expose functions for the parent to call
	export function openModal() {

		dialog.showModal();
		visible = true;
	}

	export function closeModal() {
		dialog.close();
		visible = false;
	}
</script>

<dialog
	bind:this={dialog}
	class:is-visible={visible} data-size={size}
>
    <div id="modal-content">
        {#if title || xButtonVisible}
            <div id="title-area">
                <span>{title}</span>
                {#if xButtonVisible}
                    <IconButton
                        altTitle="Close"
                        iconName="icon-x"
                        onclick={() => closeModal()}
                    />
                {/if}
            </div>
        {/if}
        <div id="modal-body">
            {#if message}
                <p id="message">
                {message}
                </p>
            {/if}
            {@render content?.()}
                            {#if confirmButtonTitle || cancelButtonTitle || buttons}
            <div id="buttons-container">
                    {#if confirmButtonTitle}
                        <IconButton
                            title={confirmButtonTitle}
                            onclick={() => onConfirm?.()}
                        />
                    {/if}
                    {#if cancelButtonTitle}
                        <IconButton
                            title={cancelButtonTitle}
                            onclick={() => onCancel?.()}
                        />
                    {/if}

                {@render buttons?.()}
            </div>
                            {/if}
        </div>
    </div>
</dialog>

<style>

    /* Size variations (Width) */
    dialog[data-size="large"] {
      width: var(--modal-width-large);
    }

    dialog[data-size="medium"] {
      width: var(--modal-width-medium);
    }

    dialog[data-size="small"] {
      width: var(--modal-width-small);
    }

    /* Visibility control (The fix for the "not working" issue) */
    dialog:global(.is-visible) {
      visibility: visible; /* or visibility: visible; */
    }

    /* Optional: If you need to handle the hidden state truly gone */
    dialog:global(:not(.is-visible)) {
      visibility: hidden;
      display: none;
    }

    dialog {
        color: var(--color-fg);
        background-color: var(--color-modal-bg);
        border: none;
        padding: 0;
        max-width: calc(100% - (2 * var(--outer-margin)));
        max-height: calc(100% - (2 * var(--outer-margin)));
        display: flex;
    }

    #modal-content {
        display: flex;
        flex-direction: column;
        padding: calc(var(--outer-margin) * 1);
        gap: var(--em);
        width: 100%;
    }

    #modal-body {
        display: flex;
        flex-direction: column;
        gap: var(--em);
        flex-grow: 1;
        overflow-y: auto;
        text-align: center;
    }

    #message {
        margin: var(--outer-margin);
    }

    ::backdrop {
        background-color: var(--color-modal-overlay);
        opacity: 0.8;
    }

    #title-area {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    #buttons-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: var(--em);
    }

    /* this turns on scrolling when the window reaches a certain height */
    /* TODO Dan: figure out how to make this link to the variable up top so each modal can have a different height defined */
    @media (max-height: 750px) {
        #container {
            align-items: flex-start;
            margin-top: var(--top-margin);
            height: auto;
        }
    }
</style>
