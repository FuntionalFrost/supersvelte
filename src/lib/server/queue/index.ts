// src/lib/server/queue/index.ts
import { QSTASH_TOKEN, ORIGIN } from '$app/env/private';
import { Client } from '@upstash/qstash';

const qstash = new Client({ token: QSTASH_TOKEN || 'mock_token' });

export type QueueEvent =
	| {
			type: 'repo.invite';
			payload: { githubUsername: string; email: string };
	  }
	| {
			type: 'email.transactional';
			payload: { to: string; subject: string; template: string };
	  }
	| {
			type: 'analytics.sync';
			payload: { userId: string; event: string; timestamp: number };
	  };

export async function dispatchEvent(event: QueueEvent) {
	if (!QSTASH_TOKEN) {
		console.warn(`[Queue Local] Event dispatched: ${event.type}`, event.payload);
		return { messageId: 'local-mock' };
	}

	const origin = ORIGIN || 'https://supersvelte.netlify.app';

	return await qstash.publishJSON({ url: `${origin}/api/queue/worker`, body: event });
}
