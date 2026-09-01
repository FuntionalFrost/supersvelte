// src/routes/test/+page.server.ts
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { insertProjectSchema, projects, user } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import { setCookiesFromResponse } from '$lib/server/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

const MOCK_DEMO_PROJECTS = [
	{ id: 'demo-1', name: 'Acme Analytics Platform', slug: 'acme-analytics' },
	{ id: 'demo-2', name: 'Edge AI Gateway', slug: 'edge-ai-gateway' }
];

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(insertProjectSchema));
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
		form,
		existingProjects: userProjects,
		user: locals.user ?? null,
		session: locals.session ?? null,
		systemStatus: {
			database: !!env.DATABASE_URL,
			polarSecret: !!env.POLAR_WEBHOOK_SECRET,
			polarToken: !!env.POLAR_ACCESS_TOKEN,
			qstashToken: !!env.QSTASH_TOKEN,
			resendKey: !!env.RESEND_API_KEY,
			githubToken: !!env.GITHUB_ADMIN_TOKEN
		}
	};
};

export const actions: Actions = {
	createProject: async (event) => {
		if (!dev && event.locals.user?.role !== 'admin') {
			throw error(404, 'Not found');
		}

		const form = await superValidate(event.request, zod(insertProjectSchema));
		if (!form.valid) return fail(400, { form });

		if (!event.locals.user) {
			return fail(401, { form, message: 'Sign in to create persistent database records.' });
		}

		try {
			await db.insert(projects).values({
				name: form.data.name,
				slug: form.data.slug,
				userId: event.locals.user.id
			});
			return { form };
		} catch {
			return fail(500, { form, message: 'Failed to insert project into database.' });
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

	sendTestEmail: async ({ locals }) => {
		if (!dev && locals.user?.role !== 'admin') {
			throw error(404, 'Not found');
		}

		if (!locals.user?.email) {
			return fail(400, { message: 'Must be logged in to send a test email.' });
		}

		const res = await sendEmail({
			to: locals.user.email,
			subject: '🧪 Resend Stack Test Email',
			html: `<h1>Test Successful!</h1><p>Sent to ${locals.user.email} via Resend.</p>`
		});

		if (!res.error) {
			return { emailSent: true, message: `Test email sent to ${locals.user.email}!` };
		}

		return fail(500, { message: res.error.message ?? 'Failed to send email.' });
	}
};
