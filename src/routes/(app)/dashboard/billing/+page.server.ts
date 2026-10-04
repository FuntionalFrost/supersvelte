// src/routes/(app)/dashboard/billing/+page.server.ts
import { resolve } from '$app/paths';
import { getUserPurchases } from '#lib/server/db/queries.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, resolve('login'));
	}

	const userPurchases = await getUserPurchases(locals.user.id);

	return {
		user: locals.user,
		purchases: userPurchases,
		purchase: userPurchases[0] ?? null
	};
};
