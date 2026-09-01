<!-- this is deprecated in favor of FormField -->

<script lang="ts">
    interface Props {
        /** Is the field disabled */
        disabled?: boolean;
        /** Style for the text field */
        style?: "primary" | "secondary";
        /** Max character length for the text field */
        maxLength?: number;
        /** Number of rows to start with */
        rows?: number;

        /** Bindable value of the text */
        value: string | undefined;
        /** Placeholder text */
        placeholder?: string;
        /** Callback when the user makes a change to the value */
        onchange?(): void | Promise<void>;
    }

    let {
        disabled = false,
        rows = 1,
        maxLength,
        value = $bindable(),
        placeholder = "",
        onchange,
    }: Props = $props();
</script>

<div>
    <textarea
        bind:value
        {placeholder}
        maxlength={maxLength}
        {rows}
        class="auto-expand"
    >
    </textarea>
</div>

<style>
    .auto-expand {
        width: 100%;
        resize: vertical;
        overflow: hidden;
        max-height: 300px;
        overflow-y: auto;
        line-height: 1.5;
        font-size: 1rem;
        transition: height 0.2s ease;
    }
</style>
