// src/routes/(marketing)/support/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	redirect(301, '/contact');
};
