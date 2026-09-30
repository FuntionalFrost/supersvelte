// src/routes/docs/[...slug]/+page.server.ts
import { docsRegistry, getDocBySlug } from '$lib/docs';
import { highlightCode } from '$lib/server/shiki';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const doc = getDocBySlug(slug);

	if (!doc) {
		throw error(404, `Documentation article "${slug}" not found`);
	}

	// Pre-render syntax highlighted code server-side via Shiki
	const highlightedSections = await Promise.all(
		doc.sections.map(async (sec) => {
			let highlightedCode = '';
			if (sec.code) {
				highlightedCode = await highlightCode(sec.code.code, sec.code.lang);
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
