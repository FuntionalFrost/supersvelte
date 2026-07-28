// src/lib/server/api.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { checkRateLimit } from '$lib/server/ratelimit';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

const projectsApp = new Hono()
	.get('/', async (c) => {
		const allProjects = await db.select().from(projects);
		return c.json({ projects: allProjects });
	})
	.post('/', async (c) => {
		return c.json({ success: true });
	});

export const app = new Hono()
	.basePath('/api')
	.route('/projects', projectsApp)

	// 🛡️ Rate-Limited Route
	.get('/rate-limited-test', async (c) => {
		// Extract IP address from request headers or default to localhost
		const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? '127.0.0.1';
		const result = await checkRateLimit(ip);

		// If rate limit is exceeded, return 429 HTTP status
		if (!result.success) {
			return c.json(
				{
					error: `Rate limit exceeded! Slow down (${result.mode}).`,
					limit: result.limit,
					remaining: result.remaining,
					reset: result.reset,
					mode: result.mode
				},
				429
			);
		}

		return c.json({
			message: `Request allowed (${result.mode})!`,
			remaining: result.remaining,
			limit: result.limit,
			reset: result.reset,
			mode: result.mode
		});
	})

	// Realtime SSE
	.get('/realtime', async (c) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session) return c.json({ error: 'Unauthorized' }, 401);

		return streamSSE(c, async (stream) => {
			let count = 0;
			while (!stream.aborted) {
				count++;
				await stream.writeSSE({
					data: JSON.stringify({
						userId: session.user.id,
						timestamp: new Date().toLocaleTimeString(),
						pingCount: count
					}),
					event: 'heartbeat',
					id: String(count)
				});
				await stream.sleep(3000);
			}
		});
	});

export type AppType = typeof app;
