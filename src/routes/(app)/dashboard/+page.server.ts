// src/routes/(app)/dashboard/+page.server.ts
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		throw redirect(307, '/login');
	}

	const activeOrgId = session.session.activeOrganizationId;

	if (!activeOrgId) {
		return {
			user: session.user,
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
		user: session.user,
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
