<script lang="ts">
	import Portal from "$components/Portal.svelte";
	import { makeId } from "$lib/browser/form.svelte";
	import { onMount, type Snippet } from "svelte";
	import Button from "./Button.svelte";
	import { fly, fade } from "svelte/transition";

	export interface ModalAction {
		/** Label for the action button */
		label: string;
		/** Callback function when the action is triggered */
		onclick: () => unknown | Promise<unknown>;
		/** Variant of the action button. Defaults to 'primary'. */
		variant?: "primary" | "secondary" | "destructive";
		/** Whether the action is disabled */
		disabled?: boolean;
	}

	export interface Props {
		/** Unique identifier for the modal. */
		id?: string;
		/** Title shown in the modal header. */
		title?: string;
		/**
		 * The size of the modal.Before the Modal is shown, this can be changed to any of the provided values. After the Modal is shown, this can can only be changed between small, base, and large.
		 */
		size?: "small" | "base" | "large" | "max";
		/** Actions that appear in the modal's footer. */
		actions?: ModalAction[];
		/** Content rendered inside the modal. */
		children?: Snippet;
		/** Event that is called when the modal is closed. */
		onclose?: (ev: Event) => void;
	}

	let {
		id = makeId(),
		title,
		size,
		actions = [],
		onclose,
		children,
	}: Props = $props();

	let el: HTMLElement | null = $state(null);
	let contentEl: HTMLElement | null = $state(null); // reference to internal content element
	let activeAction: ModalAction | null = $state(null);

	onMount(() => {
		window.addEventListener("keydown", onkeydown);
		return () => {
			window.removeEventListener("keydown", onkeydown);
		};
	});

	function dismiss() {
		onclose?.(new Event("close"));
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event?.preventDefault();
			event?.stopImmediatePropagation();
			dismiss();
		}
	}

	async function onclick(event: MouseEvent, action: ModalAction) {
		event.preventDefault();
		event.stopImmediatePropagation();

		try {
			activeAction = action;
			await action.onclick?.();
		} catch (error) {
			console.error("Error executing action:", error);
		} finally {
			activeAction = null;
		}
	}
</script>

<Portal>
	{#key id}
		<div
			class="modal is-{size}"
			in:fly={{ duration: 250 }}
			out:fade
			bind:this={el}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="modal-overlay" onclick={dismiss}></div>
			<article class="modal-box">
				<header class="modal-header row justify-between p-lg">
					<h1 class="heading lg">{title}</h1>
					<Button onclick={dismiss} label="close" iconOnly />
				</header>
				<section
					class="modal-content stack align-stretch p-md gap-md scroll-y"
				>
					{@render children?.()}
				</section>
				<footer class="modal-actions p-md row gap-sm justify-end">
					{#each actions as action}
						<Button
							onclick={(e) => onclick(e, action)}
							disabled={action.disabled || !!activeAction}
							loading={activeAction === action}
							label={action.label}
						/>
					{/each}
				</footer>
			</article>
		</div>
	{/key}
</Portal>

<style>
	:global(body):has(.modal) {
		overflow: hidden;
	}

	.modal {
		position: fixed;
		z-index: var(--z-modal);
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		pointer-events: none;
	}

	@media (min-width: 48em) {
		.modal {
			justify-content: center;
		}
	}

	.modal-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.25);
		z-index: 10;
		pointer-events: all;
	}

	.modal:focus {
		outline: 0;
	}

	.modal-box {
		--modal-dialog-vertical-spacing: 3.75rem;
		pointer-events: initial;
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-height: calc(100vh - var(--modal-dialog-vertical-spacing));
		background: var(--color-bg-surface);
		box-shadow: var(--shadow-600);
		overflow: hidden;
		z-index: 15;
	}

	@media (forced-colors: active) {
		.modal-box {
			border: var(--border-width-025) solid transparent;
		}
	}

	@media (max-width: 47.9975em) {
		.modal-box {
			bottom: 0;
			max-height: 100%;
		}
	}

	@media (min-width: 48em) {
		.modal-box {
			position: relative;
			max-width: 38.75rem;
			margin: 0 auto;
			border-radius: var(--border-radius-400);
		}
	}

	@media (min-width: 48em) and (min-height: 41.25em) {
		.modal-box.modal-Dialog--limitHeight {
			max-height: 37.5rem;
		}
	}

	@media (min-width: 48em) {
		.modal-box.is-small {
			max-width: 23.75rem;
		}
	}

	@media (min-width: 48em) {
		.modal-box.is-large {
			max-width: calc(100% - var(--space-1600));
		}
	}

	@media (min-width: 65em) {
		.modal-box.is-large {
			max-width: 61.25rem;
		}
	}

	.modal-box.is-max {
		height: 100%;
	}

	@media (min-width: 48em) {
		.modal-box.is-max {
			height: unset;
		}
	}

	.modal-box {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		will-change: transform, opacity;
		opacity: 1;
		transform: translateY(0);
		transition:
			transform var(--motion-ease) var(--motion-duration-200),
			opacity var(--motion-ease) var(--motion-duration-200);
	}

	.is-entering,
	.is-exiting,
	.is-exited {
		opacity: 0;
		transform: translateY(12.5rem);
	}

	.has-entered {
		opacity: 1;
		transform: translateY(0);
	}

	.modal-header {
		background: var(--color-bg-surface-secondary);
	}

	.modal-content {
		border-top: var(--border-width-025) solid var(--color-border-secondary);
		border-bottom: var(--border-width-025) solid
			var(--color-border-secondary);
	}

	.modal-Section--titleHidden {
		padding-right: calc(
			var(--space-1200) + var(--space-100) + var(--space-100)
		);
	}

	.modal__Body,
	.modal__NoScrollBody {
		flex-grow: 1;
	}

	@media (min-width: 48em) {
		.modal__Body,
		.modal__NoScrollBody {
			flex-grow: unset;
		}
	}
</style>
