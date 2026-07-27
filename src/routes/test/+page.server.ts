// src/routes/test/+page.server.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { insertProjectSchema, projects, user } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const form = await superValidate(zod(insertProjectSchema));
	const existingProjects = await db.select().from(projects);

	return {
		form,
		existingProjects,
		user: locals.user,
		session: locals.session
	};
};

export const actions = {
	// Test 1: Form Validation + Drizzle DB Insert
	createProject: async (event) => {
		const form = await superValidate(event.request, zod(insertProjectSchema));
		if (!form.valid) return fail(400, { form });

		await db.insert(projects).values({
			name: form.data.name,
			slug: form.data.slug,
			userId: event.locals.user?.id ?? null
		});

		return { form };
	},

	// Test 2: Drizzle DB Delete
	deleteProject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (id) {
			await db.delete(projects).where(eq(projects.id, id));
		}
		return { success: true };
	},

	// Test 3: Better Auth Seed User
	seed: async () => {
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

	// Test 4: Better Auth Sign Out
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		throw redirect(303, '/login');
	}
};
