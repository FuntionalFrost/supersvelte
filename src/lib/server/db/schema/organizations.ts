// src/lib/server/db/schema/organizations.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema'; // Points to the Better Auth user table in schema/auth.ts

export const organizations = pgTable('organizations', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const members = pgTable('members', {
	id: uuid('id').defaultRandom().primaryKey(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role', { enum: ['owner', 'admin', 'member'] })
		.default('member')
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
