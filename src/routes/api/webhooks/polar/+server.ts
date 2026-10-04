// src/routes/api/webhooks/polar/+server.ts
import { POLAR_WEBHOOK_SECRET, ORIGIN } from '$app/env/private';
import { db } from '#lib/server/db/index.js';
import { customers, generateLicenseKey, purchases, user } from '#lib/server/db/schema.js';
import { sendLicenseConfirmationEmail } from '#lib/server/email.js';
import { dispatchEvent } from '#lib/server/queue/index.js';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

interface OrderData {
	id: string;
	customer?: { id?: string; email?: string };
	email?: string;
	customerId?: string;
	productId?: string;
	productPriceId?: string;
	priceId?: string;
	subscriptionId?: string | null;
	metadata?: {
		userId?: string;
		githubUsername?: string;
		[key: string]: unknown;
	};
}

interface SubscriptionData {
	id: string;
	status?: string;
	[key: string]: unknown;
}

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const webhookSecret = POLAR_WEBHOOK_SECRET;

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
		return Response.json({ error: 'Invalid signature' }, { status: 400 });
	}

	// Handle lifecycle events
	switch (event.type) {
		case 'order.created': {
			const order = event.data as unknown as OrderData;
			const customerEmail = order.customer?.email ?? order.email ?? '';
			const customerId = order.customerId ?? order.customer?.id ?? order.id;
			const productId = order.productId ?? '';
			let resolvedUserId: string | null =
				order.metadata?.userId && order.metadata.userId !== 'anonymous'
					? order.metadata.userId
					: null;

			// Fallback: If userId was not passed in checkout metadata, resolve user by email
			if (!resolvedUserId && customerEmail) {
				const [matchedUser] = await db
					.select({ id: user.id })
					.from(user)
					.where(eq(user.email, customerEmail))
					.limit(1);
				if (matchedUser) {
					resolvedUserId = matchedUser.id;
				}
			}

			// 1. Upsert Customer in Neon DB
			if (customerId && customerEmail) {
				await db
					.insert(customers)
					.values({
						customerId,
						userId: resolvedUserId,
						email: customerEmail
					})
					.onConflictDoUpdate({
						target: customers.customerId,
						set: {
							userId: resolvedUserId,
							updatedAt: new Date()
						}
					});
			}

			// 2. Generate Unique License Key
			const licenseKey = generateLicenseKey();

			// 3. Upsert Purchase Record
			await db
				.insert(purchases)
				.values({
					transactionId: order.id,
					customerId,
					userId: resolvedUserId,
					subscriptionId: order.subscriptionId ?? null,
					priceId: order.productPriceId ?? order.priceId ?? null,
					productId,
					licenseKey,
					status: 'active'
				})
				.onConflictDoUpdate({
					target: purchases.transactionId,
					set: {
						status: 'active',
						userId: resolvedUserId
					}
				});

			console.log(
				`[Polar] Order fulfilled: ${order.id} for ${customerEmail} (License: ${licenseKey})`
			);

			// 4. Trigger GitHub Repository Collaborator Invite if username provided
			const githubUsername = order.metadata?.githubUsername;
			if (githubUsername) {
				await dispatchEvent({
					type: 'repo.invite',
					payload: { githubUsername, email: customerEmail }
				});
			}

			// 5. Send Transactional Fulfillment Email with License Key
			if (customerEmail) {
				await sendLicenseConfirmationEmail({
					to: customerEmail,
					licenseKey,
					transactionId: order.id,
					actionUrl: `${ORIGIN || 'https://supersvelte.netlify.app'}/dashboard/billing`
				});
			}

			break;
		}

		case 'subscription.created':
		case 'subscription.updated': {
			const subscription = event.data as unknown as SubscriptionData;
			console.log(`[Polar] Subscription active: ${subscription.id} (${subscription.status})`);

			if (subscription.id) {
				await db
					.update(purchases)
					.set({ status: subscription.status || 'active' })
					.where(eq(purchases.subscriptionId, subscription.id));
			}
			break;
		}

		case 'subscription.revoked': {
			const subscription = event.data as unknown as SubscriptionData;
			console.log(`[Polar] Subscription revoked: ${subscription.id}`);

			if (subscription.id) {
				await db
					.update(purchases)
					.set({ status: 'revoked' })
					.where(eq(purchases.subscriptionId, subscription.id));
			}
			break;
		}

		default:
			break;
	}

	return Response.json({ received: true });
};
