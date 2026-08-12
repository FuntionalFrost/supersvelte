// src/routes/api/v1/verify-license/+server.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const licenseKey = body.licenseKey || body.key || request.headers.get('x-license-key');

		if (!licenseKey || typeof licenseKey !== 'string') {
			return json(
				{ valid: false, error: 'Missing licenseKey in request body or X-License-Key header' },
				{ status: 400 }
			);
		}

		// Query Neon DB for matching active purchase
		const [foundPurchase] = await db
			.select()
			.from(purchases)
			.where(eq(purchases.licenseKey, licenseKey.trim()))
			.limit(1);

		if (!foundPurchase || foundPurchase.status !== 'active') {
			return json(
				{
					valid: false,
					licenseKey: licenseKey.trim(),
					error: 'Invalid or revoked license key'
				},
				{ status: 404 }
			);
		}

		return json(
			{
				valid: true,
				licenseKey: foundPurchase.licenseKey,
				status: foundPurchase.status,
				priceId: foundPurchase.priceId,
				productId: foundPurchase.productId,
				purchasedAt: foundPurchase.createdAt
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error('License verification failed:', err);
		return json({ valid: false, error: 'Internal server error' }, { status: 500 });
	}
};
