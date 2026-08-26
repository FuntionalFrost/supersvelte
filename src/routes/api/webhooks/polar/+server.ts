// src/routes/api/webhooks/polar/+server.ts
import { env } from '$env/dynamic/private';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const webhookSecret = env.POLAR_WEBHOOK_SECRET;

	const headers: Record<string, string> = {
		'webhook-id': request.headers.get('webhook-id') ?? '',
		'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
		'webhook-signature': request.headers.get('webhook-signature') ?? ''
	};

	let event;
	try {
		event = validateEvent(rawBody, headers, webhookSecret);
	} catch (err) {
		console.error('Polar Webhook Signature Verification Failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	// Handle lifecycle events
	switch (event.type) {
		case 'order.created': {
			const order = event.data;
			const customerEmail = order.customer.email;
			const productId = order.productId;
			const userId = order.metadata?.userId;

			console.log(
				`[Polar] Order fulfilled for ${customerEmail} (Product: ${productId}, User: ${userId})`
			);
			// TODO: Trigger automated GitHub repo invitation & database license activation
			break;
		}

		case 'subscription.created':
		case 'subscription.updated': {
			const subscription = event.data;
			console.log(`[Polar] Subscription active: ${subscription.id} (${subscription.status})`);
			break;
		}

		case 'subscription.revoked': {
			const subscription = event.data;
			console.log(`[Polar] Subscription revoked: ${subscription.id}`);
			break;
		}

		default:
			break;
	}

	return json({ received: true });
};
