// src/routes/api/[...paths]/+server.ts
import { app } from '$lib/server/api';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = ({ request, locals, platform }) => {
	return app.fetch(request, { locals, platform });
};
