import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import crypto from 'node:crypto';
import { z } from 'zod';

// Re-export all Better-Auth tables
export * from './auth.schema';

// Import only the tables that participate in Drizzle relations or table definitions
import { account, invitation, member, organization, session, user } from './auth.schema';

// --- CUSTOM APPLICATION TABLES ---

// 1. PROJECTS
export const projects = pgTable(
	'projects',
	{
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
	},
	(table) => [
		index('projects_userId_idx').on(table.userId),
		index('projects_organizationId_idx').on(table.organizationId)
	]
);

// 2. FILES (UploadThing Metadata)
export const files = pgTable(
	'files',
	{
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
	},
	(table) => [
		index('files_userId_idx').on(table.userId),
		index('files_organizationId_idx').on(table.organizationId)
	]
);

// 3. POLAR CUSTOMERS
export const customers = pgTable('customers', {
	customerId: text('customer_id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	email: text('email').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 4. POLAR PURCHASES & LICENCES
export const purchases = pgTable(
	'purchases',
	{
		transactionId: text('transaction_id').primaryKey(),
		customerId: text('customer_id').references(() => customers.customerId, { onDelete: 'cascade' }),
		userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
		subscriptionId: text('subscription_id'),
		priceId: text('price_id'),
		productId: text('product_id').notNull(),
		licenseKey: text('license_key').unique(),
		status: text('status').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => [
		index('purchases_userId_idx').on(table.userId),
		index('purchases_customerId_idx').on(table.customerId)
	]
);

// --- DRIZZLE RELATIONS DEFINITIONS ---

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	invitations: many(invitation),
	projects: many(projects),
	files: many(files),
	purchases: many(purchases)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
	projects: many(projects),
	files: many(files)
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	})
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id]
	})
}));

export const projectsRelations = relations(projects, ({ one }) => ({
	user: one(user, {
		fields: [projects.userId],
		references: [user.id]
	}),
	organization: one(organization, {
		fields: [projects.organizationId],
		references: [organization.id]
	})
}));

export const filesRelations = relations(files, ({ one }) => ({
	user: one(user, {
		fields: [files.userId],
		references: [user.id]
	}),
	organization: one(organization, {
		fields: [files.organizationId],
		references: [organization.id]
	})
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
	user: one(user, {
		fields: [customers.userId],
		references: [user.id]
	}),
	purchases: many(purchases)
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
	customer: one(customers, {
		fields: [purchases.customerId],
		references: [customers.customerId]
	}),
	user: one(user, {
		fields: [purchases.userId],
		references: [user.id]
	})
}));

// --- SCHEMAS, TYPES & UTILITIES ---

export const insertProjectSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	slug: z.string().min(1, 'Slug is required')
});

export type Customer = typeof customers.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type FileRecord = typeof files.$inferSelect;

export function generateLicenseKey(prefix = 'SS-LIVE'): string {
	const bytes = crypto.randomBytes(6).toString('hex').toUpperCase();
	return `${prefix}-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}`;
}
