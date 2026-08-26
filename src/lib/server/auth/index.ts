// src/lib/server/auth/index.ts
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	plugins: [
		organization({
			allowUserToCreateOrganization: true
		})
	]
});
