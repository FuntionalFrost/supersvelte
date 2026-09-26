// src/site.config.ts
import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'SuperSvelte',
	title: 'SuperSvelte — The Batteries-Included Full-Stack Svelte 5 Framework',
	description:
		'Enterprise-grade Svelte 5 boilerplate with OpenAPI Hono RPC, Better Auth, Neon Postgres, Drizzle ORM, Polar, and Upstash Redis. Built with Yaxa.',
	url: 'https://supersvelte.netlify.app',
	email: 'devfrost@protonmail.com',
	author: {
		name: 'FunctionalFrost',
		twitter: '@funtionalfrost',
		github: 'https://github.com/FunctionalFrost'
	},
	project: {
		license: 'MIT',
		type: 'open-source',
		pricingModel: 'paid',
		repositoryUrl: 'https://github.com/FunctionalFrost/supersvelte',
		isAccessibleForFree: false,
		badge: 'Svelte 5 Boilerplate'
	},
	nav: [
		{ label: 'Stack & Specs', href: '/#features' },
		{ label: 'Matrix', href: '/#comparison' },
		{ label: 'Pricing', href: '/#pricing' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'FAQ', href: '/#faq' }
	],
	theme: {
		primaryColor: '#2dd4bf',
		neutralColor: '#71717a',
		defaultMode: 'dark'
	},
	socials: {
		github: 'https://github.com/FunctionalFrost/supersvelte',
		twitter: '@funtionalfrost'
	},
	company: {
		legalName: 'SuperSvelte',
		contactEmail: 'devfrost@protonmail.com'
	},
	legal: {
		paymentProcessor: 'polar',
		refundDays: 14,
		links: {
			privacy: '/privacy',
			terms: '/terms',
			refunds: '/refunds'
		}
	},
	seo: {
		titleTemplate: '%s · SuperSvelte',
		keywords: [
			'svelte 5',
			'sveltekit',
			'hono rpc',
			'better auth',
			'drizzle orm',
			'neon postgres',
			'polar.sh',
			'upstash redis',
			'tailwind css v4',
			'saas boilerplate'
		],
		defaultOgImage: '/api/og'
	},
	sitemap: {
		exclude: [
			'/admin/**',
			'/dashboard/**',
			'/settings/**',
			'/accept-invitation/**',
			'/welcome/**',
			'/api/**',
			'/test/**',
			'/test-gate/**'
		],
		changefreq: 'weekly',
		priority: 0.8
	},
	robots: {
		rules: [
			{
				userAgent: '*',
				allow: ['/api/og'],
				disallow: ['/admin', '/dashboard', '/settings', '/api', '/test', '/test-gate']
			}
		]
	}
});
