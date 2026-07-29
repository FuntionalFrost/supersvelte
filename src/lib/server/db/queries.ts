// src/lib/server/db/queries.ts
import { db } from '$lib/server/db';
import { files, projects } from '$lib/server/db/schema';
import { redis } from '$lib/server/ratelimit';
import { desc, eq } from 'drizzle-orm';

const CACHE_KEY_ALL_PROJECTS = 'cache:projects:all';

/**
 * Fetch all projects with Upstash Redis cache-aside strategy.
 */
export async function getProjects() {
	// 1. Attempt cache read from Upstash Redis
	if (redis) {
		try {
			const cached = await redis.get<(typeof projects.$inferSelect)[]>(CACHE_KEY_ALL_PROJECTS);
			if (cached) {
				return { data: cached, source: 'Upstash Redis Cache (Fast)' as const };
			}
		} catch (err) {
			console.error('[Redis Cache Read Error]:', err);
		}
	}

	// 2. Cache Miss: Fetch fresh data from Neon Postgres
	const data = await db.select().from(projects);

	// 3. Populate Redis cache (expires in 60 seconds)
	if (redis) {
		try {
			await redis.set(CACHE_KEY_ALL_PROJECTS, data, { ex: 60 });
		} catch (err) {
			console.error('[Redis Cache Write Error]:', err);
		}
	}

	return { data, source: 'Neon Postgres DB (Fresh Query)' as const };
}

/**
 * Purge the projects cache key whenever a write operation occurs.
 */
export async function invalidateProjectsCache() {
	if (redis) {
		try {
			await redis.del(CACHE_KEY_ALL_PROJECTS);
		} catch (err) {
			console.error('[Redis Cache Invalidation Error]:', err);
		}
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
