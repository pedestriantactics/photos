import { type } from "arktype";
import { SvelteSet } from "svelte/reactivity";
import { deepCopy } from "$lib/utils/deepCopy";
import { deepDiff } from "$lib/utils/deepDiff";
import { dotGet, dotSet, type DotPath, type PathValue } from "../utils/dot";


let _fieldIdCounter = 0;

/**
 * Creates a unique ID string for form fields.
 * 
 * - Ensures each field component can get a unique `id` attribute.
 * 
 * Example:
 * ```ts
 * const id = makeId(); // "field-1", "field-2", ...
 * @returns 
 */
export function makeId(): string {
    return `field-${++_fieldIdCounter}`;
}

// ----------------------
// Field Types
// ----------------------

/**
 * Generic field descriptor for inputs.
 * Provides both value and validation metadata.
 */
export interface Field<T = any> {
    /** Value of the field. */
    value: T;
    /** Current validation error message, if any. */
    error?: string;
    /** Is the field currently valid? (i.e. no validation errors) */
    valid: boolean;
    /** Has the field been touched? This means the user has interacted with it. */
    touched: boolean;
    /** Has the field value changed within the form since the last commit? */
    changed: boolean;
    /** Helper method to mark the field as touched when it loses focus. */
    onblur(e: FocusEvent): void;
}

/**
 * Specialized field descriptor for checkboxes
 * - Uses `checked` instead of `value`
 * - Same validation/touched/changed semantics
 */
export interface CheckboxField {
    /** Value of the checkbox field. */
    checked: boolean;
    /** Current validation error message, if any. */
    error?: string;
    /** Is the checkbox field currently valid? (i.e. no validation errors) */
    valid: boolean;
    /** Has the checkbox field been touched? This means the user has interacted with it. */
    touched: boolean;
    /** Has the checkbox field value changed within the form since the last commit? */
    changed: boolean;
}

// -----------------
// Utility Types
// -----------------


/**
 * Builds a union of all deep keys (dot paths) within an object.
 * Example: { a: { b: number }, c: string } -> "a" | "a.b" | "c"
 */
type DeepKeys<T> = T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? T[K] extends object
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : `${K}`
        : never;
    }[keyof T]
    : never;

/**
 *  Returns dot-paths that resolve to a given value type.
 *  Example: PathsToType<{ a: string, b: number }, string> -> "a"
 */
type PathsToType<T, V> = T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? T[K] extends V
        ? `${K}` // Direct match
        : T[K] extends object
        ? PathsToType<T[K], V> extends never
        ? never
        : `${K}.${PathsToType<T[K], V>}` // Recursive search
        : never
        : never;
    }[keyof T]
    : never;


/**
 * Resolves the type of the value at a given dot-path `P` within object `T`.
 */
type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : never
    : P extends keyof T
    ? T[P]
    : never;

// ---------------------------
// Form Context and Config
// ---------------------------

/** The runtime form instance type */
export type FormContext<T extends object> = ReturnType<typeof createForm<T>>;

/**
 * Props used by form field components.
 * Either:
 *  - `form + path` (field binding)
 *  - or nothing (standalone field)
 */
export type FormProps<T extends object, V> = {
    /** Form context to use for the form */
    form: FormContext<T>;
    /** The path to the field in the form state */
    path: PathsToType<T, V>;
} | {
    form?: never;
    path?: never;
}

/**
 * Options used when creating a form
 */
interface FormConfig<T extends object> {
    /** Schema to validate th form state against */
    schema: type<T>;
    /** The initial state of the form */
    state: T;
    /** When True, the form will start dirty */
    startDirty?: boolean;
    /** Function to call when submitting the form */
    submit?: (state: T) => void | Promise<void>;
    /** Function to call when the form is reset/discarded */
    reset?: () => void | Promise<void>;
    /** Message to use when the Form is submitted successfully. _Defaults to `"Your changes have been saved."`._ */
    successMessage?: string;
    /** Message to use when the form submission fails. _Defaults to `"An error occurred while saving your changes."._` */
    errorMessage?: string;
}

// --------------------
// Form Factory
// --------------------

/**
 * Creates a reactive form context with state, validation, and helpers
 * @param param0 
 * @returns 
 */
