// src/lib/server/api.ts
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { Hono } from 'hono';

// Sub-router for /projects
const projectsApp = new Hono()
	.get('/', async (c) => {
		const allProjects = await db.select().from(projects);
		return c.json({ projects: allProjects });
	})
	.post('/', async (c) => {
		return c.json({ success: true });
	});

// 👈 1. Export named 'app'
export const app = new Hono().basePath('/api').route('/projects', projectsApp);

// 👈 2. Export AppType for hc client RPC
export type AppType = typeof app;
