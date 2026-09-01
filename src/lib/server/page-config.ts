import { withPageConfig, type PageConfig } from '$lib/browser/page-config.svelte';
import { throwIfHttpError } from './error-handling';

export async function withServerPageConfig<C extends PageConfig>(config: C): Promise<C> {
    try {
        if (config.query) {
            await config.query;
        }

        return withPageConfig(config);
    } catch (err) {
        throwIfHttpError(err);
    }
}
