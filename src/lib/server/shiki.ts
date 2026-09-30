// src/lib/server/shiki.ts
import { createHighlighter, type Highlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			engine: createJavaScriptRegexEngine(),
			themes: ['github-dark'],
			langs: [
				'typescript',
				'javascript',
				'svelte',
				'bash',
				'html',
				'css',
				'json',
				'sql',
				'markdown',
				'yaml'
			]
		});
	}
	return highlighterPromise;
}

const langAliases: Record<string, string> = {
	ts: 'typescript',
	js: 'javascript',
	sh: 'bash',
	shell: 'bash',
	zsh: 'bash',
	yml: 'yaml',
	env: 'bash'
};

export async function highlightCode(code: string, lang: string = 'typescript'): Promise<string> {
	const highlighter = await getHighlighter();
	const normalizedLang = lang.toLowerCase().trim();
	const targetLang = langAliases[normalizedLang] || normalizedLang;

	try {
		return highlighter.codeToHtml(code.trim(), {
			lang: targetLang,
			theme: 'github-dark'
		});
	} catch {
		return `<pre class="shiki github-dark"><code>${code}</code></pre>`;
	}
}