export function createForm<T extends object>({
    schema,
    state: initialState,
    startDirty,
    submit,
    reset,
    successMessage,
    errorMessage,
}: FormConfig<T>) {
    // Reactive form state (deep cloned to prevent mutating initialState directly)
    let _state = $state(deepCopy(initialState));

    // Tracks touched fields (dot paths)
    const _touched = $state(new SvelteSet<string>);

    // Derive differences between initial state and current state
    const _diffs = $derived(deepDiff(initialState, $state.snapshot(_state) as T));

    // Run schema validation against state
    const _result = $derived(schema(_state));

    // Whether the form has changed since commit/reset
    const _changed = $derived(_diffs.length > 0 || startDirty);

    /**
     * Creates a reactive `Field` object for a given path in form state.
     */
    function createField<P extends DotPath<T>>(pathString: P): Field<PathValue<T, P>> {
        // Arktype uses square-bracket syntax for array paths
        const errorPath = pathString.replace(/\.([0-9]+)/g, "[$1]");
        const errors = $derived(_result instanceof type.errors ? _result.byPath?.[errorPath] ?? null : null);
        const touched = $derived(_touched.has(pathString));

        return {
            get valid() { return errors === null; },
            get touched() { return touched; },
            set touched(v: boolean) {
                if (v) {
                    _touched.add(pathString);
                } else {
                    _touched.delete(pathString);
                }
            },
            get changed() { return _diffs.includes(pathString); },
            get error() { return errors?.message ?? undefined },
            get value() { return dotGet<T, P>(_state, pathString); },
            set value(v: PathValue<T, P>) {
                dotSet<T, P>(_state, pathString, v);
            },
            onblur() {
                _touched.add(pathString);
            },
        };
    }


    /**
     * Creates a `CheckboxField` object for a given path in form state.
     * - Always considered valid
     * - Uses boolean `checked` instead of `value`
     */
    function createCheckboxField<P extends DotPath<T>>(pathString: P): CheckboxField {
        return {
            get valid() { return true; }, // Checkboxes don't have validation errors
            get touched() { return _touched.has(pathString); },
            set touched(v: boolean) {
                if (v) {
                    _touched.add(pathString);
                } else {
                    _touched.delete(pathString);
                }
            },
            get changed() { return _diffs.includes(pathString); },
            get error() { return undefined; }, // No error for checkboxes
            get checked() { return !!dotGet<T, P>(_state, pathString); }, // Convert to boolean
            set checked(v: boolean) {
                dotSet<T, P>(_state, pathString, v as any);
                _touched.add(pathString); // Mark as touched when changed
            },
        };
    }


    // ------------------
    // Form object API
    // ------------------

    const form = {
        /** Commits the current state as the new initial state. */
        commit() {
            startDirty = false; // clear alwaysDirty flag when committing
            initialState = $state.snapshot(_state) as T;
            _state = $state.snapshot(_state) as T;
            _touched.clear();
        },
        /** Resets the form to its initial state. */
        async reset() {
            await reset?.();
            startDirty = false; // clear alwaysDirty flag when resetting
            _state = deepCopy(initialState);
            _touched.clear();
        },
        /** Touches all fields that have an error, forcing the errors to be shown. */
        touchInvalid() {
            if (_result instanceof type.errors) {
                for (const path in _result.byPath) {
                    _touched.add(path as string);
                }
                console.log(form.errors);
            }
        },
        /** Returns true if the form state is valid according to the schema. */
        get valid() { return !(_result instanceof type.errors); },
        /** Returns true if the form state has changed since the last commit. */
        get changed() { return _changed; },
        /** Returns the validation error object if the form state is invalid, or null if valid. */
        get errors() { return _result instanceof type.errors ? _result : null; },
        /** Returns an array containing the paths of fields that have changed since the last commit. */
        get diffPaths() { return _diffs; },
        /** Returns the current form state. */
        get state() { return _state; },
        /** Sets the form state to a new value, merging with the current state. */
        set state(newState: T) { _state = newState; },
        /** Returns a set of field paths that have been touched. */
        get touched() { return _touched; },
        /** Provides scoped access to a specific field in the form state. */
        field<P extends DeepKeys<T>>(path: P): Field<ValueAtPath<T, P>> {
            return createField(path as any) as Field<ValueAtPath<T, P>>;
        },
        /** Provides scoped access to a checkbox field in the form state. */
        checkbox<P extends PathsToType<T, boolean>>(path: P): CheckboxField {
            return createCheckboxField(path as any) as CheckboxField;
        },


        /**
         * Submits the form.
         * - If invalid, marks invalid fields as touched
         * - If valid, runs the `submit` callback and commits the state
         * - Returns `true` if successful, `false` if error
         */
        async submit() {
            try {
                console.log(form.state);
                if (!form.valid) {
                    form.touchInvalid(); // reveal all errors
                    return;
                }

                await submit?.($state.snapshot(_state) as T);
                form.commit(); // commit the current state

                // show success message
                // notify({ message: successMessage ?? "Your changes have been saved." });

                return true;
            } catch (error) {
                // show error message
                // notify({ message: errorMessage ?? "An error occurred while saving your changes.", error });

                return false;
            }
        },
    };

    return form;
}