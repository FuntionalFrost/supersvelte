// src/lib/server/polar.ts
import { env } from '$env/dynamic/private';
import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: env.POLAR_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production'
});
