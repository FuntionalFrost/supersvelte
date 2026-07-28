// src/lib/server/utapi.ts
import { env } from '$env/dynamic/private';
import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({
	token: env.UPLOADTHING_TOKEN // Explicit manual token passing
});
