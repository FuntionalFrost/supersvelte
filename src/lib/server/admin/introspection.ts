// src/lib/server/admin/introspection.ts
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { asc, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export interface EntityColumnSpec {
	name: string;
	label: string;
	type: 'string' | 'number' | 'boolean' | 'date' | 'json';
	isPrimaryKey?: boolean;
	isEditable?: boolean;
	isNullable?: boolean;
}

export interface EntityModelDefinition {
	key: string;
	label: string;
	singular: string;
	table: PgTable;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	primaryKeyColumn: PgColumn<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchColumns: PgColumn<any>[];
	columns: EntityColumnSpec[];
}

export const entityRegistry: Record<string, EntityModelDefinition> = {
	users: {
		key: 'users',
		label: 'Users',
		singular: 'User',
		table: schema.user,
		primaryKeyColumn: schema.user.id,
		searchColumns: [schema.user.email, schema.user.name],
		columns: [
			{ name: 'id', label: 'ID', type: 'string', isPrimaryKey: true, isEditable: false },
			{ name: 'name', label: 'Name', type: 'string', isEditable: true },
			{ name: 'email', label: 'Email', type: 'string', isEditable: true },
			{ name: 'role', label: 'Role', type: 'string', isEditable: true },
			{ name: 'banned', label: 'Banned', type: 'boolean', isEditable: true },
			{ name: 'banReason', label: 'Ban Reason', type: 'string', isEditable: true },
			{ name: 'createdAt', label: 'Joined', type: 'date', isEditable: false }
		]
	},
	organizations: {
		key: 'organizations',
		label: 'Organizations',
		singular: 'Organization',
		table: schema.organization,
		primaryKeyColumn: schema.organization.id,
		searchColumns: [schema.organization.name, schema.organization.slug],
		columns: [
			{ name: 'id', label: 'ID', type: 'string', isPrimaryKey: true, isEditable: false },
			{ name: 'name', label: 'Org Name', type: 'string', isEditable: true },
			{ name: 'slug', label: 'Slug', type: 'string', isEditable: true },
			{ name: 'logo', label: 'Logo URL', type: 'string', isEditable: true },
			{ name: 'createdAt', label: 'Created', type: 'date', isEditable: false }
		]
	},
	purchases: {
		key: 'purchases',
		label: 'Purchases & Licenses',
		singular: 'Purchase',
		table: schema.purchases,
		primaryKeyColumn: schema.purchases.transactionId,
		searchColumns: [
			schema.purchases.licenseKey,
			schema.purchases.transactionId,
			schema.purchases.productId
		],
		columns: [
			{
				name: 'transactionId',
				label: 'Txn ID',
				type: 'string',
				isPrimaryKey: true,
				isEditable: false
			},
			{ name: 'licenseKey', label: 'License Key', type: 'string', isEditable: true },
			{ name: 'productId', label: 'Product', type: 'string', isEditable: true },
			{ name: 'status', label: 'Status', type: 'string', isEditable: true },
			{ name: 'userId', label: 'User ID', type: 'string', isEditable: true },
			{ name: 'customerId', label: 'Customer ID', type: 'string', isEditable: true },
			{ name: 'createdAt', label: 'Purchased At', type: 'date', isEditable: false }
		]
	},
	customers: {
		key: 'customers',
		label: 'Customers',
		singular: 'Customer',
		table: schema.customers,
		primaryKeyColumn: schema.customers.customerId,
		searchColumns: [schema.customers.email, schema.customers.customerId],
		columns: [
			{
				name: 'customerId',
				label: 'Customer ID',
				type: 'string',
				isPrimaryKey: true,
				isEditable: false
			},
			{ name: 'email', label: 'Email', type: 'string', isEditable: true },
			{ name: 'userId', label: 'User ID', type: 'string', isEditable: true },
			{ name: 'createdAt', label: 'Created At', type: 'date', isEditable: false }
		]
	},
	projects: {
		key: 'projects',
		label: 'Projects',
		singular: 'Project',
		table: schema.projects,
		primaryKeyColumn: schema.projects.id,
		searchColumns: [schema.projects.name, schema.projects.slug],
		columns: [
			{ name: 'id', label: 'ID', type: 'string', isPrimaryKey: true, isEditable: false },
			{ name: 'name', label: 'Project Name', type: 'string', isEditable: true },
			{ name: 'slug', label: 'Slug', type: 'string', isEditable: true },
			{ name: 'userId', label: 'Owner ID', type: 'string', isEditable: true },
			{ name: 'organizationId', label: 'Org ID', type: 'string', isEditable: true },
			{ name: 'createdAt', label: 'Created At', type: 'date', isEditable: false }
		]
	},
	files: {
		key: 'files',
		label: 'Files & Storage',
		singular: 'File',
		table: schema.files,
		primaryKeyColumn: schema.files.id,
		searchColumns: [schema.files.name, schema.files.key],
		columns: [
			{ name: 'id', label: 'ID', type: 'string', isPrimaryKey: true, isEditable: false },
			{ name: 'name', label: 'File Name', type: 'string', isEditable: true },
			{ name: 'size', label: 'Size (Bytes)', type: 'number', isEditable: false },
			{ name: 'key', label: 'Storage Key', type: 'string', isEditable: false },
			{ name: 'url', label: 'URL', type: 'string', isEditable: false },
			{ name: 'userId', label: 'Uploaded By', type: 'string', isEditable: false },
			{ name: 'createdAt', label: 'Uploaded At', type: 'date', isEditable: false }
		]
	}
};

export interface ListEntityParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export async function listEntityRecords(entityKey: string, params: ListEntityParams = {}) {
	const model = entityRegistry[entityKey];
	if (!model) {
		throw new Error(`Unknown entity: "${entityKey}"`);
	}

	const page = Math.max(1, params.page || 1);
	const limit = Math.min(100, Math.max(1, params.limit || 25));
	const offset = (page - 1) * limit;

	// Build search condition
	let whereCondition: SQL | undefined = undefined;
	if (params.search && params.search.trim().length > 0 && model.searchColumns.length > 0) {
		const searchPattern = `%${params.search.trim()}%`;
		const searchClauses = model.searchColumns.map((col) => ilike(col, searchPattern));
		whereCondition = searchClauses.length === 1 ? searchClauses[0] : or(...searchClauses);
	}

	// Determine sort column
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const targetTable = model.table as any;
	const sortCol =
		params.sortBy && targetTable[params.sortBy]
			? targetTable[params.sortBy]
			: model.primaryKeyColumn;

	const orderDirective = params.sortOrder === 'asc' ? asc(sortCol) : desc(sortCol);

	// Count total matching
	const [countResult] = await (whereCondition
		? db.select({ count: count() }).from(model.table).where(whereCondition)
		: db.select({ count: count() }).from(model.table));

	const total = countResult?.count ? Number(countResult.count) : 0;

	// Fetch page rows
	const rows = await (whereCondition
		? db
				.select()
				.from(model.table)
				.where(whereCondition)
				.orderBy(orderDirective)
				.limit(limit)
				.offset(offset)
		: db.select().from(model.table).orderBy(orderDirective).limit(limit).offset(offset));

	return {
		entityKey,
		columns: model.columns,
		primaryKey: model.columns.find((c) => c.isPrimaryKey)?.name || 'id',
		rows,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}

export async function updateEntityRecord(
	entityKey: string,
	id: string,
	data: Record<string, unknown>
) {
	const model = entityRegistry[entityKey];
	if (!model) {
		throw new Error(`Unknown entity: "${entityKey}"`);
	}

	// Filter down to only editable columns
	const editableFieldNames = new Set(model.columns.filter((c) => c.isEditable).map((c) => c.name));
	const sanitizedData: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(data)) {
		if (editableFieldNames.has(key)) {
			sanitizedData[key] = value;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [updated] = await (db.update(model.table) as any)
		.set(sanitizedData)
		.where(eq(model.primaryKeyColumn, id))
		.returning();

	return updated;
}

export async function deleteEntityRecord(entityKey: string, id: string) {
	const model = entityRegistry[entityKey];
	if (!model) {
		throw new Error(`Unknown entity: "${entityKey}"`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [deleted] = await (db.delete(model.table) as any)
		.where(eq(model.primaryKeyColumn, id))
		.returning();

	return deleted;
}

export async function getDatabaseOverviewStats() {
	const [{ count: userCount }] = await db.select({ count: count() }).from(schema.user);
	const [{ count: orgCount }] = await db.select({ count: count() }).from(schema.organization);
	const [{ count: purchaseCount }] = await db.select({ count: count() }).from(schema.purchases);
	const [{ count: projectCount }] = await db.select({ count: count() }).from(schema.projects);
	const [{ count: fileCount }] = await db.select({ count: count() }).from(schema.files);

	return {
		users: Number(userCount || 0),
		organizations: Number(orgCount || 0),
		purchases: Number(purchaseCount || 0),
		projects: Number(projectCount || 0),
		files: Number(fileCount || 0)
	};
}
