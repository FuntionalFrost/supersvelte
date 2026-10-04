// src/routes/+layout.server.ts
import { getUserPurchases } from '#lib/server/db/queries.js';
import type { purchases as purchasesTable } from '#lib/server/db/schema.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let userPurchases: Array<typeof purchasesTable.$inferSelect> = [];

	if (locals.user) {
		try {
			userPurchases = await getUserPurchases(locals.user.id);
		} catch (err) {
			console.error('Failed to load user purchases in layout:', err);
		}
	}

	return {
		user: locals.user ?? null,
		session: locals.session ?? null,
		purchases: userPurchases
	};
};
