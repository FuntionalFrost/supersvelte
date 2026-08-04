import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

injectAnalytics({ mode: dev ? 'development' : 'production' });

export const load = async ({ locals }) => {
	// Pass the user and session populated by Better Auth in hooks.server.ts
	return {
		user: locals.user,
		session: locals.session
	};
};
