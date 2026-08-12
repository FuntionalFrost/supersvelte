// src/routes/(app)/dashboard/billing/+page.server.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { paddle } from '$lib/server/paddle';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	// Fetch user purchase record from Neon DB
	const userPurchases = await db
		.select()
		.from(purchases)
		.where(eq(purchases.userId, locals.user.id));

	const activePurchase = userPurchases[0] ?? null;

	let portalUrls: {
		overview: string;
		cancelSubscription?: string;
		updatePaymentMethod?: string;
	} | null = null;

	// Generate Paddle Customer Portal session if customer ID exists
	if (activePurchase?.customerId) {
		try {
			const subscriptionIds = activePurchase.subscriptionId ? [activePurchase.subscriptionId] : [];

			// Pass array directly as 2nd parameter according to Paddle SDK types
			const session = await paddle.customerPortalSessions.create(
				activePurchase.customerId,
				subscriptionIds
			);

			const subLinks = session.urls.subscriptions?.[0];

			portalUrls = {
				overview: session.urls.general.overview,
				cancelSubscription: subLinks?.cancelSubscription,
				updatePaymentMethod: subLinks?.updateSubscriptionPaymentMethod
			};
		} catch (err) {
			console.error('Failed to generate Paddle Customer Portal Session:', err);
		}
	}

	return {
		user: locals.user,
		purchase: activePurchase,
		portalUrls
	};
};
