<!-- this is deprecated in favor of FormField -->

<script lang="ts">
    interface Props {
        /** Type of the text field */
        type?: "password" | "email" | "text";
        /** Is the field disabled */
        disabled?: boolean;
        /** Style for the text field */
        style?: "primary" | "secondary";
        /** Max character length for the text field */
        maxLength?: number;

        /** Bindable value of the text */
        value: string;
        /** Placeholder text */
        placeholder?: string;
        /** Callback when the user makes a change to the value */
        onchange?(): void | Promise<void>;
    }

    let {
        type = "text",
        disabled = false,
        maxLength,
        value = $bindable(),
        placeholder = "",
        onchange,
    }: Props = $props();
</script>

<div>
    <input
        {type}
        disabled={false}
        maxlength={maxLength}
        bind:value
        {placeholder}
        {onchange}
    />
</div>
