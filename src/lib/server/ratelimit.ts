// src/lib/server/ratelimit.ts
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NODE_ENV } from '$app/env/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 1. Verify URL is an HTTP/HTTPS endpoint (Not redis://)
const url = UPSTASH_REDIS_REST_URL;

const token = UPSTASH_REDIS_REST_TOKEN;
const isUpstashConfigured = Boolean(
	url && token && (url.startsWith('https://') || url.startsWith('http://'))
);

// 2. Safely initialize Redis client
export const redis = isUpstashConfigured
	? new Redis({
			url: url!,
			token: token!
		})
	: null;

// 3. Initialize Ratelimit instance
export const ratelimit = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(5, '10 s'),
			analytics: true,
			prefix: 'app:ratelimit'
		})
	: null;

// In-memory sliding window store for local dev when Upstash is disconnected
const memoryStore = new Map<string, { count: number; reset: number }>();

export async function checkRateLimit(ip: string) {
	// Bypass rate limiting during automated test execution
	if (process.env.NODE_ENV === 'test' || NODE_ENV === 'test') {
		return {
			success: true,
			limit: 1000,
			remaining: 1000,
			reset: 0,
			mode: 'Test Bypass'
		};
	}

	// --- MODE A: Live Upstash Redis Cloud ---
	if (ratelimit) {
		try {
			const result = await ratelimit.limit(ip);
			console.log(
				`[RateLimiter] Upstash Cloud -> IP: ${ip}, Success: ${result.success}, Remaining: ${result.remaining}`
			);
			return { ...result, mode: 'Upstash Redis (Cloud)' };
		} catch (err) {
			console.error('[RateLimiter] Upstash Redis Error, falling back to local memory:', err);
		}
	}

	// --- MODE B: Active In-Memory Sliding Window (30 requests / 10 sec for local dev) ---
	const now = Date.now();
	const windowMs = 10_000;
	const limit = 30;

	const record = memoryStore.get(ip) || { count: 0, reset: now + windowMs };

	// Reset window if expired
	if (now > record.reset) {
		record.count = 0;
		record.reset = now + windowMs;
	}

	record.count += 1;
	memoryStore.set(ip, record);

	const remaining = Math.max(0, limit - record.count);
	const success = record.count <= limit;

	console.log(
		`[RateLimiter] In-Memory -> IP: ${ip}, Count: ${record.count}/${limit}, Allowed: ${success}`
	);

	return {
		success,
		limit,
		remaining,
		reset: record.reset,
		mode: isUpstashConfigured ? 'In-Memory Fallback (Upstash Error)' : 'In-Memory (No Upstash Keys)'
	};
}
