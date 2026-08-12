// src/lib/server/db/schema.ts
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import crypto from 'node:crypto';
import { z } from 'zod';

// 1. USER TABLE (Includes Admin plugin fields)
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	role: text('role').default('user'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 2. SESSION TABLE (Includes Organization active context field)
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	activeOrganizationId: text('active_organization_id')
});

// 3. ACCOUNT TABLE
export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 4. VERIFICATION TABLE
export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 5. ORGANIZATION TABLE
export const organization = pgTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	logo: text('logo'),
	metadata: text('metadata'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// 6. MEMBER TABLE
export const member = pgTable('member', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').notNull().default('member'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// 7. INVITATION TABLE
export const invitation = pgTable('invitation', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role').default('member'),
	status: text('status').notNull().default('pending'),
	inviterId: text('inviter_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// 8. PROJECTS TABLE (Linked to User & Organization)
export const projects = pgTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	organizationId: text('organization_id').references(() => organization.id, {
		onDelete: 'cascade'
	}),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// 9. FILES TABLE
export const files = pgTable('files', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	url: text('url').notNull(),
	key: text('key').notNull(),
	name: text('name').notNull(),
	size: integer('size').notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	organizationId: text('organization_id').references(() => organization.id, {
		onDelete: 'cascade'
	}),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// 10. PADDLE CUSTOMERS TABLE (Linked to Better Auth User)
export const customers = pgTable('customers', {
	customerId: text('customer_id').primaryKey(), // Paddle Customer ID (ctm_01h...)
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	email: text('email').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 11. PADDLE PURCHASES TABLE (Linked to Customer & Better Auth User)
export const purchases = pgTable('purchases', {
	transactionId: text('transaction_id').primaryKey(), // Paddle Transaction ID (txn_01h...)
	customerId: text('customer_id').references(() => customers.customerId, { onDelete: 'cascade' }),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	subscriptionId: text('subscription_id'), // Optional Paddle Subscription ID (sub_01h...)
	priceId: text('price_id').notNull(),
	productId: text('product_id').notNull(),
	licenseKey: text('license_key').unique(), // Formatted License Key (SS-LIVE-XXXX-XXXX-XXXX)
	status: text('status').notNull(), // e.g., 'completed'
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Customer = typeof customers.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;

// Zod Schema for Superforms validation
export const insertProjectSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	slug: z.string().min(1, 'Slug is required')
});

/**
 * Generates a formatted license key (e.g., SS-LIVE-A1B2-C3D4-E5F6)
 */
export function generateLicenseKey(prefix = 'SS-LIVE'): string {
	const bytes = crypto.randomBytes(6).toString('hex').toUpperCase();
	return `${prefix}-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}`;
}
