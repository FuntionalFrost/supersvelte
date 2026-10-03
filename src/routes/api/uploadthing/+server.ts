// src/routes/api/uploadthing/+server.ts
import { UPLOADTHING_TOKEN } from '$app/env/private';
import { ourFileRouter } from '#lib/server/uploadthing.js';
import { createRouteHandler } from 'uploadthing/server';

const handlers = createRouteHandler({
	router: ourFileRouter,
	config: {
		token: UPLOADTHING_TOKEN // Explicit manual token passing
	}
});

export const GET = handlers;
export const POST = handlers;
