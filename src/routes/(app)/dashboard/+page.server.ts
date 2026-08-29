// src/routes/(app)/dashboard/+page.server.ts
import { resolve } from '$app/paths';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { setCookiesFromResponse } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	if (!locals.user || !locals.session) {
		redirect(303, resolve('/login'));
	}

	const activeOrgId = locals.session.activeOrganizationId;

	if (!activeOrgId) {
		return {
			user: locals.user,
			organization: null,
			projects: []
		};
	}

	let organization = null;
	try {
		organization = await auth.api.getFullOrganization({
			headers: request.headers,
			query: { organizationId: activeOrgId }
		});
	} catch (err) {
		console.error('Failed to fetch full organization details:', err);
	}

	let orgProjects: Array<typeof projects.$inferSelect> = [];
	try {
		orgProjects = await db.select().from(projects).where(eq(projects.userId, locals.user.id));
	} catch (err) {
		console.error('Failed to load projects:', err);
	}

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
		redirect(303, resolve('/login'));
	}
};
