// src/lib/components/Gate.test.ts
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Gate from './Gate.svelte';

describe('Gate Component (src/lib/components/Gate.svelte)', () => {
	it('renders upgrade callout and lock icon when user does not meet requirement', () => {
		render(Gate, {
			props: {
				required: 'pro'
			}
		});

		expect(screen.getByText(/Pro Plan Required/i)).toBeInTheDocument();
		expect(screen.getByText(/Upgrade License/i)).toBeInTheDocument();
	});

	it('renders default license required message for standard requirement', () => {
		render(Gate, {
			props: {
				required: 'standard'
			}
		});

		expect(screen.getByText(/Active License Required/i)).toBeInTheDocument();
		expect(screen.getByText(/Upgrade License/i)).toBeInTheDocument();
	});
});
