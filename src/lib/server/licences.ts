// src/lib/server/licences.ts
import { db } from '$lib/server/db';
import { customers, purchases, user } from '$lib/server/db/schema';
import { inviteBuyerToGithub, paddle } from '$lib/server/paddle';
import type { TransactionNotification } from '@paddle/paddle-node-sdk';
import { eq } from 'drizzle-orm';

/**
 * Access Helper: Checks if a Better Auth User has an active purchased license.
 */
export async function hasActiveLicense(userId: string): Promise<boolean> {
	if (!userId) return false;

	const purchase = await db.query.purchases.findFirst({
		where: (table, { eq, and }) => and(eq(table.userId, userId), eq(table.status, 'completed'))
	});

	return !!purchase;
}

/**
 * Idempotently upserts customer record and resolves Better Auth userId from email.
 */
export async function syncCustomer(data: { customerId: string; email: string }) {
	const existingUser = await db.query.user.findFirst({
		where: eq(user.email, data.email)
	});

	await db
		.insert(customers)
		.values({
			customerId: data.customerId,
			userId: existingUser?.id || null,
			email: data.email,
			updatedAt: new Date()
		})
		.onConflictDoUpdate({
			target: customers.customerId,
			set: {
				userId: existingUser?.id || null,
				email: data.email,
				updatedAt: new Date()
			}
		});
}

/**
 * Idempotently records a completed one-time purchase and triggers product delivery.
 */
export async function handleTransactionCompleted(transaction: TransactionNotification) {
	console.log(`[Paddle Webhook] Processing transaction.completed: ${transaction.id}`);

	const customerId = transaction.customerId;
	if (!customerId) {
		throw new Error(`[Paddle Webhook Error] Missing customerId in transaction: ${transaction.id}`);
	}

	let customerEmail: string | null = null;

	// 1. Fetch customer email via Paddle SDK
	try {
		const paddleCustomer = await paddle.customers.get(customerId);
		customerEmail = paddleCustomer.email;
	} catch (err) {
		console.warn(
			`⚠️ [Paddle Webhook] Could not fetch customer ${customerId} from Paddle API:`,
			err
		);
	}

	// Fallback check if email was provided directly inside the transaction payload
	const rawTx = transaction as unknown as { customer?: { email?: string } };
	if (!customerEmail && rawTx.customer?.email) {
		customerEmail = rawTx.customer.email;
	}

	if (!customerEmail) {
		throw new Error(`[Paddle Webhook Error] Could not resolve email for customer: ${customerId}`);
	}

	// 2. Resolve existing Better Auth user in DB
	const existingUser = await db.query.user.findFirst({
		where: eq(user.email, customerEmail)
	});
	const existingUserId = existingUser?.id || null;

	// 3. Sync customer record
	await syncCustomer({ customerId, email: customerEmail });

	// 4. Validate and extract priceId
	const firstItem = transaction.details?.lineItems?.[0];
	const priceId = firstItem?.priceId;

	if (!priceId) {
		throw new Error(
			`[Paddle Webhook Error] Missing priceId in line items for transaction: ${transaction.id}`
		);
	}

	const productId = 'provided_via_price_id';

	// 5. Insert purchase record
	const [record] = await db
		.insert(purchases)
		.values({
			transactionId: transaction.id,
			customerId,
			userId: existingUserId,
			priceId,
			productId,
			status: transaction.status,
			createdAt: transaction.createdAt ? new Date(transaction.createdAt) : new Date()
		})
		.onConflictDoNothing()
		.returning();

	if (record) {
		console.log(`✅ [Paddle Webhook] Purchase recorded in DB: ${record.transactionId}`);
	} else {
		console.log(
			`ℹ️ [Paddle Webhook] Purchase ${transaction.id} already exists in DB (idempotent skip)`
		);
	}

	// 6. Automated GitHub Repository Invite
	const customData = transaction.customData as { github_username?: string } | undefined;
	const githubHandle = customData?.github_username || customerEmail;

	if (githubHandle) {
		await inviteBuyerToGithub(githubHandle);
	}
}
