// src/lib/config/seo.ts
import type { MetaTagsProps } from 'svelte-meta-tags';

export const siteConfig = {
	name: 'SuperSvelte',
	title: 'SuperSvelte — The Batteries-Included Edge TS Framework',
	description:
		'Full-stack Svelte 5 boilerplate with OpenAPI Hono RPC, Better Auth, Neon Postgres, Drizzle ORM, Polar, and Upstash Redis.',
	url: 'https://supersvelte.netlify.app',
	ogImage: 'https://supersvelte.netlify.app/og.png',
	twitterHandle: '@funtionalfrost'
};

export const defaultMetaTags: MetaTagsProps = {
	title: siteConfig.title,
	titleTemplate: '%s | SuperSvelte',
	description: siteConfig.description,
	canonical: siteConfig.url,
	openGraph: {
		type: 'website',
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name
			}
		]
	},
	twitter: {
		site: siteConfig.twitterHandle,
		creator: siteConfig.twitterHandle,
		cardType: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		image: siteConfig.ogImage
	}
};
