// src/routes/test/+page.server.ts & src/routes/test-gate/+page.server.ts
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	if (!dev) {
		throw error(404, 'Not found');
	}
	return {};
};
