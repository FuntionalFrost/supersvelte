// src/routes/api/webhooks/polar/polar.test.ts
import { describe, expect, it } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { POST } from './+server';

describe('Polar Webhook Server Handler (/api/webhooks/polar)', () => {
	it('returns 400 error when webhook signature verification fails', async () => {
		const mockRequest = new Request('http://localhost:5173/api/webhooks/polar', {
			method: 'POST',
			headers: {
				'webhook-id': 'msg_123',
				'webhook-timestamp': '12345678',
				'webhook-signature': 'invalid_signature'
			},
			body: JSON.stringify({ type: 'order.created' })
		});

		const event = { request: mockRequest } as unknown as RequestEvent;
		const res = await POST(event);
		expect(res.status).toBe(400);

		const data = await res.json();
		expect(data).toEqual({ error: 'Invalid signature' });
	});

	it('returns 400 error when request payload is malformed or headers are empty', async () => {
		const mockRequest = new Request('http://localhost:5173/api/webhooks/polar', {
			method: 'POST',
			headers: {},
			body: 'not-a-json'
		});

		const event = { request: mockRequest } as unknown as RequestEvent;
		const res = await POST(event);
		expect(res.status).toBe(400);
	});
});
