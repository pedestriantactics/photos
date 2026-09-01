/**
 * This class allows us to create reactive sets
 */
export class reactiveSet<T> {
    private set = $state(new Set<T>())
    size = this.set.size;

    constructor(initial?: Iterable<T>) {
        if (initial) {
            this.set = new Set(initial);
        }
    }

    add(value: T) {
        this.set = new Set(this.set).add(value);

    }

    remove(value: T) {
        const next = new Set(this.set);
        next.delete(value);
        this.set = next;
    }

    has(value: T): boolean {
        return this.set.has(value);
    }

    values(): T[] {
        return [...this.set]
    }

    [Symbol.iterator]() {
        return this.set[Symbol.iterator]();
    }
}