// src/routes/api/og/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const title = url.searchParams.get('title') || 'SuperSvelte';
	const desc =
		url.searchParams.get('desc') ||
		'The Batteries-Included Edge Svelte 5 + Hono RPC + Neon SaaS Boilerplate';
	const badge = url.searchParams.get('badge') || 'Svelte 5 • Hono RPC • Neon DB';

	// Helper to split text into SVG lines safely
	function wrapText(text: string, maxCharsPerLine: number): string[] {
		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
				currentLine = (currentLine + ' ' + word).trim();
			} else {
				if (currentLine) lines.push(currentLine);
				currentLine = word;
			}
		}
		if (currentLine) lines.push(currentLine);
		return lines.slice(0, 3); // Max 3 lines
	}

	const titleLines = wrapText(title, 32);
	const descLines = wrapText(desc, 60);

	const titleSvg = titleLines
		.map(
			(line, i) =>
				`<tspan x="80" y="${280 + i * 58}" fill="#ffffff" font-weight="800" font-size="48">${escapeXml(line)}</tspan>`
		)
		.join('');

	const descStart = 310 + titleLines.length * 58;
	const descSvg = descLines
		.map(
			(line, i) =>
				`<tspan x="80" y="${descStart + i * 32}" fill="#a1a1aa" font-weight="500" font-size="22">${escapeXml(line)}</tspan>`
		)
		.join('');

	const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Background Gradient -->
		<linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="#09090b" />
			<stop offset="50%" stop-color="#121217" />
			<stop offset="100%" stop-color="#09090b" />
		</linearGradient>

		<!-- Radial Glows -->
		<radialGradient id="emerald-glow" cx="20%" cy="20%" r="50%">
			<stop offset="0%" stop-color="#10b981" stop-opacity="0.18" />
			<stop offset="100%" stop-color="#10b981" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="cyan-glow" cx="80%" cy="80%" r="50%">
			<stop offset="0%" stop-color="#06b6d4" stop-opacity="0.15" />
			<stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
		</radialGradient>

		<!-- Subtle Grid Pattern -->
		<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
			<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" stroke-width="0.75" stroke-opacity="0.3" />
		</pattern>

		<!-- Border Gradient -->
		<linearGradient id="border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="#10b981" stop-opacity="0.6" />
			<stop offset="50%" stop-color="#3b82f6" stop-opacity="0.4" />
			<stop offset="100%" stop-color="#06b6d4" stop-opacity="0.6" />
		</linearGradient>
	</defs>

	<style>
		text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
	</style>

	<!-- Canvas Background -->
	<rect width="1200" height="630" fill="url(#bg-grad)" />
	<rect width="1200" height="630" fill="url(#grid)" />
	<rect width="1200" height="630" fill="url(#emerald-glow)" />
	<rect width="1200" height="630" fill="url(#cyan-glow)" />

	<!-- Outer Card Border -->
	<rect x="20" y="20" width="1160" height="590" rx="24" fill="none" stroke="url(#border-grad)" stroke-width="1.5" stroke-opacity="0.6" />

	<!-- Header Area: Logo & Badge -->
	<g transform="translate(80, 80)">
		<!-- Logo Mark -->
		<rect width="48" height="48" rx="12" fill="#10b981" />
		<text x="24" y="32" font-size="22" font-weight="900" fill="#09090b" text-anchor="middle">S5</text>
		
		<!-- Logo Text -->
		<text x="64" y="33" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
			Super<tspan fill="#10b981">Svelte</tspan>
		</text>

		<!-- Badge Pill -->
		<rect x="740" y="4" width="280" height="38" rx="19" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3" />
		<text x="880" y="28" font-size="13" font-weight="700" fill="#34d399" text-anchor="middle" letter-spacing="0.5">
			${escapeXml(badge)}
		</text>
	</g>

	<!-- Main Title & Description -->
	<text>${titleSvg}</text>
	<text>${descSvg}</text>

	<!-- Footer Technology Tags -->
	<g transform="translate(80, 520)">
		<line x1="0" y1="0" x2="1040" y2="0" stroke="#27272a" stroke-width="1" />
		
		<g transform="translate(0, 32)">
			<text x="0" y="0" font-size="14" font-weight="700" fill="#71717a">STACK</text>
			
			<rect x="65" y="-16" width="105" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="117" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Better-Auth</text>

			<rect x="180" y="-16" width="115" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="237" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Neon Postgres</text>

			<rect x="305" y="-16" width="95" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="352" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Drizzle ORM</text>

			<rect x="410" y="-16" width="95" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="457" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Hono Zod</text>

			<rect x="515" y="-16" width="80" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="555" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Polar.sh</text>

			<rect x="605" y="-16" width="105" height="26" rx="6" fill="#18181b" stroke="#27272a" />
			<text x="657" y="1" font-size="12" font-weight="600" fill="#d4d4d8" text-anchor="middle">Upstash Redis</text>

			<text x="1040" y="1" font-size="14" font-weight="600" fill="#10b981" text-anchor="end">supersvelte.dev</text>
		</g>
	</g>
</svg>
`.trim();

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
		}
	});
};

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
