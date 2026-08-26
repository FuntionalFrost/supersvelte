// scripts/scaffold-resource.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

const resource = process.argv[2]?.toLowerCase();

if (!resource) {
	console.error('❌ Please provide a resource name. Example: pnpm make:resource project');
	process.exit(1);
}

const PascalName = resource.charAt(0).toUpperCase() + resource.slice(1);
const PluralName = resource.endsWith('s') ? resource : `${resource}s`;

// 1. Generate Drizzle Schema
const schemaPath = path.resolve(`src/lib/server/db/schema/${PluralName}.ts`);
const schemaCode = `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const ${PluralName} = pgTable('${PluralName}', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type ${PascalName} = typeof ${PluralName}.$inferSelect;
export type New${PascalName} = typeof ${PluralName}.$inferInsert;
`;

// 2. Generate Hono RPC Route
const routePath = path.resolve(`src/lib/server/api/routes/${PluralName}.ts`);
const routeCode = `import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { ${PluralName} } from '$lib/server/db/schema/${PluralName}';
import { eq, and } from 'drizzle-orm';

const insertSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().optional()
});

export const ${PluralName}Route = new Hono()
	.get('/', async (c) => {
		const user = c.get('user')!;
		const items = await db.select().from(${PluralName}).where(eq(${PluralName}.userId, user.id));
		return c.json({ items });
	})
	.post('/', zValidator('json', insertSchema), async (c) => {
		const user = c.get('user')!;
		const body = c.req.valid('json');
		const [created] = await db.insert(${PluralName}).values({ ...body, userId: user.id }).returning();
		return c.json({ item: created }, 201);
	})
	.delete('/:id', async (c) => {
		const user = c.get('user')!;
		const id = c.req.param('id');
		await db.delete(${PluralName}).where(and(eq(${PluralName}.id, id), eq(${PluralName}.userId, user.id)));
		return c.json({ success: true });
	});
`;

fs.writeFileSync(schemaPath, schemaCode);
fs.writeFileSync(routePath, routeCode);

console.log(`✅ Generated Schema: ${schemaPath}`);
console.log(`✅ Generated API Route: ${routePath}`);
