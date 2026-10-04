// src/routes/(app)/dashboard/+page.server.ts
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth/index.js';
import { getProjects } from '#lib/server/db/queries.js';
import { setCookiesFromResponse } from '#lib/server/utils.js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	if (!locals.user || !locals.session) {
		redirect(303, resolve('login'));
	}

	const activeOrgId = locals.session.activeOrganizationId;

	let organization = null;
	if (activeOrgId) {
		try {
			organization = await auth.api.getFullOrganization({
				headers: request.headers,
				query: { organizationId: activeOrgId }
			});
		} catch (err) {
			console.error('Failed to fetch full organization details:', err);
		}
	}

	const { data: orgProjects } = await getProjects(locals.user.id, activeOrgId);

	return {
		user: locals.user,
		organization,
		projects: orgProjects
	};
};

export const actions: Actions = {
	signOut: async (event) => {
		const response = await auth.api.signOut({
			headers: event.request.headers,
			asResponse: true
		});

		setCookiesFromResponse(event, response);
		redirect(303, resolve('login'));
	}
};
