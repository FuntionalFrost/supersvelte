// src/routes/+layout.server.ts
import { db } from '$lib/server/db';
import { purchases as purchasesTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let userPurchases: Array<typeof purchasesTable.$inferSelect> = [];

	if (locals.user) {
		try {
			userPurchases = await db
				.select()
				.from(purchasesTable)
				.where(eq(purchasesTable.userId, locals.user.id));
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
