/**
 * Performs a deep copy (full clone) of the given value
 * 
 * - If `v` is a primitive (string, number, boolean, null, undefined, symbol, bigint),
 * it just returns the value directly (safe to reuse)
 * 
 * - If `v` is an array, it creates a new array and deep-copies each element.
 * - If `v` is a plan object, it creates a new object and deep-copies each property.
 * 
 * Example:
 * ```ts
 * const obj = {a: 1, b: { c: [2, 3] } };
 * const clone = deepCopy(obj);
 * 
 * clone.b.c.push(4);
 * console.log(obj.b.c);    // [2, 3]   (original unchanged)
 * console.log(clone.b.c);  // [2, 3, 4]
 * ```
 * @param v - Value to deep copy
 * @returns A deep-cloned-version of the input
 */
export function deepCopy<T>(v: T): T {
    if (typeof v === "object" && v !== null) {
        if (Array.isArray(v)) {
            // Deep-copy each element of the array
            return v.map((vv) => deepCopy(vv)) as unknown as T;
        } else {
            // Deep-copy each property of the object
            const copy: any = {};
            for (const key in v) {
                // Recursively copy nested values
                copy[key] = deepCopy(v[key]);
            }
            return copy;
        }
    } else {
        // Primitives can be returned directly
        return v;
    }
}