// src/lib/server/utils.ts
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Parses Set-Cookie headers from a Better Auth Response object
 * and applies them using SvelteKit's event.cookies API, preserving
 * expiration dates, max-age, same-site attributes, and deletion flags.
 */
export function setCookiesFromResponse(event: RequestEvent, response: Response) {
	const setCookies = response.headers.getSetCookie();

	// Never enforce Secure flag on plain HTTP localhost/127.0.0.1 (e.g. dev:5173 or preview:4173)
	const isLocalhost =
		event.url.hostname === 'localhost' ||
		event.url.hostname === '127.0.0.1' ||
		event.url.hostname === '::1';
	const isSecure =
		!isLocalhost &&
		(event.url.protocol === 'https:' || event.request.headers.get('x-forwarded-proto') === 'https');

	for (const cookieStr of setCookies) {
		const parts = cookieStr.split(';').map((p) => p.trim());
		const [nameValue, ...attributes] = parts;
		const [name, ...valParts] = nameValue.split('=');
		const value = valParts.join('=');

		if (name) {
			const options: {
				path: string;
				httpOnly: boolean;
				sameSite: 'lax' | 'strict' | 'none';
				secure: boolean;
				maxAge?: number;
				expires?: Date;
				domain?: string;
			} = {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: isSecure
			};

			for (const attr of attributes) {
				const [attrName, ...attrValParts] = attr.split('=');
				const lowerName = attrName.toLowerCase();
				const attrVal = attrValParts.join('=');

				if (lowerName === 'max-age') {
					options.maxAge = parseInt(attrVal, 10);
				} else if (lowerName === 'expires') {
					options.expires = new Date(attrVal);
				} else if (lowerName === 'path') {
					options.path = attrVal || '/';
				} else if (lowerName === 'domain') {
					if (!isLocalhost && attrVal) {
						options.domain = attrVal;
					}
				} else if (lowerName === 'samesite') {
					const s = attrVal.toLowerCase();
					if (s === 'strict' || s === 'none' || s === 'lax') {
						options.sameSite = s;
					}
				}
			}

			if (
				options.maxAge === 0 ||
				(options.expires && options.expires.getTime() <= Date.now()) ||
				value === ''
			) {
				event.cookies.delete(name.trim(), { path: options.path, domain: options.domain });
			} else {
				event.cookies.set(name.trim(), value.trim(), options);
			}
		}
	}
}
