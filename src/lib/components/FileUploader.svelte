<script lang="ts">
    import type { FileQueue } from "$lib/queues/fileQueue";

    interface Props {
        /** Which files to accept */
        accept?: "image/*";
        /** Allow multiple items in an upload */
        multiple?: boolean;
        /** This is the queue for processing the files */
        fileQueue: FileQueue;
        /** Function that will run to process the files */
        processFiles?(): void;
    }

    let {
        accept = "image/*",
        multiple = false,
        fileQueue = $bindable(),
        processFiles,
    }: Props = $props();

    let fileInput: HTMLInputElement | null = null;

    /**
     * Handles the files from either input option
     * Adds files to the processing queue
     * @param files
     */
    function handleFiles(files: FileList) {
        // Adds all of the files to the queue
        for (const file of files) {
            fileQueue.enqueue(file);
        }

        if (processFiles) {
            processFiles();
        }
    }

    /* Handles file input through selection
     * @param event
     */
    function onFileInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        // On false event return
        if (!files) return;

        handleFiles(files);
    }

    /**
     * Handles file input through file drag and drop
     * @param event
     */
    function ondrop(event: DragEvent) {
        event.preventDefault();

        const files = event.dataTransfer?.files;

        // On false event return
        if (!files) return;

        handleFiles(files);
    }

    // Prevents the page from default behavior (opening image in new tab)
    function ondragover(event: DragEvent) {
        event.preventDefault();
    }
</script>

<div class="upload-area" {ondragover} {ondrop} role="region">
    <span class="text">Drag and drop files here, or click to upload</span>
    <input
        type="file"
        {accept}
        {multiple}
        hidden
        bind:this={fileInput}
        onchange={onFileInput}
    />
    <button type="button" onclick={() => fileInput?.click()}>
        Select Files
    </button>
</div>

<style>
    .upload-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        flex-direction: column;
        max-width: 500px;
        align-items: center;
    }

    .title-box {
        text-align: center;
    }

    .upload-area {
        border: 2px dashed #aaa;
        border-radius: 8px;
        max-width: 400px;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .upload-area:hover {
        background-color: #f0f0f0;
    }

    .upload-list-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto;
        gap: 1rem;
        position: relative;
        flex-direction: row;
    }
    .upload-item {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 1rem 0 0 1rem;
    }

    .upload-image {
        max-width: 100px;
        max-height: 100px;
    }

    .upload-text {
        text-align: center;
        justify-content: center;
        font-size: 1.2rem;
    }
</style>
