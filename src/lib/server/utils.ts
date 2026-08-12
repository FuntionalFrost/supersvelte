// src/lib/server/utils.ts
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Parses Set-Cookie headers from a Better Auth Response object
 * and applies them using SvelteKit's event.cookies.set() API.
 */
export function setCookiesFromResponse(event: RequestEvent, response: Response) {
	const setCookies = response.headers.getSetCookie();

	for (const cookieStr of setCookies) {
		const [cookiePair] = cookieStr.split(';');
		const [name, ...valParts] = cookiePair.split('=');
		const value = valParts.join('=');

		if (name && value !== undefined) {
			event.cookies.set(name.trim(), value.trim(), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production'
			});
		}
	}
}
