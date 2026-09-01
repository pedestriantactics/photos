<script lang="ts">
    import Modal from "./Modal.svelte";

    interface Props {
        /** Callback that is called when a variant is successfully added. */
        oncreate(): void;
        /** Callback that is called when the modal is closed. */
        onclose(): void;
    }

    let { oncreate, onclose }: Props = $props();

    function printSomething() {
        console.log("CLICKED");
    }
</script>

<Modal
    title="test"
    size="large"
    {onclose}
    actions={[
        {
            label: "Discard",
            variant: "secondary",
            onclick: onclose,
        },
        {
            label: "Save",
            variant: "primary",
            onclick: printSomething,
        },
    ]}
></Modal>
