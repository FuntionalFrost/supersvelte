// src/routes/(auth)/signup/+page.server.ts
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth/index.js';
import { setCookiesFromResponse } from '#lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const signupSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user || locals.session) {
		redirect(303, resolve('dashboard'));
	}

	const form = await superValidate(zod4(signupSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod4(signupSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const response = await auth.api.signUpEmail({
				body: {
					name: form.data.name,
					email: form.data.email,
					password: form.data.password
				},
				headers: event.request.headers,
				asResponse: true
			});

			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				return setMessage(form, body.message || 'Failed to create account', { status: 400 });
			}

			setCookiesFromResponse(event, response);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to create account';
			return setMessage(form, message, { status: 400 });
		}

		const target =
			event.url.searchParams.get('redirectTo') ||
			event.url.searchParams.get('callbackUrl') ||
			'/dashboard';
		const safeTarget = target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';

		redirect(303, safeTarget);
	}
};
