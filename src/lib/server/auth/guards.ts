// src/lib/server/auth/guards.ts
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { MiddlewareHandler } from 'hono';

export type PlanTier = 'standard' | 'pro';

export function requirePlan(requiredPlan: PlanTier): MiddlewareHandler {
	return async (c, next) => {
		const user = c.get('user');

		if (!user) {
			return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
		}

		// Query user's purchases from the database
		const userPurchases = await db.select().from(purchases).where(eq(purchases.userId, user.id));

		const hasPro = userPurchases.some(
			(p) => p.productId?.includes('pro') || p.priceId?.includes('pro')
		);
		const hasStandard = userPurchases.length > 0;

		const hasAccess = requiredPlan === 'pro' ? hasPro : hasStandard;

		if (!hasAccess) {
			return c.json(
				{
					error: `This feature requires a ${requiredPlan.toUpperCase()} license.`,
					code: 'UPGRADE_REQUIRED',
					requiredPlan
				},
				403
			);
		}

		await next();
	};
}
