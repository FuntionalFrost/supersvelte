import adapterNetlify from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import adapterNode from '@sveltejs/adapter-node';
import { defineConfig } from 'vite';
import { yaxa } from 'yaxa-svelte/vite';

const isNode = process.env.DEPLOY_TARGET === 'node';

export default defineConfig(({ mode }) => ({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: true
			},
			prerender: {
				handleHttpError: ({ path, message }) => {
					if (path === '/favicon.ico') return;
					throw new Error(message);
				}
			},
			adapter: isNode ? adapterNode() : adapterNetlify()
		}),
		yaxa({ autoDiscoverRoutes: false })
	],
	...(mode === 'test' ? { resolve: { conditions: ['browser'] } } : {}),
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['tests/setup.ts']
	}
}));
