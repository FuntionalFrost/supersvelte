// src/lib/server/polar.ts
import { POLAR_ACCESS_TOKEN, POLAR_ENVIRONMENT } from '$app/env/private';
import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: POLAR_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production'
});
