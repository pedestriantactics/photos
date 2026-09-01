import { getClientAppError, type ClientAppError } from '$lib/utils/client-errors';
import {
    showClientErrorModal,
    showClientErrorToast
} from "$lib/stores/client-error-ui.svelte";
import { ErrorMethod } from '$lib/types/enums';

/**
 * Helper for handling RPC calls and wrapping them in error handling,
 * Example usages:
 * 
 * await withClientErrorHandling(
 *     () => userLogin({ email }),
 *     { mode: 'modal' }
 * );
 */


type ErrorHandlerOptions = {
    mode?: ErrorMethod;
    modalTitle?: string;
    onClose?: (error: ClientAppError) => void // modal
    onError?: (error: ClientAppError) => void // modal
};

type ErrorHandlingResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ClientAppError };

export async function withClientErrorHandling<T>(
    callback: () => Promise<T>,
    options: ErrorHandlerOptions = {}
): Promise<ErrorHandlingResult<T>> {
    try {
        return {
            ok: true,
            data: await callback()
        }
    } catch (error) {
        const appError = getClientAppError(error);
        const mode = options.mode ?? ErrorMethod.Inline;

        if (mode === ErrorMethod.Modal) {
            showClientErrorModal(appError, options.modalTitle);
        } 
        
        if (mode === ErrorMethod.Toast) {
            showClientErrorToast(appError);
        } 
        

        return {
            ok: false,
            error: appError
        }
    }
}