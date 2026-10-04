import { describe, expect, it, vi } from 'vitest';

vi.mock('#lib/server/db/queries.js', () => ({
	getProjects: vi.fn().mockResolvedValue({ data: [], source: 'Empty (Unauthenticated)' }),
	getPurchaseByLicenseKey: vi.fn().mockImplementation(async (key: string) => {
		if (key === 'VALID-KEY-1234') {
			return {
				licenseKey: 'VALID-KEY-1234',
				status: 'active',
				priceId: 'price_pro_123',
				productId: 'prod_polar_pro_test',
				createdAt: '2026-10-04T12:00:00.000Z'
			};
		}
		return null;
	}),
	invalidateProjectsCache: vi.fn().mockResolvedValue(undefined)
}));

import { app } from './index';

describe('Hono OpenAPI RPC Backend (In-Memory app.request)', () => {
	it('serves OpenAPI 3.1 schema specification at /api/doc', async () => {
		const res = await app.request('/api/doc');
		expect(res.status).toBe(200);

		const spec = await res.json();
		expect(spec.openapi).toBe('3.1.0');
		expect(spec.info.title).toBe('Super Svelte API Engine');
		expect(spec.paths).toHaveProperty('/api/projects');
		expect(spec.paths).toHaveProperty('/api/echo');
		expect(spec.paths).toHaveProperty('/api/rate-limited-test');
		expect(spec.paths).toHaveProperty('/api/checkout');
		expect(spec.paths).toHaveProperty('/api/v1/verify-license');
	});

	it('serves interactive Swagger UI documentation at /api/docs', async () => {
		const res = await app.request('/api/docs');
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain('swagger-ui');
	});

	it('returns 404 for invalid license key at /api/v1/verify-license', async () => {
		const res = await app.request('/api/v1/verify-license', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ licenseKey: 'INVALID-KEY-1234' })
		});

		expect(res.status).toBe(404);
		const body = await res.json();
		expect(body).toEqual({
			valid: false,
			licenseKey: 'INVALID-KEY-1234',
			error: 'Invalid or revoked license key'
		});
	});

	it('returns 200 for valid license key at /api/v1/verify-license', async () => {
		const res = await app.request('/api/v1/verify-license', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ licenseKey: 'VALID-KEY-1234' })
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toEqual({
			valid: true,
			licenseKey: 'VALID-KEY-1234',
			status: 'active',
			priceId: 'price_pro_123',
			productId: 'prod_polar_pro_test',
			purchasedAt: '2026-10-04T12:00:00.000Z'
		});
	});

	it('executes /api/echo POST route with Zod body schema validation', async () => {
		const res = await app.request('/api/echo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: 'Hello SuperSvelte' })
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toEqual({
			echo: 'Hello SuperSvelte',
			length: 17
		});
	});

	it('returns rate limit test status at /api/rate-limited-test', async () => {
		const res = await app.request('/api/rate-limited-test', {
			method: 'GET',
			headers: { 'x-forwarded-for': '127.0.0.1' }
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty('message');
		expect(body).toHaveProperty('remaining');
		expect(body).toHaveProperty('limit');
		expect(body).toHaveProperty('mode');
	});

	it('serves /api/projects GET route via projectsApp sub-router', async () => {
		const res = await app.request('/api/projects', {
			method: 'GET'
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty('projects');
		expect(body).toHaveProperty('source');
	});
});
