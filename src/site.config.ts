// src/site.config.ts
import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'SuperSvelte',
	title: 'SuperSvelte — The Batteries-Included Full-Stack Svelte 5 Framework',
	description:
		'Enterprise-grade Svelte 5 boilerplate with OpenAPI Hono RPC, Better Auth, Neon Postgres, Drizzle ORM, Polar, and Upstash Redis. Built with Yaxa.',
	url: 'https://supersvelte.netlify.app',
	email: 'hello@supersvelte.dev',
	project: {
		license: 'MIT',
		type: 'open-source',
		repositoryUrl: 'https://github.com/FunctionalFrost/supersvelte'
	},
	theme: {
		primaryColor: '#ff3e00',
		neutralColor: '#71717a',
		defaultMode: 'dark'
	},
	socials: {
		github: 'https://github.com/FunctionalFrost/supersvelte',
		twitter: '@funtionalfrost'
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
				disallow: ['/admin', '/dashboard', '/settings', '/api', '/test']
			}
		]
	}
});
