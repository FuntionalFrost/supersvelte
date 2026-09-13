import { describe, expect, it } from 'vitest';
import { matrices } from './comparison';

describe('Comparison Configuration Matrices', () => {
	it('has all 3 comparison modes defined', () => {
		expect(matrices['saas-starters']).toBeDefined();
		expect(matrices['ts-frameworks']).toBeDefined();
		expect(matrices['monoliths']).toBeDefined();
	});

	it('includes SuperSvelte as primary column in each mode', () => {
		for (const mode of ['saas-starters', 'ts-frameworks', 'monoliths'] as const) {
			const matrix = matrices[mode];
			const primaryCol = matrix.columns.find((c) => c.isPrimary);
			expect(primaryCol).toBeDefined();
			expect(primaryCol?.key).toBe('superSvelte');
			expect(matrix.rows.length).toBeGreaterThan(0);
		}
	});
});
