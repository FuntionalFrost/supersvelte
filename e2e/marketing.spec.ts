import { expect, test } from '@playwright/test';

test.describe('Marketing & Landing Pages', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('landing page loads with title and hero section', async ({ page }) => {
		await expect(page).toHaveTitle(/SuperSvelte/);

		// Main heading and hero badges
		const mainHeading = page.getByRole('heading', { level: 1 });
		await expect(mainHeading).toBeVisible();

		// Hero Call-to-Action buttons
		const getSuperSvelteBtn = page.getByRole('link', { name: /Get SuperSvelte/i }).first();
		await expect(getSuperSvelteBtn).toBeVisible();
	});

	test('tech stack highlights section renders features', async ({ page }) => {
		const featuresSection = page.locator('#features');
		await expect(featuresSection).toBeVisible();

		await expect(featuresSection.getByText(/Svelte 5/i).first()).toBeVisible();
		await expect(featuresSection.getByText(/Hono/i).first()).toBeVisible();
		await expect(featuresSection.getByText(/Drizzle/i).first()).toBeVisible();
		await expect(featuresSection.getByText(/Better Auth/i).first()).toBeVisible();
	});

	test('competitor comparison matrix allows switching categories', async ({ page }) => {
		await page.waitForLoadState('networkidle');
		const comparisonSection = page.locator('#comparison');
		await comparisonSection.scrollIntoViewIfNeeded();
		await expect(comparisonSection).toBeVisible();

		const tsTab = comparisonSection.locator('button', { hasText: 'vs. TS Frameworks' });
		await tsTab.scrollIntoViewIfNeeded();
		await tsTab.click();
		await expect(tsTab).toHaveClass(/bg-primary/);
		await expect(comparisonSection.getByText(/AdonisJS/i).first()).toBeVisible();
	});

	test('pricing section renders standard and pro tiers with features', async ({ page }) => {
		const pricingSection = page.locator('#pricing');
		await expect(pricingSection).toBeVisible();

		await expect(pricingSection.getByRole('heading', { name: 'Standard License' })).toBeVisible();
		await expect(
			pricingSection.getByRole('heading', { name: 'Unlimited Pro License' })
		).toBeVisible();
	});

	test('FAQ section renders frequently asked questions', async ({ page }) => {
		const faqSection = page.locator('#faq');
		await expect(faqSection).toBeVisible();
		await expect(
			faqSection.getByRole('heading', { name: /Frequently Asked Questions/i })
		).toBeVisible();
	});
});

test.describe('Marketing & Legal Subpages', () => {
	test('/privacy policy page renders correct legal information', async ({ page }) => {
		await page.goto('/privacy');
		await expect(page).toHaveTitle(/Privacy Policy/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy Policy');
	});

	test('/terms of service page renders license conditions', async ({ page }) => {
		await page.goto('/terms');
		await expect(page).toHaveTitle(/Terms of Service/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms of Service');
	});

	test('/refunds policy page renders refund guarantee', async ({ page }) => {
		await page.goto('/refunds');
		await expect(page).toHaveTitle(/Refund Policy/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Refund Policy');
	});

	test('/vs architectural comparison page renders', async ({ page }) => {
		await page.goto('/vs');
		await expect(page).toHaveTitle(/SuperSvelte vs|Comparison/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});
});
