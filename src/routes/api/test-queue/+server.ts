// src/routes/api/test-queue/+server.ts
import { dev } from '$app/environment';
import { dispatchEvent } from '$lib/server/queue';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	// Block public execution in production
	if (!dev) {
		throw error(404, 'Not found');
	}

	try {
		const res = await dispatchEvent({
			type: 'repo.invite',
			payload: {
				githubUsername: 'octocat',
				email: 'octocat@github.com'
			}
		});

		return json({ success: true, dispatched: true, res });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Failed to dispatch queue event';
		return json({ success: false, error: message }, { status: 500 });
	}
};
