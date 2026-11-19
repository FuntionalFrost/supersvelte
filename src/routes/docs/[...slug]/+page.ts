// src/routes/docs/[...slug]/+page.ts
import { docsRegistry } from '#lib/docs/index.js';
import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return docsRegistry.map((doc) => ({ slug: doc.slug }));
};
