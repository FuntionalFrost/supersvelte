// src/routes/(marketing)/welcome/+page.server.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	const userPurchases = await db
		.select()
		.from(purchases)
		.where(eq(purchases.userId, locals.user.id));

	const latestPurchase = userPurchases[0] ?? null;

	return {
		user: locals.user,
		purchase: latestPurchase
	};
};
