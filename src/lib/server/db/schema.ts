// src/lib/server/db/schema.ts
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// 1. USER TABLE
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 2. SESSION TABLE
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
		.references(() => user.id, { onDelete: 'cascade' })
});

// 3. ACCOUNT TABLE (Requires createdAt & updatedAt for Better Auth)
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

// 5. PROJECTS TABLE
export const projects = pgTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// 6. FILES
export const files = pgTable('files', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()), //  Auto-generates UUID
	url: text('url').notNull(),
	key: text('key').notNull(),
	name: text('name').notNull(),
	size: integer('size').notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }), //  Nullable for safety
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Zod Schema for Superforms validation
export const insertProjectSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	slug: z.string().min(1, 'Slug is required')
});
