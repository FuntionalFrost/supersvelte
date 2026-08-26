// src/routes/api/checkout/+server.ts
import { env } from '$env/dynamic/private';
import { polar } from '$lib/server/polar';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url, locals }) => {
	try {
		const { productId } = await request.json();

		if (!productId) {
			return json({ error: 'Product ID is required' }, { status: 400 });
		}

		const sessionUser = locals.user;
		const origin = env.ORIGIN || url.origin;

		// Correct Polar SDK syntax using products array
		const checkout = await polar.checkouts.create({
			products: [productId],
			successUrl: `${origin}/welcome?checkout_id={CHECKOUT_ID}`,
			customerEmail: sessionUser?.email ?? undefined,
			metadata: {
				userId: sessionUser?.id ?? 'anonymous'
			}
		});

		return json({ url: checkout.url });
	} catch (err: unknown) {
		console.error('Polar checkout session error:', err);
		const message = err instanceof Error ? err.message : 'Internal server error';
		return json({ error: message }, { status: 500 });
	}
};
