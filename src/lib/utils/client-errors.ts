export type ClientAppError = {
    message: string;
    code?: string;
    statusCode?: number;
    errorId?: string;
    fields?: Record<string, string>;
}

export function getClientAppError(error: unknown): ClientAppError {
    if (
        error &&
        typeof error === 'object' &&
        'body' in error &&
        error.body &&
        typeof error.body === 'object'
    ) {
        const body = error.body as Record<string, string>;

        return {
            message: typeof body.message === 'string'
                ? body.message
                : 'Something went wrong. Please try again.',
            code: typeof body.code === 'string' ? body.code : undefined,
            statusCode: typeof body.statusCode === 'number' ? body.statusCode : undefined,
            errorId: typeof body.errorId === 'string' ? body.errorId : undefined,
            fields: body.fields && typeof body.fields === 'object'
                ? body.fields as Record<string, string>
                : undefined
        }
    }

    return { message: 'Something went wrong. Please Try again.' };
}