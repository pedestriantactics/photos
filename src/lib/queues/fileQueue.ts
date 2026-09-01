export class FileQueue {
    private queue: File[] = [];

    enqueue(file: File): void {
        this.queue.push(file);
    }

    dequeue(): File | undefined {
        return this.queue.shift();
    }

    peek(): File | undefined {
        return this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue = [];
    }
}