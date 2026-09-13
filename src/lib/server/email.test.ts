// src/lib/server/email.test.ts
import { describe, expect, it } from 'vitest';
import { clearDevEmails, getLatestDevEmail, sendEmail } from './email';

describe('Console Dev Email Fallback', () => {
	it('captures dispatched emails in in-memory dev store', async () => {
		clearDevEmails();

		const res = await sendEmail({
			to: 'delivered@resend.dev',
			subject: 'Test Subject 123',
			html: '<h1>Hello Test</h1>',
			actionUrl: 'http://localhost:5173/action'
		});

		expect(res.error).toBeNull();
		const latest = getLatestDevEmail();
		expect(latest).toBeDefined();
		expect(latest?.to).toBe('delivered@resend.dev');
		expect(latest?.subject).toBe('Test Subject 123');
		expect(latest?.actionUrl).toBe('http://localhost:5173/action');
	});
});
