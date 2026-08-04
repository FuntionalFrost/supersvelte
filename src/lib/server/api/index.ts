// src/lib/server/api/index.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { getProjects, invalidateProjectsCache } from '$lib/server/db/queries';
import { projects } from '$lib/server/db/schema';
import { checkRateLimit } from '$lib/server/ratelimit';
import { swaggerUI } from '@hono/swagger-ui';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { streamSSE } from 'hono/streaming';

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
const projectsApp = new OpenAPIHono()
	.openapi(
		createRoute({
			method: 'get',
			path: '/',
			summary: 'Get all projects',
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
			const { data, source } = await getProjects();
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
				}
			}
		}),
		async (c) => {
			const body = c.req.valid('json');
			const name = body.name || 'New Project';
			const slug =
				body.slug ||
				name
					.toLowerCase()
					.trim()
					.replace(/[\s\W-]+/g, '-')
					.concat('-', crypto.randomUUID().slice(0, 8));

			const [newProject] = await db.insert(projects).values({ name, slug }).returning();
			await invalidateProjectsCache();
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
				}
			}
		}),
		async (c) => {
			const { id } = c.req.valid('param');
			await db.delete(projects).where(eq(projects.id, id));
			await invalidateProjectsCache();
			return c.json({ success: true, deletedId: id }, 200);
		}
	);

// 3. BASE INSTANCE & OPENAPI REGISTRATION
const baseApp = new OpenAPIHono();

// Mount documentation directly on the OpenAPIHono instance
baseApp.doc('/api/doc', {
	openapi: '3.1.0',
	info: {
		title: 'Super Svelte API Engine',
		version: '1.0.0'
	}
});

baseApp.get('/api/docs', swaggerUI({ url: '/api/doc' }));

// 4. ROUTE CHAIN FOR RPC TYPE INFERENCE
const routes = baseApp
	.basePath('/api')
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
			const ip = c.req.header('x-forwarded-for') ?? '127.0.0.1';
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
		const session = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!session) return c.json({ error: 'Unauthorized' }, 401);

		return streamSSE(c, async (stream) => {
			let count = 0;
			while (!stream.aborted) {
				count++;
				await stream.writeSSE({
					data: JSON.stringify({ userId: session.user.id, count }),
					event: 'heartbeat',
					id: String(count)
				});
				await stream.sleep(3000);
			}
		});
	});

// 5. EXPORTS
// Exporting `routes` as `app` satisfies ESLint `no-unused-vars` and exports runtime routes for SvelteKit
export { routes as app };
export type AppType = typeof routes;
