import { auth } from '#lib/server/auth/index.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		throw redirect(307, '/login');
	}

	if (session.user.role !== 'admin') {
		throw error(403, 'Forbidden: Admin access required');
	}

	return {
		sessionUser: session.user
	};
};
