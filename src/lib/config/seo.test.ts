import { describe, expect, it } from 'vitest';
import { defaultMetaTags, siteConfig } from './seo';

describe('SEO Configuration', () => {
	it('defines correct site metadata', () => {
		expect(siteConfig.name).toBe('SuperSvelte');
		expect(siteConfig.title).toContain('SuperSvelte');
		expect(siteConfig.url).toBe('https://supersvelte.netlify.app');
		expect(siteConfig.twitterHandle).toBe('@funtionalfrost');
	});

	it('configures default meta tags with OpenGraph and Twitter cards', () => {
		expect(defaultMetaTags.title).toBe(siteConfig.title);
		expect(defaultMetaTags.canonical).toBe(siteConfig.url);
		expect(defaultMetaTags.openGraph?.siteName).toBe('SuperSvelte');
		expect(defaultMetaTags.twitter?.cardType).toBe('summary_large_image');
	});
});
