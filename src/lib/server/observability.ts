import { dev } from "$app/environment";

export function captureException(error: unknown, context?: Record<string, unknown>) {

    // LATER:
    // import * as Sentry from '@sentry/sveltekit';
    // Sentry.captureException(error, { extra: context });

    if (dev) {
        console.error('[server error]', error, context);
    }
}