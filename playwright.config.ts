/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm dev --port 4199',
		url: 'http://localhost:4199',
		reuseExistingServer: false,
		env: {
			ORIGIN: 'http://localhost:4199',
			PLAYWRIGHT: 'true'
		}
	},
	testDir: 'e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: {
		baseURL: 'http://localhost:4199',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
