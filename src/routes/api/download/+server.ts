// src/routes/api/download/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

/**
 * SuperSvelte is 100% Free and Open Source under the MIT license.
 * This endpoint redirects directly to the latest source zip archive on GitHub.
 */
export const GET: RequestHandler = async () => {
	return Response.redirect(
		'https://github.com/FunctionalFrost/supersvelte/archive/refs/heads/main.zip',
		302
	);
};
