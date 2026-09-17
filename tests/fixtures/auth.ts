// tests/fixtures/auth.ts
import { createMockUser } from 'yaxa-svelte/testing';

export const userFixture = {
	free: (overrides: Record<string, unknown> = {}) =>
		({
			...createMockUser({
				id: 'user_free_123',
				name: 'Free User',
				email: 'free@example.com',
				role: 'user',
				plan: 'free',
				tier: 'free',
				...overrides
			}),
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
			banned: false
		}) as unknown as NonNullable<App.Locals['user']>,

	standard: (overrides: Record<string, unknown> = {}) =>
		({
			...createMockUser({
				id: 'user_std_123',
				name: 'Standard User',
				email: 'standard@example.com',
				role: 'user',
				plan: 'standard',
				tier: 'standard',
				...overrides
			}),
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
			banned: false
		}) as unknown as NonNullable<App.Locals['user']>,

	pro: (overrides: Record<string, unknown> = {}) =>
		({
			...createMockUser({
				id: 'user_pro_123',
				name: 'Pro User',
				email: 'pro@example.com',
				role: 'user',
				plan: 'pro',
				tier: 'pro',
				...overrides
			}),
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
			banned: false
		}) as unknown as NonNullable<App.Locals['user']>,

	admin: (overrides: Record<string, unknown> = {}) =>
		({
			...createMockUser({
				id: 'user_admin_123',
				name: 'Admin User',
				email: 'admin@example.com',
				role: 'admin',
				plan: 'enterprise',
				tier: 'enterprise',
				...overrides
			}),
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
			banned: false
		}) as unknown as NonNullable<App.Locals['user']>
};

export function createMockSession(user = userFixture.pro()) {
	return {
		session: {
			id: 'sess_123',
			userId: user.id,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			token: 'tok_123',
			createdAt: new Date(),
			updatedAt: new Date(),
			ipAddress: '127.0.0.1',
			userAgent: 'Vitest/Test-Agent'
		},
		user
	};
}
