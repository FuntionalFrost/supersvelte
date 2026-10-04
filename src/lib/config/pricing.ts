// src/lib/config/pricing.ts
import { PUBLIC_POLAR_PRO_PRODUCT_ID, PUBLIC_POLAR_STANDARD_PRODUCT_ID } from '$app/env/public';

export interface PricingPlan {
	id: string;
	productId: string;
	name: string;
	price: number;
	currency?: string;
	badge: string;
	isPopular?: boolean;
	description: string;
	buttonText: string;
	features: string[];
}

export const pricingPlans: PricingPlan[] = [
	{
		id: 'standard',
		productId: PUBLIC_POLAR_STANDARD_PRODUCT_ID,
		name: 'Standard License',
		price: 99,
		currency: '€',
		badge: '1 Developer',
		description: 'Perfect for solopreneurs launching a single product.',
		buttonText: 'Get Standard License',
		features: [
			'Full Svelte 5 + Hono Source Code',
			'Auto-Introspecting /admin CRUD Dashboard',
			'Better Auth (Session + Social Logins)',
			'Drizzle ORM + Neon Serverless Postgres',
			'Dual Storage (UploadThing & Cloudflare R2 / S3)',
			'Resend Mail + Zero-Config Dev Logger',
			'Private GitHub Repository Access'
		]
	},
	{
		id: 'pro',
		productId: PUBLIC_POLAR_PRO_PRODUCT_ID,
		name: 'Unlimited Pro License',
		price: 199,
		currency: '€',
		badge: 'Unlimited Projects',
		isPopular: true,
		description: 'For agencies, serial founders, and team workflows.',
		buttonText: 'Get Pro License',
		features: [
			'Everything in Standard License',
			'Unlimited Commercial Projects & Clients',
			'Multi-Tenant Team Workspace Module',
			'Yaxa Svelte UI Design System & Themes',
			'Priority GitHub Issue Support',
			'Future SuperSvelte Feature Addons'
		]
	}
];
