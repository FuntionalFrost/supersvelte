// src/routes/sitemap.xml/+server.ts
import * as sitemap from 'super-sitemap/sveltekit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return await sitemap.response({
		origin: 'https://supersvelte.netlify.app',
		excludeRoutePatterns: [
			/^\/admin/,
			/^\/dashboard/,
			/^\/settings/,
			/^\/accept-invitation/,
			/^\/welcome/,
			/^\/api/,
			/^\/test/
		]
	});
};
