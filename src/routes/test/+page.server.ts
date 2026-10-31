// src/routes/test/+page.server.ts
import { dev } from '$app/env';

import {
	DATABASE_URL,
	POLAR_WEBHOOK_SECRET,
	POLAR_ACCESS_TOKEN,
	QSTASH_TOKEN,
	RESEND_API_KEY
} from '$app/env/private';

import { auth } from '#lib/server/auth/index.js';
import { db } from '#lib/server/db/index.js';
import { insertProjectSchema, projects, user } from '#lib/server/db/schema.js';
import { sendEmail } from '#lib/server/email.js';
import { setCookiesFromResponse } from '#lib/server/utils.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

const MOCK_DEMO_PROJECTS = [
	{ id: 'demo-1', name: 'Acme Analytics Platform', slug: 'acme-analytics' },
	{ id: 'demo-2', name: 'Edge AI Gateway', slug: 'edge-ai-gateway' }
];

export const load: PageServerLoad = async ({ locals }) => {
	let userProjects = MOCK_DEMO_PROJECTS;

	if (locals.user) {
		try {
			userProjects = await db
				.select({ id: projects.id, name: projects.name, slug: projects.slug })
				.from(projects)
				.where(eq(projects.userId, locals.user.id))
				.limit(10);
		} catch (err) {
			console.error('Failed to load user projects:', err);
		}
	}

	return {
		existingProjects: userProjects,
		user: locals.user ?? null,
		session: locals.session ?? null,
		systemStatus: {
			database: !!DATABASE_URL,
			polarSecret: !!POLAR_WEBHOOK_SECRET,
			polarToken: !!POLAR_ACCESS_TOKEN,
			qstashToken: !!QSTASH_TOKEN,
			resendKey: !!RESEND_API_KEY
		}
	};
};

export const actions: Actions = {
	createProject: async (event) => {
		if (!dev && event.locals.user?.role !== 'admin') {
			throw error(404, 'Not found');
		}

		if (!event.locals.user) {
			return fail(401, { message: 'Sign in to create persistent database records.' });
		}

		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() || '';
		const slug = formData.get('slug')?.toString() || name.toLowerCase().replace(/\s+/g, '-');

		const parsed = insertProjectSchema.safeParse({ name, slug });
		if (!parsed.success) {
			return fail(400, { message: 'Invalid project data', errors: parsed.error.format() });
		}

		try {
			await db.insert(projects).values({
				name: parsed.data.name,
				slug: parsed.data.slug,
				userId: event.locals.user.id
			});
			return { success: true };
		} catch {
			return fail(500, { message: 'Failed to insert project into database.' });
		}
	},

	deleteProject: async ({ request, locals }) => {
		if (!dev && locals.user?.role !== 'admin') {
			throw error(404, 'Not found');
		}

		if (!locals.user) {
			return fail(401, { message: 'Must be logged in to delete.' });
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (id) {
			await db
				.delete(projects)
				.where(and(eq(projects.id, id), eq(projects.userId, locals.user.id)));
		}

		return { success: true };
	},

	seed: async ({ locals }) => {
		if (!dev && locals.user?.role !== 'admin') {
			return fail(403, {
				seeded: false,
				message: 'Database seeding is disabled in production mode.'
			});
		}

		try {
			await db.delete(user).where(eq(user.email, 'test@example.com'));
			await auth.api.signUpEmail({
				body: {
					email: 'test@example.com',
					password: 'password123',
					name: 'Developer Test'
				}
			});
			return { seeded: true, message: 'Fresh user created: test@example.com / password123' };
		} catch {
			return { seeded: false, message: 'Failed to seed user' };
		}
	},

	signOut: async (event) => {
		const response = await auth.api.signOut({
			headers: event.request.headers,
			asResponse: true
		});

		setCookiesFromResponse(event, response);
		redirect(303, '/login');
	},

	sendTestEmail: async ({ request, locals }) => {
		const formData = await request.formData();
		const to = (formData.get('email') as string) || locals.user?.email || 'developer@example.com';
		const name = (formData.get('name') as string) || 'Developer';

		const res = await sendEmail({
			to,
			subject: `Welcome to SuperSvelte, ${name}!`,
			html: `
				<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7;">
					<h2 style="color: #18181b; margin-top: 0;">Welcome to SuperSvelte!</h2>
					<p style="color: #52525b; line-height: 1.5;">Hi ${name}, your full-stack Svelte 5 + Hono RPC + Neon SaaS is up and running.</p>
					<div style="margin: 24px 0;">
						<a href="http://localhost:5173/dashboard" style="display: inline-block; background: #18181b; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Open Dashboard &rarr;</a>
					</div>
					<hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 24px 0;" />
					<p style="color: #a1a1aa; font-size: 12px;">Sent via SuperSvelte Zero-Config Dev Email Dispatcher.</p>
				</div>
			`,
			actionUrl: 'http://localhost:5173/dashboard'
		});

		if (!res.error) {
			return { emailSent: true, message: `Test email sent to ${to}!` };
		}

		return fail(500, { message: res.error.message ?? 'Failed to send email.' });
	}
};
