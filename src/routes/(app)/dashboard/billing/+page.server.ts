// src/routes/(app)/dashboard/billing/+page.server.ts
import { resolve } from '$app/paths';
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, resolve('/login'));
	}

	const userPurchases = await db
		.select()
		.from(purchases)
		.where(and(eq(purchases.userId, locals.user.id), eq(purchases.status, 'active')))
		.orderBy(desc(purchases.createdAt));

	return {
		user: locals.user,
		purchases: userPurchases,
		purchase: userPurchases[0] ?? null
	};
};
