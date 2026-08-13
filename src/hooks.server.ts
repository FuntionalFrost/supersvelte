// src/hooks.server.ts
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { checkRateLimit } from '$lib/server/ratelimit';
import type { Handle } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/projects', '/admin'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Guard against DB/Auth execution during build time
	if (building) {
		return resolve(event);
	}

	const pathname = event.url.pathname;

	// 2. Delegate Better Auth internal API routes (/api/auth/*) early
	if (pathname.startsWith('/api/auth')) {
		return svelteKitHandler({ event, resolve, auth, building });
	}

	// 3. Rate limit sensitive routes
	if (pathname.startsWith('/api') || pathname.startsWith('/login')) {
		const ip = event.getClientAddress();
		const result = await checkRateLimit(ip);

		if (!result.success) {
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

	// 5. Route Protection & Redirect Guards
	const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.user) {
		const redirectTo = encodeURIComponent(pathname + event.url.search);
		throw redirect(303, `/login?redirectTo=${redirectTo}`);
	}

	if (isAuthRoute && event.locals.user) {
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
};
