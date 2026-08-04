// src/routes/admin/+page.server.ts
import { auth } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ request }: { request: Request }) => {
	// 1. Read session from incoming cookies
	const session = await auth.api.getSession({
		headers: request.headers
	});

	// 2. Redirect guests to login
	if (!session) {
		throw redirect(307, '/login');
	}

	// 3. Block standard non-admin users
	if (session.user.role !== 'admin') {
		throw error(403, 'Forbidden: Admin access required');
	}

	// 4. Fetch initial list of registered users via Better Auth Server API
	const initialUsers = await auth.api.listUsers({
		headers: request.headers,
		query: { limit: 50 }
	});

	return {
		user: session.user,
		users: initialUsers?.users || []
	};
};
