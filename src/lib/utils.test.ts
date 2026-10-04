import { describe, expect, it } from 'vitest';
import { cn, getSafeRedirectUrl } from './utils';

describe('cn utility', () => {
	it('merges class names correctly', () => {
		expect(cn('px-2 py-1', 'bg-blue-500')).toBe('px-2 py-1 bg-blue-500');
	});

	it('resolves conflicting tailwind classes with tailwind-merge', () => {
		expect(cn('p-4', 'p-2')).toBe('p-2');
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});

	it('handles conditional falsy expressions and empty values', () => {
		const isHidden = false;
		expect(cn('base', isHidden && 'hidden', null, undefined, 'active')).toBe('base active');
	});
});

describe('getSafeRedirectUrl utility', () => {
	it('returns fallback when no url provided', () => {
		expect(getSafeRedirectUrl(null)).toBe('/dashboard');
		expect(getSafeRedirectUrl(undefined, '/home')).toBe('/home');
	});

	it('extracts and validates redirectTo parameter from URL object', () => {
		const url = new URL('https://example.com/login?redirectTo=%2Fsettings%2Fteam');
		expect(getSafeRedirectUrl(url)).toBe('/settings/team');
	});

	it('blocks open redirect attacks attempting protocol relative URLs', () => {
		const url = new URL('https://example.com/login?redirectTo=%2F%2Fevil.com');
		expect(getSafeRedirectUrl(url)).toBe('/dashboard');
	});

	it('blocks external absolute URLs', () => {
		const url = new URL('https://example.com/login?redirectTo=https%3A%2F%2Fevil.com');
		expect(getSafeRedirectUrl(url)).toBe('/dashboard');
	});
});
