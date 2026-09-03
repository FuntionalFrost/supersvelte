// src/routes/docs/+layout.server.ts
import { getAllCategories } from '$lib/docs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		categories: getAllCategories()
	};
};
