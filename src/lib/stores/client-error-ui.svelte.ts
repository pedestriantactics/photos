import type { ClientAppError } from '$lib/utils/client-errors';

export type ClientErrorModal = {
    title?: string;
    message: string;
    buttonTitle?: string;
    error: ClientAppError;
    onClose?: (error: ClientAppError) => void;
}

export type ClientErrorToast = {
    id: number;
    message: string;
    error: ClientAppError;
    onError?: (error: ClientAppError) => void;
}

let nextToastId = 1;

export const clientErrorUi = $state({
    modal: null as ClientErrorModal | null,
    toasts: [] as  ClientErrorToast[]
})

export function showClientErrorModal(error: ClientAppError, title = 'Something went wrong') {
    clientErrorUi.modal = {
        title,
        message: error.message,
        buttonTitle: 'Okay',
        error
    };
}

export function closeClientErrorModal() {
    clientErrorUi.modal?.onClose?.(clientErrorUi.modal.error);
    clientErrorUi.modal = null;
}

export function showClientErrorToast(error: ClientAppError) {
    const toast = {
        id: nextToastId++,
        message: error.message,
        error
    };

    clientErrorUi.toasts = [...clientErrorUi.toasts, toast];

    setTimeout(() => {
        dismissClientErrorToast(toast.id);
    }, 5000);
}

export function dismissClientErrorToast(id: number) {
    const toast = clientErrorUi.toasts.find((toast) => toast.id === id);
    toast?.onError?.(toast.error);
    
    clientErrorUi.toasts = clientErrorUi.toasts.filter((toast) => toast.id !== id);
}