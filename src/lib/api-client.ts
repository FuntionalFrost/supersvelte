// src/lib/api-client.ts
import type { AppType } from '#lib/server/api/index.js';
import { hc } from 'hono/client';

/**
 * Creates a typed Hono RPC client instance.
 * @param customFetch Pass `event.fetch` when calling from SvelteKit loaders or actions.
 * @param origin Pass `event.url.origin` if calling during SSR.
 */
export function createApiClient(customFetch?: typeof fetch, origin?: string) {
	const baseUrl =
		origin ??
		(typeof window !== 'undefined'
			? window.location.origin
			: process.env.ORIGIN || 'http://localhost:5173');

	return hc<AppType>(baseUrl, { fetch: customFetch });
}

// Default client-side RPC instance (browser only)
export const client = createApiClient();
