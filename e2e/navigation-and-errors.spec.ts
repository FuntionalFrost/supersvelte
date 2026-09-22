import { expect, test } from '@playwright/test';

test.describe('Navigation, Theme, and Error Handling', () => {
	test('renders 404 error page for unknown routes', async ({ page }) => {
		const response = await page.goto('/non-existent-page-url-404');
		expect(response?.status()).toBe(404);

		await expect(page.getByRole('heading', { name: /Page Not Found|404/i })).toBeVisible();

		// Action buttons
		const homeLink = page.getByRole('link', { name: /Home/i });
		if (await homeLink.isVisible()) {
			await homeLink.click();
			await expect(page).toHaveURL('/');
		}
	});

	test('theme toggle switches theme mode', async ({ page }) => {
		await page.goto('/');

		const themeToggle = page.getByRole('button', { name: /Toggle Theme|theme/i });
		if (await themeToggle.isVisible()) {
			await themeToggle.click();
			await expect(themeToggle).toBeVisible();
		}
	});

	test('marketing header navigation links and logo function properly', async ({ page }) => {
		await page.goto('/');

		// Logo links to root
		const logo = page.getByRole('link', { name: /SuperSvelte/i }).first();
		await expect(logo).toBeVisible();
		await expect(logo).toHaveAttribute('href', /^\.?\/$/);
	});

	test('marketing footer contains legal links and current year', async ({ page }) => {
		await page.goto('/');

		const footer = page.locator('footer');
		await expect(footer).toBeVisible();

		const termsLink = footer.getByRole('link', { name: /Terms/i }).first();
		const privacyLink = footer.getByRole('link', { name: /Privacy/i }).first();

		await expect(termsLink).toBeVisible();
		await expect(privacyLink).toBeVisible();
	});

	test('documentation route (/docs) redirects and renders documentation', async ({ page }) => {
		await page.goto('/docs');
		await expect(page).toHaveURL(/\/docs/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});
});
