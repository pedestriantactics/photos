import { AppError, ServerError } from "$lib/utils/errors";
import { error as kitError, type RequestEvent } from "@sveltejs/kit";
import { captureException } from "./observability";


export function normalizeError(error: unknown): AppError {
    if (error instanceof AppError) return error;

    return new ServerError('Unexpected server error', error);
}

export function serializeAppError(error: AppError) {
    return {
        name: error.name,
        message: error.userMessage,
        code: error.code,
        statusCode: error.statusCode,
        http: error.http,
        errorId: crypto.randomUUID(),
        ...(error.context?.fields ? { fields: error.context.fields } : {})
    };
}

export function reportError(error: AppError, event: RequestEvent, errorId: string) {
    if (!error.reportToSentry) return;

	captureException(error, {
		errorId,
		code: error.code,
		statusCode: error.statusCode,
		context: error.context,
		url: event.url.pathname,
		method: event.request.method
	});
}

function getHttpError(err: unknown) {
    if (err instanceof AppError && err.http) {
        return {
            statusCode: err.statusCode,
            message: err.userMessage,
        };
    }

    if (
        err &&
        typeof err === 'object' &&
        'body' in err &&
        err.body &&
        typeof err.body === 'object' &&
        'http' in err.body &&
        'statusCode' in err.body &&
        'message' in err.body &&
        err.body.http === true &&
        typeof err.body.statusCode === 'number' &&
        typeof err.body.message === 'string'
    ) {
        return {
            statusCode: err.body.statusCode,
            message: err.body.message,
        };
    }

    if (
        err &&
        typeof err === 'object' &&
        'http' in err &&
        'statusCode' in err &&
        'message' in err &&
        err.http === true &&
        typeof err.statusCode === 'number' &&
        typeof err.message === 'string'
    ) {
        return {
            statusCode: err.statusCode,
            message: err.message,
        };
    }

    return null;
}

export function throwIfHttpError(err: unknown): never {
    const httpError = getHttpError(err);

    if (httpError) {
        throw kitError(httpError.statusCode, {
            message: httpError.message,
        });
    }

    throw err;
}

export function throwAppError(err: AppError, asHttp = false): never {
    if (asHttp) {
        throw kitError(err.statusCode, {
            message: err.userMessage,
        });
    }

    throw err;
}
