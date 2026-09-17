// src/lib/server/api/rpc.test.ts
import { describe, expect, it } from 'vitest';
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
	});

	it('serves interactive Swagger UI documentation at /api/docs', async () => {
		const res = await app.request('/api/docs');
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain('swagger-ui');
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
