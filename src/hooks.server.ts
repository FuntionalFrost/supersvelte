// src/hooks.server.ts
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { checkRateLimit } from '$lib/server/ratelimit';
import type { Handle } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { docsRegistry } from '$lib/docs';
import { createYaxaHook } from 'yaxa-svelte/server';
import { siteConfig } from './site.config';

// 1. All-in-one Yaxa Hook for /robots.txt, /sitemap.xml, /sitemap.xsl, /site.webmanifest, and /api/og
const yaxaHook = createYaxaHook({
	config: siteConfig,
	sitemap: {
		config: siteConfig,
		dynamicRoutes: () =>
			docsRegistry.map((doc) => ({
				loc: `/docs/${doc.slug}`,
				changefreq: 'weekly' as const,
				priority: 0.8
			}))
	}
});

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/projects'];
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const EXCLUDED_RATE_LIMIT_PREFIXES = [
	'/api/auth',
	'/api/webhooks',
	'/api/queue',
	'/api/uploadthing'
];

const appHandle: Handle = async ({ event, resolve }) => {
	// 1. Guard against DB/Auth execution during build time
	if (building) {
		return resolve(event);
	}

	const pathname = event.url.pathname;

	// 2. Better Auth internal handler (/api/auth/*)
	if (pathname.startsWith('/api/auth')) {
		return svelteKitHandler({ event, resolve, auth, building });
	}

	// 3. Rate limiting (skips webhooks, file uploads, and background workers)
	const isExcludedApi = EXCLUDED_RATE_LIMIT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
	if (
		!isExcludedApi &&
		(pathname.startsWith('/api') || pathname.startsWith('/login') || pathname.startsWith('/signup'))
	) {
		const ip = event.getClientAddress();
		const result = await checkRateLimit(ip);

		if (!result.success) {
			error(429, 'Too many requests. Please slow down.');
		}
	}

	// 4. Populate Better Auth session into event.locals
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

	// 5. Admin Route Protection
	if (pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			const redirectTo = encodeURIComponent(pathname + event.url.search);
			redirect(303, `/login?redirectTo=${redirectTo}`);
		}
		if (event.locals.user.role !== 'admin') {
			error(403, 'Unauthorized. Admin access required.');
		}
	}

	// 6. User Route Protection & Auth Redirect Guards
	const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.user) {
		const redirectTo = encodeURIComponent(pathname + event.url.search);
		redirect(303, `/login?redirectTo=${redirectTo}`);
	}

	if (isAuthRoute && event.locals.user) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};

export { yaxaHook, appHandle };
export const handle = sequence(yaxaHook, appHandle);
