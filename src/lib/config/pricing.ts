// src/lib/config/pricing.ts
import { PUBLIC_PADDLE_PRO_PRICE_ID, PUBLIC_PADDLE_STANDARD_PRICE_ID } from '$env/static/public';

export interface Tier {
	name: 'Standard' | 'Unlimited Pro';
	badge?: string;
	description: string;
	features: string[];
	priceId: string;
	highlighted?: boolean;
}

export const tiers: Tier[] = [
	{
		name: 'Standard',
		badge: '1 Developer',
		description: 'Perfect for solopreneurs launching a single product or SaaS.',
		priceId: PUBLIC_PADDLE_STANDARD_PRICE_ID || '',
		features: [
			'Full Svelte 5 + Hono RPC Source Code',
			'Better Auth (Session + Social Logins)',
			'Drizzle ORM + Neon Serverless Postgres',
			'Upstash Redis Caching & Rate Limiting',
			'UploadThing File Uploads & Resend Mail',
			'Private GitHub Repository Access'
		]
	},
	{
		name: 'Unlimited Pro',
		badge: 'Unlimited Projects',
		description: 'For agencies, serial founders, and team workflows.',
		priceId: PUBLIC_PADDLE_PRO_PRICE_ID || '',
		highlighted: true,
		features: [
			'Everything in Standard License',
			'Unlimited Commercial Projects & Clients',
			'Multi-Tenant Team Workspace Module',
			'Priority GitHub Issue Support',
			'Future SuperSvelte Feature Addons'
		]
	}
];
