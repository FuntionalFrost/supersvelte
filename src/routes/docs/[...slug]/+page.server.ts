// src/routes/docs/[...slug]/+page.server.ts
import { docsRegistry, getDocBySlug } from '#lib/docs/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const doc = getDocBySlug(slug);

	if (!doc) {
		throw error(404, `Documentation article "${slug}" not found`);
	}

	// Calculate prev and next navigation articles
	const currentIndex = docsRegistry.findIndex((d) => d.slug === slug);
	const prevDoc = currentIndex > 0 ? docsRegistry[currentIndex - 1] : null;
	const nextDoc = currentIndex < docsRegistry.length - 1 ? docsRegistry[currentIndex + 1] : null;

	return {
		doc,
		sections: doc.sections,
		prevDoc: prevDoc ? { slug: prevDoc.slug, title: prevDoc.title } : null,
		nextDoc: nextDoc ? { slug: nextDoc.slug, title: nextDoc.title } : null
	};
};
