/**
 * Performs a deep comparison between two objects (or arrays) and
 * returns a list of paths (in dot notation) where the values differ.
 * 
 * - Useful for detecting changed (e.g., comparison form state with initial values).
 * - Paths are returned as strings like `"a.b.c"` or `"items.0.name"`.
 * 
 * Example:
 * ```ts
 *  const a = { x: 1, y: {z: 2} };
 *  const b = { x: 1, y: {z: 3} };
 *  deepDiff(a, b); //["y.z"]
 * ```
 * 
 * @param a - First object to compare
 * @param b - Second object to compare
 * @returns List of dot-notation paths where `a` and `b` differ
 */
export function deepDiff<T extends object>(a: T, b: T) {
    const diff: string[] = [];
    _diff(diff, "", a, b);
    return diff;
}

/**
 * Recursive helper that traverses both objects in parallel,
 * comparing values and recording paths where differences occur.
 * 
 * @param diff - Array that accumulates differing paths
 * @param path - Current path in dot notation (e.g. "user.address.city")
 * @param a - Current value from object A
 * @param b - Current value from object B
 * @returns 
 */
function _diff(diff: string[], path: string, a: any, b: any) {
    // If the values are strictly equal, no difference
    if (a === b) return;

    // If types are different, or one is null but not the other -> difference
    if (typeof a !== typeof b || a === null || b === null) {
        diff.push(path); // push "" if root-level values differ
        return;
    }

    // If both values are objects/arrays -> compare their keys/indices
    if (typeof a === "object" && typeof b === "object") {
        // Collect all unique keys from both objects
        const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

        for (const key of keys) {
            // Build new dot path; omit leading dot if at root
            _diff(diff, `${path}.${key}`, a[key], b[key]);
        }
    } else {
        // For primitive values (number, string, boolean, etc.) that differ
        diff.push(path);
    }
}