import { dev } from '$app/env';
import { getRequestEvent } from '$app/server';

import {
	ORIGIN,
	BETTER_AUTH_URL,
	BETTER_AUTH_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$app/env/private';

import { db } from '#lib/server/db/index.js';
import * as schema from '#lib/server/db/schema.js';
import { sendEmail, sendWelcomeEmail } from '#lib/server/email.js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { admin, organization } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
	baseURL: dev
		? 'http://localhost:5173'
		: ORIGIN || BETTER_AUTH_URL || 'https://supersvelte.netlify.app',
	trustedOrigins: [
		'http://localhost:5173',
		'http://localhost:4173',
		'http://127.0.0.1:5173',
		'http://127.0.0.1:4173',
		ORIGIN,
		BETTER_AUTH_URL
	].filter(Boolean) as string[],
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	advanced: {
		useSecureCookies: !dev
	},

	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID || '',
			clientSecret: GITHUB_CLIENT_SECRET || '',
			enabled: Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET)
		}
	},

	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Reset your password',
				html: `
					<div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
						<h2>Password Reset Request</h2>
						<p>Hi ${user.name || 'there'},</p>
						<p>You requested a password reset. Click the button below to set a new password:</p>
						<a href="${url}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a>
						<p style="margin-top: 24px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
					</div>
				`
			});
		}
	},

	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendWelcomeEmail({
				to: user.email,
				name: user.name || 'there',
				actionUrl: url
			});
		},
		afterEmailVerification: async (user) => {
			await sendEmail({
				to: user.email,
				subject: '🚀 Welcome aboard!',
				html: `
					<div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
						<h2>Your account is verified!</h2>
						<p>Thanks for confirming your email, ${user.name || ''}. You are ready to start creating projects.</p>
					</div>
				`
			});
		}
	},

	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					try {
						const orgName = `${user.name || 'Personal'}'s Workspace`;
						const slug = `workspace-${user.id.slice(0, 8)}`;

						await auth.api.createOrganization({ body: { name: orgName, slug, userId: user.id } });
					} catch (err) {
						console.error('[Better Auth] Could not create default workspace for user:', err);
					}
				}
			}
		}
	},

	plugins: [
		admin({
			defaultRole: 'user',
			adminRole: 'admin'
		}),
		organization({
			allowUserToCreateOrganization: true,
			membershipLimit: 100,
			creatorRole: 'owner'
		}),
		sveltekitCookies(getRequestEvent) // Keep as last plugin in array
	]
});
