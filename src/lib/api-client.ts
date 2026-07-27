import type { AppType } from '$lib/server/api';
import { hc } from 'hono/client';

// Helper to create a custom Hono client with custom fetch (e.g. event.fetch)
export function createApiClient(customFetch?: typeof fetch) {
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
	return hc<AppType>(baseUrl, { fetch: customFetch });
}

// Client-side default instance
export const api = createApiClient();
