// src/lib/server/paddle-ip-check.ts
import { building } from '$app/environment';

let cachedCidrs: string[] = [];
let lastFetch = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // Cache for 12 hours

export async function getPaddleIpCidrs(): Promise<string[]> {
	if (building) return [];

	const now = Date.now();
	if (cachedCidrs.length > 0 && now - lastFetch < CACHE_TTL_MS) {
		return cachedCidrs;
	}

	try {
		const res = await fetch('https://api.paddle.com/ips');
		if (res.ok) {
			const json = await res.json();
			cachedCidrs = json.data?.ipv4_cidrs || [];
			lastFetch = now;
		}
	} catch (err) {
		console.error('❌ Failed to fetch Paddle IP allowlist:', err);
	}

	return cachedCidrs;
}

// Simple IP in CIDR check for /32 or standard subnets
export function isIpAllowed(ip: string, cidrs: string[]): boolean {
	if (!ip || cidrs.length === 0) return true; // Fallback to signature check if IP list unavailable
	return cidrs.some((cidr) => {
		const [range] = cidr.split('/');
		return ip === range;
	});
}
