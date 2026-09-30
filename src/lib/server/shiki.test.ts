// src/lib/server/shiki.test.ts
import { describe, expect, it } from 'vitest';
import { highlightCode } from './shiki';

describe('shiki server highlighter', () => {
	it('highlights TypeScript code with github-dark theme', async () => {
		const html = await highlightCode('const greeting: string = "hello";', 'typescript');
		expect(html).toContain('<pre class="shiki github-dark"');
		expect(html).toContain('greeting');
	});

	it('highlights Svelte code properly', async () => {
		const html = await highlightCode(
			'<script lang="ts">\nlet count = $state(0);\n</script>',
			'svelte'
		);
		expect(html).toContain('<pre class="shiki github-dark"');
		expect(html).toContain('count');
	});

	it('highlights Bash commands properly', async () => {
		const html = await highlightCode('pnpm install\npnpm dev', 'bash');
		expect(html).toContain('<pre class="shiki github-dark"');
		expect(html).toContain('pnpm');
	});

	it('maps aliases like sh and ts correctly', async () => {
		const html = await highlightCode('npm test', 'sh');
		expect(html).toContain('<pre class="shiki github-dark"');
		expect(html).toContain('npm');
	});

	it('falls back safely for unknown languages without crashing', async () => {
		const html = await highlightCode('unknown syntax', 'nonexistent_lang');
		expect(html).toContain('<pre class="shiki github-dark"');
		expect(html).toContain('unknown syntax');
	});
});
