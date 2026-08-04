// src/lib/api-client.ts
import type { AppType } from '$lib/server/api'; // Fixed import path
import { hc } from 'hono/client';

/**
 * Creates a typed Hono RPC client instance.
 * @param customFetch Pass `event.fetch` when calling from SvelteKit `+page.server.ts` loaders or actions.
 */
export function createApiClient(customFetch?: typeof fetch) {
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
	return hc<AppType>(baseUrl, { fetch: customFetch });
}

// Default client-side RPC instance
export const client = createApiClient();
