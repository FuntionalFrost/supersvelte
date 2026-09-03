// src/routes/docs/[...slug]/+page.server.ts
import { docsRegistry, getDocBySlug } from '$lib/docs';
import { error } from '@sveltejs/kit';
import { createHighlighter } from 'shiki';
import type { PageServerLoad } from './$types';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-dark'],
			langs: ['typescript', 'javascript', 'bash', 'svelte', 'html', 'css', 'json']
		});
	}
	return highlighterPromise;
}

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const doc = getDocBySlug(slug);

	if (!doc) {
		throw error(404, `Documentation article "${slug}" not found`);
	}

	const highlighter = await getHighlighter();

	// Pre-render syntax highlighted code server-side
	const highlightedSections = await Promise.all(
		doc.sections.map(async (sec) => {
			let highlightedCode = '';
			if (sec.code) {
				try {
					highlightedCode = highlighter.codeToHtml(sec.code.code.trim(), {
						lang: sec.code.lang,
						theme: 'github-dark'
					});
				} catch {
					highlightedCode = `<pre><code>${sec.code.code}</code></pre>`;
				}
			}
			return {
				...sec,
				highlightedCode
			};
		})
	);

	// Calculate prev and next navigation articles
	const currentIndex = docsRegistry.findIndex((d) => d.slug === slug);
	const prevDoc = currentIndex > 0 ? docsRegistry[currentIndex - 1] : null;
	const nextDoc = currentIndex < docsRegistry.length - 1 ? docsRegistry[currentIndex + 1] : null;

	return {
		doc,
		sections: highlightedSections,
		prevDoc: prevDoc ? { slug: prevDoc.slug, title: prevDoc.title } : null,
		nextDoc: nextDoc ? { slug: nextDoc.slug, title: nextDoc.title } : null
	};
};
