import { expect, test } from '@playwright/test';

test.describe('Authentication Routes', () => {
	test.describe('Login Page (/login)', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/login');
		});

		test('renders login card and form elements', async ({ page }) => {
			await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

			// GitHub OAuth
			const githubBtn = page.getByRole('button', { name: /Continue with GitHub/i });
			await expect(githubBtn).toBeVisible();

			// Form fields
			const emailInput = page.getByPlaceholder('name@example.com');
			const passwordInput = page.getByPlaceholder('••••••••');
			const submitBtn = page.getByRole('button', { name: 'Sign In with Email' });

			await expect(emailInput).toBeVisible();
			await expect(passwordInput).toBeVisible();
			await expect(submitBtn).toBeVisible();
		});

		test('navigates to signup page when clicking Sign Up link', async ({ page }) => {
			const signupLink = page.locator('a[href*="signup"]').first();
			await expect(signupLink).toBeVisible();
			await signupLink.click();
			await expect(page).toHaveURL(/\/signup/);
			await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();
		});
	});

	test.describe('Signup Page (/signup)', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/signup');
		});

		test('renders signup card and inputs', async ({ page }) => {
			await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();

			// GitHub OAuth
			const githubBtn = page.getByRole('button', { name: /Continue with GitHub/i });
			await expect(githubBtn).toBeVisible();

			// Form fields
			const nameInput = page.getByPlaceholder('Jane Doe');
			const emailInput = page.getByPlaceholder('name@example.com');
			const passwordInput = page.getByPlaceholder('••••••••');
			const submitBtn = page.getByRole('button', { name: 'Create Account with Email' });

			await expect(nameInput).toBeVisible();
			await expect(emailInput).toBeVisible();
			await expect(passwordInput).toBeVisible();
			await expect(submitBtn).toBeVisible();
		});

		test('navigates to login page when clicking Sign In link', async ({ page }) => {
			const signinLink = page.locator('a[href*="login"]').first();
			await expect(signinLink).toBeVisible();
			await signinLink.click();
			await expect(page).toHaveURL(/\/login/);
			await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
		});
	});
});
