// e2e/audit-visual.spec.ts
import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:/Users/cvgov/.gemini/antigravity/brain/abcf9122-81e9-4bb2-bbc4-d5047d0e4e7b';
const screenshotsDir = path.join(artifactDir, 'screenshots');
const BASE = 'http://localhost:5173';

test.beforeAll(() => {
	if (!fs.existsSync(screenshotsDir)) {
		fs.mkdirSync(screenshotsDir, { recursive: true });
	}
});

test.describe('Live Visual & UI/UX Audit (http://localhost:5173)', () => {
	test('1. Landing Page UI/UX, Typography, and Built with Yaxa Attribution', async ({ page }) => {
		await page.goto(BASE);
		await expect(page.locator('h1')).toBeVisible();

		// Verify header and footer
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		const badge = page.getByRole('link', { name: /Built with Yaxa/i });
		await expect(badge).toBeVisible();
		await expect(badge).toHaveAttribute('href', 'https://yaxa.vercel.app');

		// Capture desktop screenshot
		await page.screenshot({
			path: path.join(screenshotsDir, '01_landing_desktop.png'),
			fullPage: true
		});
	});

	test('2. Theme Switching Visual Verification', async ({ page }) => {
		await page.goto(BASE);
		const themeToggle = page
			.locator('button')
			.filter({ has: page.locator('svg.lucide-sun, svg.lucide-moon') })
			.first();
		await expect(themeToggle).toBeVisible();
		await themeToggle.click();
		await page.waitForTimeout(400);

		await page.screenshot({ path: path.join(screenshotsDir, '02_theme_toggled.png') });
	});

	test('3. Documentation Portal (/docs) and Navigation', async ({ page }) => {
		await page.goto(`${BASE}/docs`);
		await expect(page).toHaveURL(/\/docs/);
		await expect(page.locator('h1, h2, h3').first()).toBeVisible();

		await page.screenshot({ path: path.join(screenshotsDir, '03_docs_page.png'), fullPage: true });
	});

	test('4. Authentication Views - Login (/login)', async ({ page }) => {
		await page.goto(`${BASE}/login`);
		await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
		await page.screenshot({ path: path.join(screenshotsDir, '04_login_page.png') });
	});

	test('5. Authentication Views - Signup (/signup)', async ({ page }) => {
		await page.goto(`${BASE}/signup`);
		await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();
		await page.screenshot({ path: path.join(screenshotsDir, '05_signup_page.png') });
	});

	test('6. Diagnostic Test Workbench (/test)', async ({ page }) => {
		await page.goto(`${BASE}/test`);
		await expect(page.getByText(/Diagnostic/i).first()).toBeVisible();
		await page.screenshot({
			path: path.join(screenshotsDir, '06_test_workbench.png'),
			fullPage: true
		});
	});

	test('7. Dynamic SEO and Metadata Endpoints', async ({ request }) => {
		// robots.txt
		const robots = await request.get(`${BASE}/robots.txt`);
		expect(robots.status()).toBe(200);
		expect(robots.headers()['content-type']).toContain('text/plain');
		const robotsText = await robots.text();
		expect(robotsText).toContain('User-agent:');

		// sitemap.xml
		const sitemap = await request.get(`${BASE}/sitemap.xml`);
		expect(sitemap.status()).toBe(200);
		expect(sitemap.headers()['content-type']).toContain('application/xml');
		const sitemapText = await sitemap.text();
		expect(sitemapText).toContain('sitemap.xsl');

		// sitemap.xsl
		const xsl = await request.get(`${BASE}/sitemap.xsl`);
		expect(xsl.status()).toBe(200);

		// site.webmanifest
		const manifest = await request.get(`${BASE}/site.webmanifest`);
		expect(manifest.status()).toBe(200);

		// api/og
		const og = await request.get(`${BASE}/api/og?title=SuperSvelte`);
		expect(og.status()).toBe(200);
		expect(og.headers()['content-type']).toContain('image/svg+xml');
	});

	test('8. Mobile Viewport (iPhone 14 - 390x844)', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(BASE);
		await expect(page.locator('h1')).toBeVisible();

		await page.screenshot({
			path: path.join(screenshotsDir, '07_mobile_landing.png'),
			fullPage: true
		});
	});
});
