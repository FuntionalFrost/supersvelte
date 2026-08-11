// src/routes/(auth)/login/+page.server.ts
import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const load = async ({ request }) => {
	// Redirect already logged-in users away from /login
	const session = await auth.api.getSession({ headers: request.headers });
	if (session) {
		throw redirect(303, '/dashboard');
	}

	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(loginSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				},
				headers: event.request.headers
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Invalid credentials';
			return setMessage(form, message, { status: 400 });
		}

		throw redirect(303, '/dashboard');
	}
};
