// tests/unit/hooks.test.ts
import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { userFixture } from '../fixtures/auth';

const mockGetSession = vi.fn();

vi.mock('$lib/server/ratelimit', () => ({
	checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 99, reset: 0 })
}));

vi.mock('$lib/server/auth', () => ({
	auth: {
		api: {
			getSession: (...args: unknown[]) => mockGetSession(...args)
		}
	}
}));

import { appHandle, yaxaHook } from '../../src/hooks.server';

function createMockEvent(
	pathname: string,
	user: App.Locals['user'] = null,
	search = ''
): RequestEvent {
	mockGetSession.mockResolvedValue(
		user ? { user, session: { id: 'sess_1', userId: user.id } } : null
	);
	const url = new URL(`http://localhost:5173${pathname}${search}`);
	return {
		url,
		request: new Request(url.toString(), {
			headers: { 'user-agent': 'Vitest-Test-Agent' }
		}),
		locals: { user, session: null },
		getClientAddress: () => '127.0.0.1'
	} as unknown as RequestEvent;
}

describe('SvelteKit Server Hooks & Route Protection (hooks.server.ts)', () => {
	it('serves dynamic robots.txt via yaxaHook without invoking downstream handlers', async () => {
		const event = createMockEvent('/robots.txt');
		const resolve = vi.fn();

		const res = await yaxaHook({ event, resolve });
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toContain('text/plain');
		const text = await res.text();
		expect(text).toContain('User-agent:');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('serves dynamic OpenGraph card at /api/og via yaxaHook', async () => {
		const event = createMockEvent('/api/og', null, '?title=TestingOG');
		const resolve = vi.fn();

		const res = await yaxaHook({ event, resolve });
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toContain('image/svg+xml');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('serves dynamic sitemap.xml via yaxaHook', async () => {
		const event = createMockEvent('/sitemap.xml');
		const resolve = vi.fn();

		const res = await yaxaHook({ event, resolve });
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toContain('application/xml');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('redirects unauthenticated users attempting to access /dashboard', async () => {
		const event = createMockEvent('/dashboard', null);
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		await expect(appHandle({ event, resolve })).rejects.toMatchObject({
			status: 303,
			location: '/login?redirectTo=%2Fdashboard'
		});
	});

	it('redirects unauthenticated users attempting to access /admin', async () => {
		const event = createMockEvent('/admin', null);
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		await expect(appHandle({ event, resolve })).rejects.toMatchObject({
			status: 303,
			location: '/login?redirectTo=%2Fadmin'
		});
	});

	it('blocks non-admin authenticated users from /admin with 403 error', async () => {
		const regularUser = userFixture.standard();
		const event = createMockEvent('/admin', regularUser);
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		await expect(appHandle({ event, resolve })).rejects.toMatchObject({
			status: 403
		});
	});

	it('redirects authenticated users away from /login to /dashboard', async () => {
		const regularUser = userFixture.standard();
		const event = createMockEvent('/login', regularUser);
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		await expect(appHandle({ event, resolve })).rejects.toMatchObject({
			status: 303,
			location: '/dashboard'
		});
	});

	it('allows public access to marketing pages', async () => {
		const event = createMockEvent('/');
		const resolve = vi.fn().mockResolvedValue(new Response('Marketing Landing Page'));

		const res = await appHandle({ event, resolve });
		expect(res.status).toBe(200);
		const text = await res.text();
		expect(text).toBe('Marketing Landing Page');
	});
});
