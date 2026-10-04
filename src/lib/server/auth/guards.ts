import type { HonoEnv } from '#lib/server/api/index.js';
import { hasPlanAccess } from '#lib/server/db/queries.js';
import type { MiddlewareHandler } from 'hono';

export type PlanTier = 'standard' | 'pro';

export function requirePlan(requiredPlan: PlanTier): MiddlewareHandler<HonoEnv> {
	return async (c, next) => {
		const user = c.env?.locals?.user ?? (c.get('user' as never) as App.Locals['user']);

		if (!user?.id) {
			return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
		}

		const hasAccess = await hasPlanAccess(user, requiredPlan);

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
