// src/lib/server/polar.ts
import { POLAR_ACCESS_TOKEN, POLAR_ENVIRONMENT } from '$app/env/private';
import { createPolar } from '@polar-sh/sdk/2026-10';

export const polar = createPolar({
	accessToken: POLAR_ACCESS_TOKEN,
	environment: POLAR_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production'
});
