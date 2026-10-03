// src/routes/(auth)/login/+page.server.ts
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth/index.js';
import { setCookiesFromResponse } from '#lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user || locals.session) {
		redirect(303, resolve('dashboard'));
	}

	const form = await superValidate(zod4(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
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

			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				return setMessage(form, body.message || 'Invalid email or password', { status: 400 });
			}

			setCookiesFromResponse(event, response);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Invalid email or password';
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
