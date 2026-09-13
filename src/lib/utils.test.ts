import { describe, expect, it } from 'vitest';
import { cn } from './utils';

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
