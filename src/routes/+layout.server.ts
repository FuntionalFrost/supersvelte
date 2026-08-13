import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals }) => {
	// Pass the user and session populated by Better Auth in hooks.server.ts
	return {
		user: locals.user,
		session: locals.session
	};
};
