import { expect, test } from '@playwright/test';

test('landing page renders successfully', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/SuperSvelte/);
	const heading = page.getByRole('heading', { level: 1 });
	await expect(heading).toBeVisible();
});
