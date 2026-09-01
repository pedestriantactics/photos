import { browser } from "$app/environment";
import { afterNavigate, goto } from "$app/navigation";

/**
 * Stores the last path navigated *from*.
 * - Updated whenever navigation heppens
 * - Used to detect "back navigation" scenarios
 */
let lastPath = "";

/**
 * Sets up navigation helpers for the application
 * 
 * - Uses SvelteKits's `afterNavigate` hook to update `lastPath`
 * whenever the user navigates away from a page.
 * - `lastPath` is late used by `popOrReplace` to determine whether
 * to go back in history or replace the current URL.
 * 
 * Example:
 * ```ts
 * // +layout.svelte
 * import { setupNavigationHelpers } from "$lib/navigation"
 * setupNavigationHelpers(); 
 * ```
 */
export function setupNavigationHelpers() {
    if (browser) {
        afterNavigate(({ from }) => {
            lastPath = from?.url?.pathname || "";
        });
    }
}

/**
 * Navigates either "back" in history or replaces the current route
 * 
 * - If the given `path` matches the last path in the history stack,
 * then it calls `window.history.back()` (popping history by one).
 * - Otherwise, it uses SvelteKit's `goto()` with `replaceState: true`
 * to replace the current entry without adding a new history entry.
 * 
 * This  helps avoid duplicate history entries when re-navigating to
 * the same path the user just came form.
 * 
 * Example:
 * ```ts
 * popOrReplace("/dashboard"); // behaves like "back" if lastPath was /dashboard
 * 
 * ```
 * 
 * @param path - The target path to navigate to 
 * @returns 
 */
export function popOrReplace(path: string) {
    if (lastPath === path) {
        // Clear lastPath to avoid infinite loops
        lastPath = "";
        window.history.back(); // Go back one entry in history
        return;
    }

    // Otherwise, replace the current history entry with the new path
    return goto(path, { replaceState: true });
}