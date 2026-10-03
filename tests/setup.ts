import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Global mock for matchMedia in JSDOM environment
if (typeof window !== 'undefined') {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	});
}

// Global SvelteKit navigation & environment mocks
vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(),
	beforeNavigate: vi.fn(),
	disableScrollHandling: vi.fn(),
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	refreshAll: vi.fn(),
	preloadCode: vi.fn(),
	preloadData: vi.fn(),
	pushState: vi.fn(),
	replaceState: vi.fn()
}));

vi.mock('$app/paths', () => ({
	asset: (path: string) => path,
	resolve: (path: string) => path
}));

vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));

vi.mock('$app/env', () => ({
	browser: true,
	dev: true,
	building: false,
	version: '3.0.0'
}));

vi.mock('$app/environment', () => ({
	browser: true,
	dev: true,
	building: false,
	version: '3.0.0'
}));
