// src/routes/api/uploadthing/+server.ts
import { env } from '$env/dynamic/private';
import { ourFileRouter } from '$lib/server/uploadthing';
import { createRouteHandler } from 'uploadthing/server';

const handlers = createRouteHandler({
	router: ourFileRouter,
	config: {
		token: env.UPLOADTHING_TOKEN // Explicit manual token passing
	}
});

export const GET = handlers;
export const POST = handlers;
