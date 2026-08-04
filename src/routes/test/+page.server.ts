// src/routes/test/+page.server.ts
import { dev } from '$app/environment';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { getProjects, invalidateProjectsCache } from '$lib/server/db/queries';
import { insertProjectSchema, projects, user } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import { redis } from '$lib/server/ratelimit';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters'; // Use zod4 adapter

export const load = async ({ locals }) => {
	const form = await superValidate(zod(insertProjectSchema));
	const { data: existingProjects } = await getProjects();

	return {
		form,
		existingProjects,
		user: locals.user,
		session: locals.session
	};
};

export const actions = {
	createProject: async (event) => {
		const form = await superValidate(event.request, zod(insertProjectSchema));
		if (!form.valid) return fail(400, { form });
		if (!event.locals.user) {
			return fail(401, { form, message: 'You must be logged in to create a project.' });
		}

		const [newProject] = await db
			.insert(projects)
			.values({
				name: form.data.name,
				slug: form.data.slug,
				userId: event.locals.user.id // Pass undefined if logged out
			})
			.returning();

		await invalidateProjectsCache();

		if (redis) {
			await redis.lpush(
				'events:app',
				JSON.stringify({
					type: 'PROJECT_CREATED',
					payload: newProject,
					timestamp: new Date().toISOString()
				})
			);
		}

		return { form };
	},

	deleteProject: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to delete a project.' });
		}
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (id) {
			await db.delete(projects).where(eq(projects.id, id));
			await invalidateProjectsCache();
		}

		return { success: true };
	},

	seed: async () => {
		// 🔒 Only allow seeding during local development
		if (!dev) {
			return fail(403, { seeded: false, message: 'Seeding is disabled in production.' });
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
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Failed to seed user';
			return { seeded: false, message: msg };
		}
	},

	signOut: async (event) => {
		// Request the raw Response object to capture 'Set-Cookie' header
		const response = await auth.api.signOut({
			headers: event.request.headers,
			asResponse: true
		});

		// Forward 'Set-Cookie' headers to SvelteKit
		const cookieHeader = response.headers.get('set-cookie');
		if (cookieHeader) {
			event.setHeaders({
				'set-cookie': cookieHeader
			});
		}

		throw redirect(303, '/login');
	},

	sendTestEmail: async ({ locals }) => {
		if (!locals.user?.email) {
			return fail(400, { message: 'Must be logged in to send a test email.' });
		}

		const res = await sendEmail({
			to: locals.user.email,
			subject: '🧪 Resend Stack Test Email',
			html: `<h1>Test Successful!</h1><p>Sent to ${locals.user.email} via Resend.</p>`
		});

		if (res.success) {
			return { emailSent: true, message: `Test email sent to ${locals.user.email}!` };
		} else {
			return fail(500, { message: 'Failed to send email via Resend.' });
		}
	}
};
