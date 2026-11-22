// scripts/scaffold-resource.ts
import * as p from '@clack/prompts';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

async function main() {
	let resource = process.argv[2]?.toLowerCase().trim();

	if (!resource) {
		p.intro('⚡ SuperSvelte — Scaffold Resource');
		const input = await p.text({
			message: 'Enter singular resource name (e.g. project, invoice, article):',
			placeholder: 'project',
			validate: (val) => {
				if (!val || !val.trim()) return 'Resource name is required';
				if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(val.trim())) {
					return 'Use alphanumeric characters starting with a letter';
				}
				return undefined;
			}
		});
		if (p.isCancel(input)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		resource = input.toLowerCase().trim();
	}

	const PascalName = resource.charAt(0).toUpperCase() + resource.slice(1);
	const PluralName = resource.endsWith('s') ? resource : `${resource}s`;

	// 1. Generate Drizzle Schema
	const schemaPath = path.resolve(`src/lib/server/db/schema/${PluralName}.ts`);
	const schemaCode = `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../schema';

export const ${PluralName} = pgTable('${PluralName}', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
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

	fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
	fs.mkdirSync(path.dirname(routePath), { recursive: true });

	fs.writeFileSync(schemaPath, schemaCode);
	fs.writeFileSync(routePath, routeCode);

	console.log(`✅ Generated Schema: ${schemaPath}`);
	console.log(`✅ Generated API Route: ${routePath}`);
}

main().catch((err) => {
	console.error('Fatal Scaffold Error:', err);
	process.exit(1);
});
