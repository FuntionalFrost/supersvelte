// src/routes/api/queue/worker/+server.ts
import { inviteBuyerToGithub } from '$lib/server/licences';
import type { QueueEvent } from '$lib/server/queue';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const event = (await request.json()) as QueueEvent;

	console.log(`[Queue Worker] Processing event: ${event.type}`);

	switch (event.type) {
		case 'repo.invite': {
			await inviteBuyerToGithub(event.payload.githubUsername);
			break;
		}
		case 'email.transactional': {
			// Trigger Resend email delivery
			break;
		}
		case 'analytics.sync': {
			// Batch push to analytics sink
			break;
		}
		default:
			return json({ error: 'Unknown event type' }, { status: 400 });
	}

	return json({ success: true, processed: event.type });
};
