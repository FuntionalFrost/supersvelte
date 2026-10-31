// src/routes/(auth)/login/+page.server.ts
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth/index.js';
import { setCookiesFromResponse } from '#lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user || locals.session) {
		redirect(303, resolve('dashboard'));
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			const response = await auth.api.signInEmail({
				body: {
					email,
					password
				},
				headers: event.request.headers,
				asResponse: true
			});

			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				return fail(400, { message: body.message || 'Invalid email or password' });
			}

			setCookiesFromResponse(event, response);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Invalid email or password';
			return fail(400, { message });
		}

		const target =
			event.url.searchParams.get('redirectTo') ||
			event.url.searchParams.get('callbackUrl') ||
			'/dashboard';
		const safeTarget = target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';

		redirect(303, safeTarget);
	}
};
