// src/lib/server/auth.ts
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { admin, organization } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Reset your password',
				html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>You requested a password reset. Click the button below to set a new password:</p>
            <a href="${url}" style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
			});
		}
	},

	// 2. Email Verification Emails via Resend
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Acme!</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${url}" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          </div>
        `
			});
		},
		// 3. Automated Welcome Email after successful verification
		afterEmailVerification: async (user) => {
			await sendEmail({
				to: user.email,
				subject: '🚀 Welcome aboard!',
				html: `
          <div style="font-family: sans-serif; padding: 20px;">
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
					// Auto-create a default workspace for the new user
					const orgName = `${user.name || 'Personal'}'s Workspace`;
					const slug = `workspace-${user.id.slice(0, 8)}`;

					await auth.api.createOrganization({
						body: {
							name: orgName,
							slug: slug,
							userId: user.id
						}
					});
				}
			}
		}
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
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
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
