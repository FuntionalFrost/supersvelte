// src/routes/api/portal/+server.ts
import { db } from '#lib/server/db/index.js';
import { purchases } from '#lib/server/db/schema.js';
import { polar } from '#lib/server/polar.js';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user || !user.email) {
		throw redirect(303, '/login');
	}

	try {
		// 1. Retrieve the user's latest purchase record from DB
		const userPurchases = await db
			.select()
			.from(purchases)
			.where(eq(purchases.userId, user.id))
			.limit(1);

		let customerId = userPurchases[0]?.customerId;

		// 2. Fallback: Lookup customer in Polar by email if not found in local DB
		if (!customerId) {
			const customerList = await polar.customers.list({
				email: user.email
			});
			customerId = customerList.result.items[0]?.id;
		}

		if (!customerId) {
			throw error(404, 'No Polar customer account found. Please complete a purchase first.');
		}

		// 3. Create the customer portal session
		const session = await polar.customerSessions.create({
			customerId
		});

		throw redirect(303, session.customerPortalUrl);
	} catch (err) {
		if (
			err &&
			typeof err === 'object' &&
			'status' in err &&
			(err as { status: number }).status === 303
		) {
			throw err;
		}
		console.error('Failed to create customer portal session:', err);
		throw error(500, 'Unable to generate customer portal session.');
	}
};
