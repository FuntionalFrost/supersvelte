// src/lib/server/paddle-ip-check.ts
import { building } from '$app/environment';

let cachedCidrs: string[] = [];
let lastFetch = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 Hours

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

// Convert IPv4 string to 32-bit unsigned integer
function ipToLong(ip: string): number {
	return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Bitwise IPv4 CIDR subnet match
export function isIpAllowed(ip: string, cidrs: string[]): boolean {
	if (!ip || cidrs.length === 0) return true; // Fallback to signature check if list unavailable

	try {
		const ipNum = ipToLong(ip);

		return cidrs.some((cidr) => {
			const [range, prefixStr] = cidr.split('/');
			const prefix = prefixStr ? parseInt(prefixStr, 10) : 32;
			const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
			const rangeNum = ipToLong(range);

			return (ipNum & mask) === (rangeNum & mask);
		});
	} catch {
		return true; // Fallback to signature verification if IP parsing fails
	}
}
