// src/lib/config/seo.ts
import { siteConfig as mainSiteConfig } from '../../site.config';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const siteConfig = {
	...mainSiteConfig,
	twitterHandle: mainSiteConfig.socials?.twitter || '@funtionalfrost',
	ogImage: `${mainSiteConfig.url}/api/og`
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
