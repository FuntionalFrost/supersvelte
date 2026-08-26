// src/routes/(app)/dashboard/billing/+page.server.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userPurchases = await db
		.select()
		.from(purchases)
		.where(eq(purchases.userId, locals.user.id))
		.orderBy(desc(purchases.createdAt));

	return {
		user: locals.user,
		purchases: userPurchases,
		purchase: userPurchases[0] ?? null
	};
};
