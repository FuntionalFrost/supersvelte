// src/lib/server/index.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { getProjects, invalidateProjectsCache } from '$lib/server/db/queries';
import { projects } from '$lib/server/db/schema';
import { checkRateLimit } from '$lib/server/ratelimit';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

const projectsApp = new Hono()
	.get('/', async (c) => {
		// ⚡ Cached Query Layer
		const { data, source } = await getProjects();
		return c.json({ projects: data, source });
	})
	.post('/', async (c) => {
		const body = await c.req.json();
		const name = body.name || 'New Project';

		//  Generate a URL-friendly slug to satisfy Drizzle's required 'slug' column
		const slug =
			body.slug ||
			name
				.toLowerCase()
				.trim()
				.replace(/[\s\W-]+/g, '-')
				.concat('-', crypto.randomUUID().slice(0, 8));

		// 1. Insert into Neon Postgres via Drizzle
		const [newProject] = await db
			.insert(projects)
			.values({
				name,
				slug //  'slug' is now provided!
			})
			.returning();

		// 2. 🧹 Invalidate stale Redis cache
		await invalidateProjectsCache();

		return c.json({ success: true, project: newProject });
	})
	.delete('/:id', async (c) => {
		const id = c.req.param('id');

		// 1. Delete from Neon Postgres via Drizzle
		await db.delete(projects).where(eq(projects.id, id));

		// 2. 🧹 Invalidate Redis cache so stale lists don't persist
		await invalidateProjectsCache();

		return c.json({ success: true, deletedId: id });
	});

export const app = new Hono()
	.basePath('/api')
	.route('/projects', projectsApp)

	// Add the echo endpoint here:
	.post('/echo', async (c) => {
		const { message } = await c.req.json();
		return c.json({ echo: message, length: message?.length ?? 0 });
	})

	// Rate Limiting Route
	.get('/rate-limited-test', async (c) => {
		const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? '127.0.0.1';
		const result = await checkRateLimit(ip);

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

	// Realtime SSE Route
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
