// -------------------------------
// Type Utilities for Dot-Notation Paths
// -------------------------------

/**
 * Primitive values that cannot be traversed deeper via dot notation.
 * This prevents infinite recursion in type definitions.
 */
type Primitive = string | number | boolean | null | undefined | symbol | bigint;


/**
 * Recursively builds all valid dot-notation paths for a given type `T`.
 * 
 * Example:
 * ```ts
 * type Obj = { a: { b: number }, c: string[] };
 * DotPath<Obj>
 * // "a" | "a.b" | "c" | "c.0" | "c.0.<subpaths>"
 * ```
 * 
 * @template T - The type to derive paths from
 * @template K - Current key of `T` being processed
 */
type PathImpl<T, K extends keyof T> =
    K extends string
    ? T[K] extends Primitive
    // If the property is a primitive -> just "K"
    ? K
    : T[K] extends Array<infer U>
    // If the property is is an array...
    ? U extends Primitive
    // Array of primitives -> "K" or "K.<numbers>"
    ? K | `${K}.${number}`
    // Array of objects -> "K.<number>" or "K.<number>.<nested paths>"
    : `${K}.${number}` | `${K}.${number}.${PathImpl<U, keyof U>}`
    // Otherwise it's an object -> "K" or "K.<nested paths>"
    : `${K}` | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : never;

/**
 * Produces a union of all possible dot-notation paths into object `T`.
 */
export type DotPath<T> = PathImpl<T, keyof T>;


// ------------------------------
// Type Utility for Value Lookup
// ------------------------------

/**
 * Resolve the type at a given dot-notation path `P` inside type `T`.
 * 
 * Example:
 * ```ts
 *  type Obj = { a: { b: number }, c: string []};
 *  PathValue<Obj, "a.b">   // number
 *  PathValue<Obj, "c.0">   // string
 * ```
 */
export type PathValue<T, P extends string> =
    P extends `${infer K}.${infer Rest}` // Split path at first dot
    ? K extends keyof T
    ? T[K] extends Array<infer U>
    // If it's an array, expect numeric index followed by optional nested path
    ? Rest extends `${number}.${infer NestedRest}`
    ? PathValue<U, NestedRest> // Array element property
    : Rest extends `${number}`
    ? U // Direct array element
    : never
    // Otherwise recurse into object properties
    : PathValue<T[K], Rest>
    : never
    : P extends keyof T
    ? T[P] // Direct property access
    : P extends `${number}`
    ? T extends Array<infer U>
    ? U // Whole array element
    : never
    : never;

// -----------------------
// Runtime Helpers
// -----------------------

/**
 * Splits a dot-notation path string into segments.
 * Numeric segments (e.g. "0") are converted to numbers for array indexing.
 * 
 * Example:
 * ```ts
 *  parsePath("a.0.b")  // ["a", 0, "b"]
 * ```
 * @param path 
 * @returns 
 */
function parsePath(path: string): (string | number)[] {
    return path.split(".").map(segment => {
        const num = Number(segment);
        return isNaN(num) ? segment : num;
    });
}

// --------------------------
// Core Functions
// --------------------------

/**
 * Retrieves the value at the specified path in an object.
 * 
 * - If the path does not exist, returns `undefined`.
 * - Path can include array indices, e.g. "a.0.b"
 * 
 * Example: 
 * ```ts
 *  const obj - { a: { b: [ { c: 42 } ] } }
 *  dotGet(obj, "a.b.0.c"); // 42
 * ```
 * @param obj 
 * @param path 
 * @returns 
 */
export function dotGet<T, P extends DotPath<T>>(
    obj: T,
    path: P,
): PathValue<T, P> {
    const segments = parsePath(path);
    let current: any = obj;

    for (const segment of segments) {
        if (current == null) {
            // Stop if current branch is null/undefined
            return undefined as PathValue<T, P>;
        }
        current = current[segment];
    }

    return current as PathValue<T, P>;
}





/**
 * Sets a value at the specific path in an object.
 * 
 * - If the path does not exist, it automatically creates missing
 *  objects `{}` or arrays `[]` as needed.
 * - Path can include array indices, e.g. "a.0.b".
 * 
 * Example:
 * ```ts
 * const obj = {};
 * dotSet(obj, "a.0.b", 123);
 * // obj = { a: [ { b: 123 } ] }
 * ```
 * @param obj 
 * @param path 
 * @param value 
 */
export function dotSet<T, P extends DotPath<T>>(
    obj: T,
    path: P,
    value: PathValue<T, P>,
): void {
    const segments = parsePath(path);
    let current: any = obj;

    // Traverse until the second-to-last segment
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        // Create missing structure if needed
        if (current[segment] == null) {
            const nextSegment = segments[i + 1];
            current[segment] = typeof nextSegment === "number" ? [] : {};
        }

        current = current[segment];
    }

    // Assign value at the last segment
    const lastSegment = segments[segments.length - 1];
    current[lastSegment] = value;
}

/**
 * Deletes a value at the specified path in an object.
 * 
 * - If the path does not exist, nothing happens.
 * - Supports array indices. For array, elements are spliced
 * to maintain proper indexing.
 * 
 * Example:
 * 
 * ```ts
 *  const obj = { a: [ { b: 1 }, { b: 2 } ] };
 *  dotDelete(obj, "a.0");
 * // obj = { a: [ { b: 2 } ] }
 * ```
 * @param obj 
 * @param path 
 * @returns 
 */
export function dotDelete<T, P extends DotPath<T>>(
    obj: T,
    path: P,
): void {
    const segments = parsePath(path);
    let current: any = obj;

    // Traverse until the second-to-last segment
    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        if (current[segment] == null) {
            return; // Path does not exist -> nothing to delete
        }

        current = current[segment];
    }

    const lastSegment = segments[segments.length - 1];

    if (Array.isArray(current) && typeof lastSegment === "number") {
        // If target is array -> remove element cleanly
        current.splice(lastSegment, 1);
    } else {
        // Otherwise -> normal object property delete
        delete current[lastSegment];
    }

}