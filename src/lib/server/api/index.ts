import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { getProjects, invalidateProjectsCache } from '$lib/server/db/queries';
import { projects } from '$lib/server/db/schema';
import { checkRateLimit } from '$lib/server/ratelimit';
import { swaggerUI } from '@hono/swagger-ui';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { streamSSE } from 'hono/streaming';

// Bindings for SvelteKit locals passed via app.fetch(request, { locals })
export type HonoEnv = {
	Bindings: {
		locals?: App.Locals;
	};
};

// 1. ZOD SCHEMAS
const ProjectSchema = z
	.object({
		id: z.string().openapi({ example: 'proj_01h8x1' }),
		name: z.string().openapi({ example: 'My New Project' }),
		slug: z.string().openapi({ example: 'my-new-project-a1b2c3d4' }),
		userId: z.string().nullable().optional(),
		organizationId: z.string().nullable().optional(),
		createdAt: z.string().or(z.date())
	})
	.openapi('Project');

const CreateProjectInputSchema = z
	.object({
		name: z.string().optional().openapi({ example: 'My New Project' }),
		slug: z.string().optional().openapi({ example: 'custom-slug-123' })
	})
	.openapi('CreateProjectInput');

// 2. PROJECTS SUB-ROUTER
const projectsApp = new OpenAPIHono<HonoEnv>()
	.openapi(
		createRoute({
			method: 'get',
			path: '/',
			summary: 'Get all projects for authenticated user or active organization',
			responses: {
				200: {
					content: {
						'application/json': {
							schema: z.object({
								projects: z.array(ProjectSchema),
								source: z.string()
							})
						}
					},
					description: 'List of projects'
				}
			}
		}),
		async (c) => {
			const sessionData = c.env?.locals?.session
				? { user: c.env.locals.user, session: c.env.locals.session }
				: await auth.api.getSession({ headers: c.req.raw.headers });

			const user = sessionData?.user;
			const session = sessionData?.session;

			const { data, source } = await getProjects(user?.id, session?.activeOrganizationId);
			return c.json({ projects: data, source }, 200);
		}
	)
	.openapi(
		createRoute({
			method: 'post',
			path: '/',
			summary: 'Create project',
			request: {
				body: {
					content: {
						'application/json': {
							schema: CreateProjectInputSchema
						}
					}
				}
			},
			responses: {
				200: {
					content: {
						'application/json': {
							schema: z.object({
								success: z.boolean(),
								project: ProjectSchema
							})
						}
					},
					description: 'Project created'
				},
				401: {
					content: {
						'application/json': {
							schema: z.object({
								error: z.string()
							})
						}
					},
					description: 'Unauthorized'
				}
			}
		}),
		async (c) => {
			const sessionData = c.env?.locals?.session
				? { user: c.env.locals.user, session: c.env.locals.session }
				: await auth.api.getSession({ headers: c.req.raw.headers });

			const user = sessionData?.user;
			const session = sessionData?.session;

			if (!user) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const body = c.req.valid('json');
			const name = body.name || 'New Project';
			const slug =
				body.slug ||
				name
					.toLowerCase()
					.trim()
					.replace(/[\s\W-]+/g, '-')
					.concat('-', crypto.randomUUID().slice(0, 8));

			const [newProject] = await db
				.insert(projects)
				.values({
					name,
					slug,
					userId: user.id,
					organizationId: session?.activeOrganizationId ?? null
				})
				.returning();

			await invalidateProjectsCache(user.id, session?.activeOrganizationId);
			return c.json({ success: true, project: newProject }, 200);
		}
	)
	.openapi(
		createRoute({
			method: 'delete',
			path: '/{id}',
			summary: 'Delete project',
			request: {
				params: z.object({
					id: z.string()
				})
			},
			responses: {
				200: {
					content: {
						'application/json': {
							schema: z.object({
								success: z.boolean(),
								deletedId: z.string()
							})
						}
					},
					description: 'Project deleted'
				},
				401: {
					content: {
						'application/json': {
							schema: z.object({
								error: z.string()
							})
						}
					},
					description: 'Unauthorized'
				}
			}
		}),
		async (c) => {
			const sessionData = c.env?.locals?.session
				? { user: c.env.locals.user, session: c.env.locals.session }
				: await auth.api.getSession({ headers: c.req.raw.headers });

			const user = sessionData?.user;
			const session = sessionData?.session;

			if (!user) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const { id } = c.req.valid('param');

			// Ensure user only deletes their own project or active organization's project
			const whereClause = session?.activeOrganizationId
				? and(eq(projects.id, id), eq(projects.organizationId, session.activeOrganizationId))
				: and(eq(projects.id, id), eq(projects.userId, user.id));

			await db.delete(projects).where(whereClause);
			await invalidateProjectsCache(user.id, session?.activeOrganizationId);
			return c.json({ success: true, deletedId: id }, 200);
		}
	);

// 3. BASE API ROUTER CHAIN
const api = new OpenAPIHono<HonoEnv>().basePath('/api');

// OpenAPI 3.1 JSON Document
api.doc('/doc', {
	openapi: '3.1.0',
	info: {
		title: 'Super Svelte API Engine',
		version: '1.0.0'
	}
});

// Interactive Swagger UI
api.get('/docs', swaggerUI({ url: '/api/doc' }));

// 4. ROUTE CHAIN FOR RPC TYPE INFERENCE
const routes = api
	.route('/projects', projectsApp)
	.openapi(
		createRoute({
			method: 'post',
			path: '/echo',
			summary: 'Echo test',
			request: {
				body: {
					content: {
						'application/json': {
							schema: z.object({
								message: z.string().optional()
							})
						}
					}
				}
			},
			responses: {
				200: {
					content: {
						'application/json': {
							schema: z.object({
								echo: z.string().optional(),
								length: z.number()
							})
						}
					},
					description: 'Echo result'
				}
			}
		}),
		async (c) => {
			const { message } = c.req.valid('json');
			return c.json({ echo: message, length: message?.length ?? 0 }, 200);
		}
	)
	.openapi(
		createRoute({
			method: 'get',
			path: '/rate-limited-test',
			summary: 'Rate limit test',
			responses: {
				200: {
					content: {
						'application/json': {
							schema: z.object({
								message: z.string(),
								remaining: z.number(),
								limit: z.number(),
								reset: z.number(),
								mode: z.string()
							})
						}
					},
					description: 'Allowed'
				}
			}
		}),
		async (c) => {
			const forwarded = c.req.header('x-forwarded-for');
			const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
			const result = await checkRateLimit(ip);

			return c.json(
				{
					message: `Allowed (${result.mode})`,
					remaining: result.remaining,
					limit: result.limit,
					reset: result.reset,
					mode: result.mode
				},
				200
			);
		}
	)
	.get('/realtime', async (c) => {
		const session = c.env?.locals?.session
			? { user: c.env.locals.user, session: c.env.locals.session }
			: await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);

		const user = session.user; // <-- Narrowed const preserves type safety inside callback

		return streamSSE(c, async (stream) => {
			let count = 0;
			while (!stream.aborted) {
				count++;
				await stream.writeSSE({
					data: JSON.stringify({ userId: user.id, count }),
					event: 'heartbeat',
					id: String(count)
				});
				await stream.sleep(3000);
			}
		});
	});

// 5. EXPORTS
export { routes as app };
export type AppType = typeof routes;
