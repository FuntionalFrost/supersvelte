// src/routes/api/test-queue/+server.ts
import { dev } from '$app/env';
import { dispatchEvent } from '#lib/server/queue/index.js';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	// Block public execution in production
	if (!dev) {
		throw error(404, 'Not found');
	}

	try {
		const res = await dispatchEvent({
			type: 'analytics.sync',
			payload: {
				userId: 'usr_dev_test',
				event: 'diagnostic.queue.ping',
				timestamp: Date.now()
			}
		});

		return Response.json({ success: true, dispatched: true, res });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to dispatch queue event';
		return Response.json({ success: false, error: message }, { status: 500 });
	}
};
