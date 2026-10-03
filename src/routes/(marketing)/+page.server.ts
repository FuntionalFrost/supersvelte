// src/routes/(marketing)/+page.server.ts
import { competitorExamples, superSvelteExample } from '#lib/config/code-comparisons.js';
import { highlightCode } from '#lib/server/shiki.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [
		superSvelteServer,
		superSvelteClient,
		nextjsServer,
		nextjsClient,
		nestjsServer,
		nestjsClient
	] = await Promise.all([
		highlightCode(superSvelteExample.server, 'typescript'),
		highlightCode(superSvelteExample.client, 'svelte'),
		highlightCode(competitorExamples.nextjs.server, 'typescript'),
		highlightCode(competitorExamples.nextjs.client, 'typescript'),
		highlightCode(competitorExamples.nestjs.server, 'typescript'),
		highlightCode(competitorExamples.nestjs.client, 'typescript')
	]);

	return {
		comparisonSnippets: {
			superSvelte: {
				server: superSvelteServer,
				client: superSvelteClient
			},
			nextjs: {
				server: nextjsServer,
				client: nextjsClient
			},
			nestjs: {
				server: nestjsServer,
				client: nestjsClient
			}
		}
	};
};
