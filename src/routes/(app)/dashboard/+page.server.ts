// src/routes/(app)/dashboard/+page.server.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, request }) => {
	// Guarded by (app)/+layout.server.ts, but checked for type safety
	if (!locals.user || !locals.session) {
		throw redirect(303, '/login');
	}

	const activeOrgId = locals.session.activeOrganizationId;

	if (!activeOrgId) {
		return {
			user: locals.user,
			organization: null,
			projects: []
		};
	}

	// Fetch Organization metadata
	const organization = await auth.api.getFullOrganization({
		headers: request.headers,
		query: { organizationId: activeOrgId }
	});

	// Query DB projects belonging exclusively to this active workspace
	const orgProjects = await db
		.select()
		.from(schema.projects)
		.where(eq(schema.projects.organizationId, activeOrgId));

	return {
		user: locals.user,
		organization,
		projects: orgProjects
	};
};

export const actions = {
	signOut: async (event) => {
		const response = await auth.api.signOut({
			headers: event.request.headers,
			asResponse: true
		});

		const setCookie = response.headers.get('set-cookie');
		if (setCookie) {
			event.setHeaders({
				'set-cookie': setCookie
			});
		}

		throw redirect(303, '/login');
	}
};
