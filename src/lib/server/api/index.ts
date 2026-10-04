import { ORIGIN } from '$app/env/private';
import { auth } from '#lib/server/auth/index.js';
import { db } from '#lib/server/db/index.js';
import {
	getProjects,
	getPurchaseByLicenseKey,
	invalidateProjectsCache
} from '#lib/server/db/queries.js';
import { projects } from '#lib/server/db/schema.js';
import { polar } from '#lib/server/polar.js';
import { checkRateLimit } from '#lib/server/ratelimit.js';
import { swaggerUI } from '@hono/swagger-ui';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';

// Bindings for SvelteKit locals passed via app.fetch(request, { locals })
export type HonoEnv = {
	Bindings: {
		locals?: App.Locals;
	};
};

/**
 * Resolves the authenticated user and session, prioritizing event.locals passed from SvelteKit
 * and falling back to Better-Auth session verification via request headers.
 */
export async function getAuthContext(c: Context<HonoEnv>): Promise<{
	user: App.Locals['user'];
	session: App.Locals['session'];
}> {
	if (c.env?.locals?.session && c.env?.locals?.user) {
		return { user: c.env.locals.user, session: c.env.locals.session };
	}
	const sessionData = await auth.api.getSession({ headers: c.req.raw.headers }).catch(() => null);
	return {
		user: sessionData?.user ?? null,
		session: sessionData?.session ?? null
	};
}

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

const CheckoutInputSchema = z
	.object({
		productId: z.string().min(1).openapi({ example: 'prod_polar_123' })
	})
	.openapi('CheckoutInput');

const CheckoutResponseSchema = z
	.object({
		url: z.string().openapi({ example: 'https://polar.sh/checkout/chk_123' })
	})
	.openapi('CheckoutResponse');

const VerifyLicenseInputSchema = z
	.object({
		licenseKey: z.string().min(1).openapi({ example: 'SS-LIVE-1234-5678-90AB' })
	})
	.openapi('VerifyLicenseInput');

const VerifyLicenseResponseSchema = z
	.object({
		valid: z.boolean(),
		licenseKey: z.string(),
		status: z.string(),
		priceId: z.string().nullable().optional(),
		productId: z.string(),
		purchasedAt: z.string().or(z.date())
	})
	.openapi('VerifyLicenseResponse');

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
			const { user, session } = await getAuthContext(c);
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
			const { user, session } = await getAuthContext(c);

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
			const { user, session } = await getAuthContext(c);

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
	.openapi(
		createRoute({
			method: 'post',
			path: '/checkout',
			summary: 'Create Polar checkout session',
			request: {
				body: {
					content: {
						'application/json': {
							schema: CheckoutInputSchema
						}
					}
				}
			},
			responses: {
				200: {
					content: {
						'application/json': {
							schema: CheckoutResponseSchema
						}
					},
					description: 'Checkout session created'
				},
				400: {
					content: {
						'application/json': {
							schema: z.object({ error: z.string() })
						}
					},
					description: 'Bad request'
				},
				500: {
					content: {
						'application/json': {
							schema: z.object({ error: z.string() })
						}
					},
					description: 'Internal server error'
				}
			}
		}),
		async (c) => {
			const { productId } = c.req.valid('json');
			const { user } = await getAuthContext(c);
			const origin = ORIGIN || new URL(c.req.url).origin;

			try {
				const checkout = await polar.checkouts.create({
					products: [productId],
					successUrl: `${origin}/welcome?checkout_id={CHECKOUT_ID}`,
					customerEmail: user?.email ?? undefined,
					metadata: {
						userId: user?.id ?? 'anonymous'
					}
				});

				return c.json({ url: checkout.url }, 200);
			} catch (err: unknown) {
				console.error('Polar checkout session error:', err);
				const message = err instanceof Error ? err.message : 'Internal server error';
				return c.json({ error: message }, 500);
			}
		}
	)
	.openapi(
		createRoute({
			method: 'post',
			path: '/v1/verify-license',
			summary: 'Verify active SuperSvelte license key',
			request: {
				body: {
					content: {
						'application/json': {
							schema: VerifyLicenseInputSchema
						}
					}
				}
			},
			responses: {
				200: {
					content: {
						'application/json': {
							schema: VerifyLicenseResponseSchema
						}
					},
					description: 'License is valid'
				},
				404: {
					content: {
						'application/json': {
							schema: z.object({
								valid: z.boolean(),
								licenseKey: z.string(),
								error: z.string()
							})
						}
					},
					description: 'Invalid or revoked license'
				}
			}
		}),
		async (c) => {
			const { licenseKey } = c.req.valid('json');
			const foundPurchase = await getPurchaseByLicenseKey(licenseKey);

			if (!foundPurchase || foundPurchase.status !== 'active') {
				return c.json(
					{
						valid: false,
						licenseKey: licenseKey.trim(),
						error: 'Invalid or revoked license key'
					},
					404
				);
			}

			return c.json(
				{
					valid: true,
					licenseKey: foundPurchase.licenseKey!,
					status: foundPurchase.status,
					priceId: foundPurchase.priceId,
					productId: foundPurchase.productId,
					purchasedAt: foundPurchase.createdAt
				},
				200
			);
		}
	)
	.get('/realtime', async (c) => {
		const { user } = await getAuthContext(c);

		if (!user) return c.json({ error: 'Unauthorized' }, 401);

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
