// src/lib/server/admin/introspection.test.ts
import { describe, expect, it } from 'vitest';
import { entityRegistry } from './introspection';

describe('Admin Schema Introspection', () => {
	it('registers all core database models', () => {
		expect(entityRegistry.users).toBeDefined();
		expect(entityRegistry.organizations).toBeDefined();
		expect(entityRegistry.purchases).toBeDefined();
		expect(entityRegistry.customers).toBeDefined();
		expect(entityRegistry.projects).toBeDefined();
		expect(entityRegistry.files).toBeDefined();
	});

	it('defines primary key and columns for each model', () => {
		for (const [key, model] of Object.entries(entityRegistry)) {
			expect(model.key).toBe(key);
			expect(model.columns.length).toBeGreaterThan(0);
			const pk = model.columns.find((c) => c.isPrimaryKey);
			expect(pk).toBeDefined();
		}
	});
});
