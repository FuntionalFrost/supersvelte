import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type URLWithSearchParams = {
	searchParams?: {
		get(name: string): string | null;
	};
};

/**
 * Sanitizes a redirect URL to prevent open redirect vulnerabilities.
 * Ensures the target starts with a single leading slash and not '//' or '/\'.
 */
export function getSafeRedirectUrl(
	url: URLWithSearchParams | URL | string | null | undefined,
	fallback = '/dashboard'
): string {
	if (!url) return fallback;

	let target: string | null = null;
	if (typeof url === 'string') {
		target = url;
	} else if (url && typeof url === 'object' && 'searchParams' in url && url.searchParams) {
		target = url.searchParams.get('redirectTo') || url.searchParams.get('callbackUrl') || null;
	}

	if (!target || typeof target !== 'string') return fallback;

	const trimmed = target.trim();
	if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
		return trimmed;
	}

	return fallback;
}
