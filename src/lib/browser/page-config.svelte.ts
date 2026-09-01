import type { Action, RemoteQuery } from "@sveltejs/kit";
import { setContext, type Component } from "svelte";
import type { FormContext } from "./form.svelte";
import type { ErrorMethod } from "$lib/types/enums";

export type PageErrorMode = ErrorMethod;

export type PageConfig<T = any> = {
    /** Title of the current page */
    title?: string;
    /** Skeleton component to use when loading the view */
    skeleton?: Component;
    /** Query to load data for the page. */
    query?: RemoteQuery<T>;
    /** Function that can reconfigure the page based on the loaded data */
    reconfigure?: (data: T) => Omit<PageConfig<T>, "query" | "reconfigure">
}

export function withPageConfig<C extends PageConfig>(config: C) {
    return {
        ...config,
    }
}

const PAGE_CTX_KEY = Symbol("page-context");


/**
 * The context object provided to view components to allow them
 * to specify the form context for the page they are rendered in.
 */
export type PageContext = ReturnType<typeof createPageContext>;


/**
 * Creates a context that view components can use to alter the main
 * page configuration _after_ the initial load. Overrides the data
 * set in the load function.
 */
export function createPageContext() {
    let form: FormContext<any> | null = $state(null);
    let primaryAction: Action | null = $state(null);

    const ctx = {
        get primaryAction() {
            return primaryAction;
        },
        set primaryAction(a: Action | null) {
            primaryAction = a;
        },
        set form(f: FormContext<any> | null) {
            form = f;
        },
        get form() {
            return form;
        },
    };

    setContext(PAGE_CTX_KEY, ctx);

    return ctx;
}