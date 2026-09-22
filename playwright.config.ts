/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm dev --port 4173',
		url: 'http://localhost:4173',
		reuseExistingServer: !process.env.CI,
		env: {
			ORIGIN: 'http://localhost:4173',
			PLAYWRIGHT: 'true'
		}
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
