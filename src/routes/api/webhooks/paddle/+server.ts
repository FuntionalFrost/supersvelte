// src/routes/api/webhooks/paddle/+server.ts
import { env } from '$env/dynamic/private';
import { handleTransactionCompleted, syncCustomer } from '$lib/server/licences';
import { paddle } from '$lib/server/paddle';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('paddle-signature') || '';
	const webhookSecret = env.PADDLE_WEBHOOK_SECRET;

	if (!webhookSecret) {
		return json({ error: 'Webhook secret unconfigured' }, { status: 500 });
	}

	if (!signature) {
		return json({ error: 'Missing paddle-signature header' }, { status: 400 });
	}

	// 1. Read body strictly as UNPARSED raw text
	const rawBody = await request.text();

	let event;
	try {
		// 2. Verify signature using Paddle SDK and secret key
		event = await paddle.webhooks.unmarshal(rawBody, webhookSecret, signature);
	} catch (err) {
		console.error('❌ Paddle Webhook signature verification failed:');
		console.error('Error Details:', err);
		console.log('Received Signature:', signature);
		console.log('Using Secret:', webhookSecret ? `${webhookSecret.slice(0, 10)}...` : 'MISSING!');
		return json({ error: 'Invalid webhook signature' }, { status: 401 });
	}

	try {
		// 3. Route events for one-time purchases
		switch (event.eventType) {
			case 'transaction.completed': {
				await handleTransactionCompleted(event.data);
				break;
			}

			case 'customer.created':
			case 'customer.updated': {
				const customer = event.data;
				await syncCustomer({
					customerId: customer.id,
					email: customer.email
				});
				break;
			}

			default:
				// Safely ignore subscription and other event types
				break;
		}

		return json({ received: true }, { status: 200 });
	} catch (err) {
		console.error(`[Paddle Webhook Error] Failed processing ${event.eventType}:`, err);
		return json({ error: 'Internal processing error' }, { status: 500 });
	}
};
