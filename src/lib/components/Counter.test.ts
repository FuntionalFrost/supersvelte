import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter component', () => {
	it('increments counter on click', async () => {
		render(Counter);
		const button = screen.getByRole('button');

		expect(button).toHaveTextContent('0');
		await fireEvent.click(button);
		expect(button).toHaveTextContent('1');
	});
});
