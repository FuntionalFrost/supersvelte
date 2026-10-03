// src/routes/(marketing)/welcome/+page.server.ts
import { db } from '#lib/server/db/index.js';
import { purchases } from '#lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	let latestPurchase = null;

	if (locals.user) {
		const userPurchases = await db
			.select()
			.from(purchases)
			.where(eq(purchases.userId, locals.user.id));
		latestPurchase = userPurchases[0] ?? null;
	}

	return {
		user: locals.user ?? null,
		purchase: latestPurchase
	};
};
