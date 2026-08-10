// src/routes/api/portal/+server.ts
import { db } from '$lib/server/db';
import { paddle } from '$lib/server/paddle';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const authUser = locals.user;
	if (!authUser || !authUser.email) {
		throw redirect(303, '/login');
	}

	const customerRecord = await db.query.customers.findFirst({
		where: (table, { eq, or }) => or(eq(table.userId, authUser.id), eq(table.email, authUser.email))
	});

	if (!customerRecord) {
		throw error(404, 'No purchase record found for this account.');
	}

	try {
		// Pass customerId as argument 1, and an empty array [] for subscriptionIds as argument 2
		const portalSession = await paddle.customerPortalSessions.create(customerRecord.customerId, []);

		const portalUrl = portalSession.urls.general.overview;

		if (!portalUrl) {
			throw error(500, 'Could not generate Paddle portal URL.');
		}

		throw redirect(303, portalUrl);
	} catch (err) {
		// Avoid explicit 'any' cast to satisfy ESLint
		if ((err as { status?: number })?.status === 303) throw err;
		console.error('❌ Failed to mint Paddle customer portal session:', err);
		throw error(500, 'Failed to create customer portal session.');
	}
};
