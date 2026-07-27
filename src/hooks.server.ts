// src/hooks.server.ts
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// 1. Initialize Upstash Rate Limiter (Safely checks for env variables)
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
	ratelimit = new Ratelimit({
		redis: Redis.fromEnv(),
		limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
		analytics: true
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	// 2. Guard against DB/Auth execution during build time
	if (building) {
		return resolve(event);
	}

	// 3. Rate Limit sensitive routes (API & Auth)
	if (
		ratelimit &&
		(event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/login'))
	) {
		const ip = event.getClientAddress();
		const { success } = await ratelimit.limit(ip);

		if (!success) {
			throw error(429, 'Too many requests. Please slow down.');
		}
	}

	// 4. Inject Better Auth session into event.locals
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	// 5. Delegate request resolution and Better Auth route handling (/api/auth/*)
	return svelteKitHandler({ event, resolve, auth, building });
};
