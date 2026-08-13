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

	let portalUrl: string;

	try {
		// Mint session in try block
		const portalSession = await paddle.customerPortalSessions.create(customerRecord.customerId, []);
		portalUrl = portalSession.urls.general.overview;

		if (!portalUrl) {
			throw error(500, 'Could not generate Paddle portal URL.');
		}
	} catch (err) {
		if ((err as { status?: number })?.status) throw err;
		console.error('❌ Failed to mint Paddle customer portal session:', err);
		throw error(500, 'Failed to create customer portal session.');
	}

	// Execute redirect outside try-catch
	throw redirect(303, portalUrl);
};
