<script>
	let { showModal = $bindable(false), children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (!dialog) return;

		if (showModal && !dialog.open) {
			dialog.showModal();
		} else if (!showModal && dialog.open) {
			dialog.close();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	autofocus
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div>
		{@render children?.()}
	</div>
</dialog>

<style>
	dialog {
		border: none;
		padding: 0;
		background: transparent;
	}
	dialog::backdrop {
		background: var(--color-bg);
	}
</style>
