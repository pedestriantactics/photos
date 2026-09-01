export type ErrorContext = Record<string, unknown>;

/**
 * Base application error class
 */
export class AppError extends Error {
    statusCode: number;
    code: string;
    userMessage: string;
    context?: ErrorContext;
    reportToSentry: boolean;
    override cause?: unknown;
    http: boolean;

    constructor(
        message: string,
        options: {
            statusCode?: number;
            code?: string;
            userMessage?: string;
            context?: ErrorContext;
            reportToSentry?: boolean;
            cause?: unknown;
            http?: boolean;
        } = {}
    ) {
        super(message);
        this.name = new.target.name;
        this.statusCode = options.statusCode ?? 500;
        this.code = options.code ?? 'APP_ERROR';
        this.userMessage = options.userMessage ?? message;
        this.context = options.context;
        this.reportToSentry = options.reportToSentry ?? false;
        this.cause = options.cause;
        this.http = options.http ?? false;

    }
}



// #region User Facing
export class ValidationError extends AppError {
    constructor(message = 'Invalid Input', http = false, context?: ErrorContext) {
        super(message, {
            statusCode: 400,
            code: 'VALIDATION_ERROR',
            userMessage: message,
            context
        })
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Invalid email or password', http = false) {
        super(message, {
            statusCode: 401,
            code: 'AUTHENTICATION_ERROR',
            userMessage: message,
            http
        })
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'You do not have permission to do that', http = false) {
        super(message, {
            statusCode: 403,
            code: 'AUTHORIZATION_ERROR',
            userMessage: message,
            http,
        })
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found', http = false) {
        super(message, {
            statusCode: 404,
            code: 'NOT_FOUND',
            userMessage: message,
            http
        })
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests. Please try again later', http = false) {
        super(message, {
            statusCode: 429,
            code: 'RATE_LIMITED',
            userMessage: message,
            http
        })
    }
}


// #region Internal Errors

export class ServerError extends AppError {
    constructor(message = "Internal server error", cause?: unknown, context?: ErrorContext) {
        super(message, {
            statusCode: 500,
            code: 'SERVER_ERROR',
            userMessage: 'Something went wrong, Please try again.',
            cause,
            context,
            reportToSentry: true
        })
    }
}

export class DatabaseError extends AppError {
    constructor(message = "Database error", cause?: unknown, context?: ErrorContext) {
        super(message, {
            statusCode: 500,
            code: 'DATABASE_ERROR',
            userMessage: 'Something went wrong, Please try again.',
            cause,
            context,
            reportToSentry: true
        })
    }
}

export class ExternalServiceError extends AppError {
    constructor(message = "External service error", cause?: unknown, context?: ErrorContext) {
        super(message, {
            statusCode: 502,
            code: 'EXTERNAL_SERVICE_ERROR',
            userMessage: 'A required service is unavailable, Please try again.',
            cause,
            context,
            reportToSentry: true
        })
    }
}