// src/routes/admin/+layout.server.ts
import { resolve } from '$app/paths';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, resolve('login'));
	}

	if (locals.user.role !== 'admin') {
		error(403, 'Forbidden: Admin access required');
	}

	return {
		sessionUser: locals.user
	};
};
