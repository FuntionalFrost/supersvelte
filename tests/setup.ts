import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Global SvelteKit navigation & environment mocks
vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(),
	beforeNavigate: vi.fn(),
	disableScrollHandling: vi.fn(),
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	preloadCode: vi.fn(),
	preloadData: vi.fn(),
	pushState: vi.fn(),
	replaceState: vi.fn()
}));

vi.mock('$app/paths', () => ({
	base: '',
	assets: '',
	resolve: (path: string) => path
}));
