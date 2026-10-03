// src/routes/(app)/+layout.server.ts
import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, resolve('login'));
	}

	return {
		user: locals.user,
		session: locals.session
	};
};
