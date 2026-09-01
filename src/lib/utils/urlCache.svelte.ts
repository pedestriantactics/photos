import { signUrl } from "$rpc/files/signUrl.remote"

interface CachedUrl {
    url: string;
    signedAt: number;
}

class UrlCache {
    private cache = $state(new Map<string, CachedUrl>());
    private version = $state(0);
    private fetching = new Set<string>();
    private readonly maxAge: number;

    constructor(maxAgeMinutes: number = 50) {
        this.maxAge = maxAgeMinutes * 60 * 1000;
    }

    get(fileKey: string): string | null {
        const v = this.version; // Without this reactivity breaks
        const cachedUrl = this.cache.get(fileKey);
        if (!cachedUrl) return null;

        const age = Date.now() - cachedUrl.signedAt;
        if (age > this.maxAge) {
            this.cache.delete(fileKey);
            this.version++;
            return null;
        }

        return cachedUrl.url;
    }

    set(fileKey: string, url: string) {
        this.cache.set(fileKey, {
            url: url,
            signedAt: Date.now()
        });
        this.version++;
    }

    // Reset
    clear() {
        this.cache.clear();
        this.version++;
    }

    /**
     * Attempt to get the file,
     * If the file is not cached then it will get a new presigned URL
     */
    async getFile(fileKey: string) {
        let file = this.get(fileKey);

        if (!file) {
            file = (await signUrl({ fileKey })).url;
            this.set(fileKey, file);
        }
        return file;
    }


    /**
     * This gets the file fromUrl from cache
     * If the file has not been cached then it will fetch the file from object storage 
     */
    getOrFetch(fileKey: string): string | null {
        const cachedUrl = this.get(fileKey);

        if (!cachedUrl && !this.fetching.has(fileKey)) {
            // MicroTask to move the fetch outside reactive context
            queueMicrotask(() => {
                if (!this.fetching.has(fileKey)) {
                    this.fetching.add(fileKey);
                    this.getFile(fileKey).finally(() => {
                        this.fetching.delete(fileKey);
                    });
                }
            });
        }
        return cachedUrl;
    }
}

export const urlCache = new UrlCache(50) // Cache for 50 minutes