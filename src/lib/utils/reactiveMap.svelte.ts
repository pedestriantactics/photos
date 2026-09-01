/**
 * This class allows us to create reactive Maps
 */
export class reactiveMap<K, V> {
    private map = $state(new Map<K, V>())

    // constructor(initial?: Iterable<K>) {
    //     if (initial) {
    //         this.map = new Map(initial);
    //     }
    // }

    get entries() {
        return [...this.map.entries()] as [K, V][];
    }

    get values() {
        return [...this.map.values()] as V[];
    }

    get size() {
        return this.map.size;
    }

    add(key: K, value: V) {
        this.map = new Map(this.map).set(key, value);

    }

    remove(key: K) {
        const next = new Map(this.map);
        next.delete(key);
        this.map = next;
    }

    // non reactive getters
    has(key: K): boolean { return this.map.has(key); }
    get(key: K): V | undefined { return this.map.get(key); }
}