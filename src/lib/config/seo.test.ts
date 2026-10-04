import { describe, expect, it } from 'vitest';
import { siteConfig } from '../../site.config';

describe('Site Configuration & SEO', () => {
	it('defines authoritative site metadata', () => {
		expect(siteConfig.name).toBe('SuperSvelte');
		expect(siteConfig.title).toContain('SuperSvelte');
		expect(siteConfig.url).toBe('https://supersvelte.netlify.app');
		expect(siteConfig.socials?.twitter).toBe('@funtionalfrost');
	});

	it('configures SEO templates and defaults correctly', () => {
		expect(siteConfig.seo?.titleTemplate).toBe('%s · SuperSvelte');
		expect(siteConfig.seo?.defaultOgImage).toBe('/api/og');
		expect(siteConfig.seo?.keywords).toContain('svelte 5');
	});
});
