<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import {
        clientErrorUi,
        closeClientErrorModal,
        dismissClientErrorToast
    } from "$lib/stores/client-error-ui.svelte";

    let modalInstance: Modal;

    $effect(() => {
        if (clientErrorUi.modal && modalInstance) {
            modalInstance.openModal();
        }
    });
</script>

{#if clientErrorUi.modal}
    <Modal
        title={clientErrorUi.modal.title}
        message={clientErrorUi.modal.message}
        cancelButtonTitle={clientErrorUi.modal.buttonTitle}
        onCancel={closeClientErrorModal}
        bind:this={modalInstance}
    />
{/if}

{#if clientErrorUi.toasts.length}
    <div class="toast-region" aria-live="polite">
        {#each clientErrorUi.toasts as toast (toast.id)}
            <button
                class="toast"
                type="button"
                onclick={() => dismissClientErrorToast(toast.id)}
            >
                {toast.message}
            </button>
        {/each}
    </div>
{/if}