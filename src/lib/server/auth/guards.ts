import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { purchases } from '$lib/server/db/schema';
import type { HonoEnv } from '$lib/server/api';
import { and, eq } from 'drizzle-orm';
import type { MiddlewareHandler } from 'hono';

export type PlanTier = 'standard' | 'pro';

export function requirePlan(requiredPlan: PlanTier): MiddlewareHandler<HonoEnv> {
	return async (c, next) => {
		const user = c.env?.locals?.user ?? (c.get('user' as never) as App.Locals['user']);

		if (!user?.id) {
			return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
		}

		if (user.role === 'admin') {
			return await next();
		}

		// Query active purchases for the user
		const userPurchases = await db
			.select()
			.from(purchases)
			.where(and(eq(purchases.userId, user.id), eq(purchases.status, 'active')));

		const proProductId = env.PUBLIC_POLAR_PRO_PRODUCT_ID;
		const hasPro = userPurchases.some(
			(p) =>
				(proProductId && p.productId === proProductId) ||
				p.productId?.toLowerCase().includes('pro') ||
				p.priceId?.toLowerCase().includes('pro')
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
