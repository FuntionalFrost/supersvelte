// src/lib/server/utapi.ts
import { UPLOADTHING_TOKEN } from '$app/env/private';
import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({
	token: UPLOADTHING_TOKEN // Explicit manual token passing
});
