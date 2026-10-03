// src/lib/server/db/queries.ts
import { db } from '#lib/server/db/index.js';
import { files, projects } from '#lib/server/db/schema.js';
import { redis } from '#lib/server/ratelimit.js';
import { desc, eq } from 'drizzle-orm';

/**
 * Fetch projects scoped to an authenticated user or active organization with tenant-isolated Redis caching.
 */
export async function getProjects(userId?: string, organizationId?: string | null) {
	if (!userId && !organizationId) {
		return { data: [], source: 'Empty (Unauthenticated)' as const };
	}

	const cacheKey = organizationId
		? `cache:projects:org:${organizationId}`
		: `cache:projects:user:${userId}`;

	// 1. Attempt cache read from Upstash Redis
	if (redis) {
		try {
			const cached = await redis.get<(typeof projects.$inferSelect)[]>(cacheKey);
			if (cached) {
				return { data: cached, source: 'Upstash Redis Cache (Fast)' as const };
			}
		} catch (err) {
			console.error('[Redis Cache Read Error]:', err);
		}
	}

	// 2. Cache Miss: Fetch fresh scoped data from Neon Postgres
	const data = organizationId
		? await db.select().from(projects).where(eq(projects.organizationId, organizationId))
		: await db.select().from(projects).where(eq(projects.userId, userId!));

	// 3. Populate Redis cache (expires in 60 seconds)
	if (redis) {
		try {
			await redis.set(cacheKey, data, { ex: 60 });
		} catch (err) {
			console.error('[Redis Cache Write Error]:', err);
		}
	}

	return { data, source: 'Neon Postgres DB (Fresh Query)' as const };
}

/**
 * Purge the tenant's projects cache key whenever a write operation occurs.
 */
export async function invalidateProjectsCache(userId?: string, organizationId?: string | null) {
	if (!redis || (!userId && !organizationId)) return;

	const cacheKey = organizationId
		? `cache:projects:org:${organizationId}`
		: `cache:projects:user:${userId}`;

	try {
		await redis.del(cacheKey);
	} catch (err) {
		console.error('[Redis Cache Invalidation Error]:', err);
	}
}

/**
 * Fetch recent uploaded files.
 */
export async function getRecentFiles(limit = 10) {
	return await db.select().from(files).orderBy(desc(files.createdAt)).limit(limit);
}

/**
 * Fetch files uploaded by a specific user.
 */
export async function getUserFiles(userId: string) {
	return await db
		.select()
		.from(files)
		.where(eq(files.userId, userId))
		.orderBy(desc(files.createdAt));
}
