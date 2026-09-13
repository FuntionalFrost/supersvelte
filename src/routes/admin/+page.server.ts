// src/routes/admin/+page.server.ts
import {
	deleteEntityRecord,
	entityRegistry,
	getDatabaseOverviewStats,
	listEntityRecords,
	updateEntityRecord
} from '$lib/server/admin/introspection';
import { auth } from '$lib/server/auth';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request, url }) => {
	// 1. Fetch overview counts across models
	const stats = await getDatabaseOverviewStats();

	// 2. Determine active entity from query param or default to 'users'
	const activeEntityKey = url.searchParams.get('entity') || 'users';
	const page = Number(url.searchParams.get('page') || '1');
	const limit = Number(url.searchParams.get('limit') || '25');
	const search = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sortBy') || undefined;
	const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

	// 3. Query introspected Drizzle records
	const entityData = await listEntityRecords(activeEntityKey, {
		page,
		limit,
		search,
		sortBy,
		sortOrder
	}).catch(() => null);

	// 4. Fetch Better Auth user list for auth-specific admin operations (ban/impersonate)
	const initialUsers = await auth.api
		.listUsers({
			headers: request.headers,
			query: { limit: 50 }
		})
		.catch(() => ({ users: [] }));

	// 5. Build list of available entity tabs for the sidebar
	const entityTabs = Object.values(entityRegistry).map((m) => ({
		key: m.key,
		label: m.label,
		singular: m.singular,
		columnCount: m.columns.length
	}));

	return {
		user: locals.user!,
		stats,
		entityTabs,
		activeEntityKey,
		entityData,
		users: initialUsers?.users || []
	};
};

export const actions: Actions = {
	updateRecord: async ({ request }) => {
		const formData = await request.formData();
		const entityKey = formData.get('_entityKey') as string;
		const id = formData.get('_id') as string;

		if (!entityKey || !id) {
			return fail(400, { message: 'Missing entity key or record ID' });
		}

		const data: Record<string, unknown> = {};
		for (const [key, value] of formData.entries()) {
			if (!key.startsWith('_')) {
				data[key] = value === 'true' ? true : value === 'false' ? false : value;
			}
		}

		try {
			const updated = await updateEntityRecord(entityKey, id, data);
			return { success: true, updated };
		} catch (err: unknown) {
			return fail(500, {
				message: err instanceof Error ? err.message : 'Failed to update record'
			});
		}
	},

	deleteRecord: async ({ request }) => {
		const formData = await request.formData();
		const entityKey = formData.get('_entityKey') as string;
		const id = formData.get('_id') as string;

		if (!entityKey || !id) {
			return fail(400, { message: 'Missing entity key or record ID' });
		}

		try {
			const deleted = await deleteEntityRecord(entityKey, id);
			return { success: true, deleted };
		} catch (err: unknown) {
			return fail(500, {
				message: err instanceof Error ? err.message : 'Failed to delete record'
			});
		}
	}
};
