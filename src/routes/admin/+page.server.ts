// src/routes/admin/+page.server.ts
import { auth } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	// Layout load already verified auth & admin role!
	// 1. Fetch initial list of registered users via Better Auth Server API
	const initialUsers = await auth.api.listUsers({
		headers: request.headers,
		query: { limit: 50 }
	});

	return {
		user: locals.user!,
		users: initialUsers?.users || []
	};
};
