/// <reference types="vitest/config" />
import adapterNetlify from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import adapterNode from '@sveltejs/adapter-node';
import { defineConfig } from 'vite';

const isNode = process.env.DEPLOY_TARGET === 'node';

export default defineConfig(({ mode }) => ({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: isNode ? adapterNode() : adapterNetlify(),

			typescript: {
				config: (config) => {
					config.include.push('../drizzle.config.ts');
				}
			}
		})
	],
	...(mode === 'test'
		? {
				resolve: {
					conditions: ['browser']
				}
			}
		: {}),
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['tests/setup.ts']
	}
}));
