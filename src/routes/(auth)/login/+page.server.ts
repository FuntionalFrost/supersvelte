// src/routes/(auth)/login/+page.server.ts
import { auth } from '$lib/server/auth';
import { setCookiesFromResponse } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export const load = async ({ locals }) => {
	if (locals.user || locals.session) {
		throw redirect(303, '/dashboard');
	}

	// Use zod4 adapter here
	const form = await superValidate(zod4(loginSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		// Use zod4 adapter here
		const form = await superValidate(event.request, zod4(loginSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const response = await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password
				},
				headers: event.request.headers,
				asResponse: true
			});

			setCookiesFromResponse(event, response);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Invalid email or password';
			return setMessage(form, message, { status: 400 });
		}

		throw redirect(303, '/dashboard');
	}
};
