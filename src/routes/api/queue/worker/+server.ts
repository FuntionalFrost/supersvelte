// src/routes/api/queue/worker/+server.ts
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { sendEmail } from '$lib/server/email';
import { inviteBuyerToGithub } from '$lib/server/licences';
import type { QueueEvent } from '$lib/server/queue';
import { json, type RequestHandler } from '@sveltejs/kit';
import { Receiver } from '@upstash/qstash';

export const POST: RequestHandler = async ({ request, url }) => {
	const rawBody = await request.text();

	// 1. Signature Verification
	const currentSigningKey = env.QSTASH_CURRENT_SIGNING_KEY;
	const nextSigningKey = env.QSTASH_NEXT_SIGNING_KEY;
	const signature = request.headers.get('upstash-signature');

	if (currentSigningKey && nextSigningKey) {
		if (!signature) {
			return json({ error: 'Unauthorized: Missing Upstash signature' }, { status: 401 });
		}

		try {
			const receiver = new Receiver({
				currentSigningKey,
				nextSigningKey
			});

			const isValid = await receiver.verify({
				signature,
				body: rawBody,
				url: url.toString()
			});

			if (!isValid) {
				return json({ error: 'Unauthorized: Invalid QStash signature' }, { status: 401 });
			}
		} catch (err) {
			console.error('[Queue Worker] Signature verification failed:', err);
			return json({ error: 'Unauthorized: Signature verification error' }, { status: 401 });
		}
	} else if (!dev) {
		// In production without signing keys configured, reject unverified public requests
		console.warn(
			'[Queue Worker] Rejecting request: QSTASH_CURRENT_SIGNING_KEY / QSTASH_NEXT_SIGNING_KEY not configured in production'
		);
		return json(
			{ error: 'Unauthorized: QStash signing keys not configured on server' },
			{ status: 401 }
		);
	}

	// 2. Parse & Process Verified Event
	let event: QueueEvent;
	try {
		event = JSON.parse(rawBody) as QueueEvent;
	} catch {
		return json({ error: 'Invalid JSON payload' }, { status: 400 });
	}

	console.log(`[Queue Worker] Processing verified event: ${event.type}`);

	switch (event.type) {
		case 'repo.invite': {
			const success = await inviteBuyerToGithub(event.payload.githubUsername);
			return json({ success, processed: event.type });
		}
		case 'email.transactional': {
			const result = await sendEmail({
				to: event.payload.to,
				subject: event.payload.subject,
				html: event.payload.template
			});
			return json({ success: !result.error, processed: event.type });
		}
		case 'analytics.sync': {
			console.log('[Queue Worker] Analytics event synced:', event.payload);
			return json({ success: true, processed: event.type });
		}
		default:
			return json({ error: 'Unknown event type' }, { status: 400 });
	}
};
