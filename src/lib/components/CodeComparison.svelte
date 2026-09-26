<!-- src/lib/components/CodeComparison.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import {
		competitorExamples,
		superSvelteExample,
		type CompetitorKey
	} from '$lib/config/code-comparisons';
	import { Check, CodeXml, Copy, FileCode, Layers, ShieldCheck, Zap } from '@lucide/svelte';
	import { createHighlighter } from 'shiki';
	import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

	let activeCompetitor = $state<CompetitorKey>('nextjs');
	let copiedSnippet = $state<string | null>(null);

	// Pre-highlighted HTML cache
	let superSvelteServerHtml = $state('');
	let superSvelteClientHtml = $state('');

	let competitorHtmlMap = $state<Record<CompetitorKey, { server: string; client: string }>>({
		nextjs: { server: '', client: '' },
		nestjs: { server: '', client: '' }
	});

	let isReady = $state(false);

	let currentCompetitor = $derived(competitorExamples[activeCompetitor]);
	// ⚡ Instant 0ms lookup derived directly from state cache
	let currentCompetitorHtml = $derived(competitorHtmlMap[activeCompetitor]);

	// Initialize Shiki and pre-highlight ALL snippets in a single fast pass (~2ms)
	$effect(() => {
		if (!browser) return;

		let isMounted = true;

		createHighlighter({
			engine: createJavaScriptRegexEngine(),
			themes: ['github-dark'],
			langs: ['svelte', 'typescript', 'javascript', 'html', 'css']
		}).then((highlighter) => {
			if (!isMounted) return;

			// 1. Highlight SuperSvelte
			superSvelteServerHtml = highlighter.codeToHtml(superSvelteExample.server.trim(), {
				lang: 'typescript',
				theme: 'github-dark'
			});
			superSvelteClientHtml = highlighter.codeToHtml(superSvelteExample.client.trim(), {
				lang: 'svelte',
				theme: 'github-dark'
			});

			// 2. Pre-highlight Next.js & NestJS upfront
			const nextjsServer = highlighter.codeToHtml(competitorExamples.nextjs.server.trim(), {
				lang: 'typescript',
				theme: 'github-dark'
			});
			const nextjsClient = highlighter.codeToHtml(competitorExamples.nextjs.client.trim(), {
				lang: 'typescript',
				theme: 'github-dark'
			});

			const nestjsServer = highlighter.codeToHtml(competitorExamples.nestjs.server.trim(), {
				lang: 'typescript',
				theme: 'github-dark'
			});
			const nestjsClient = highlighter.codeToHtml(competitorExamples.nestjs.client.trim(), {
				lang: 'typescript',
				theme: 'github-dark'
			});

			competitorHtmlMap = {
				nextjs: { server: nextjsServer, client: nextjsClient },
				nestjs: { server: nestjsServer, client: nestjsClient }
			};

			isReady = true;
		});

		return () => {
			isMounted = false;
		};
	});

	function copyCode(key: string, text: string) {
		navigator.clipboard.writeText(text.trim());
		copiedSnippet = key;
		setTimeout(() => (copiedSnippet = null), 2000);
	}
</script>

<section class="border-y border-border/50 bg-background py-16 text-foreground">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Section Header -->
		<div class="mb-10 space-y-3 text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
			>
				<CodeXml class="size-3.5" />
				<span>Zero-Codegen Developer Experience</span>
			</div>
			<h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">See the DX Difference</h2>
			<p class="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
				Compare Super Svelte's OpenAPI 3.1 & Hono RPC engine against traditional TypeScript backend
				patterns.
			</p>
		</div>

		<!-- Competitor Switcher Tabs -->
		<div class="mb-6 flex justify-center">
			<div class="inline-flex rounded-xl border border-border bg-card p-1 shadow-xs">
				<button
					onclick={() => (activeCompetitor = 'nextjs')}
					class="flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all {activeCompetitor ===
					'nextjs'
						? 'border border-border/80 bg-background text-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					<Layers class="size-3.5" />
					<span>{competitorExamples.nextjs.label}</span>
				</button>
				<button
					onclick={() => (activeCompetitor = 'nestjs')}
					class="flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all {activeCompetitor ===
					'nestjs'
						? 'border border-border/80 bg-background text-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					<FileCode class="size-3.5" />
					<span>{competitorExamples.nestjs.label}</span>
				</button>
			</div>
		</div>

		<!-- Side-by-Side Code Grid -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- LEFT COLUMN: SUPER SVELTE -->
			<div
				class="flex flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-card shadow-xs"
			>
				<div
					class="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
				>
					<div>
						<h3 class="flex items-center gap-2 text-xs font-bold text-emerald-400">
							<Zap class="size-3.5" />
							{superSvelteExample.title}
						</h3>
						<p class="mt-0.5 text-[10px] text-muted-foreground">
							{superSvelteExample.subtitle}
						</p>
					</div>
					<button
						onclick={() =>
							copyCode(
								'superSvelte',
								superSvelteExample.server + '\n\n' + superSvelteExample.client
							)}
						class="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 transition hover:bg-emerald-500/20"
						title="Copy Super Svelte Snippet"
					>
						{#if copiedSnippet === 'superSvelte'}
							<Check class="size-3.5 text-emerald-400" />
						{:else}
							<Copy class="size-3.5" />
						{/if}
					</button>
				</div>

				<div class="flex flex-1 flex-col justify-between space-y-3 bg-muted/30 p-4">
					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-emerald-400/90"
						>
							<span class="size-1.5 rounded-full bg-emerald-400"></span>
							1. OpenAPI Route Definition
						</div>
						<div class="overflow-hidden rounded-lg border border-border/80 bg-[#0d1117]">
							{#if isReady && superSvelteServerHtml}
								{@html superSvelteServerHtml}
							{:else}
								<div class="animate-pulse space-y-2 bg-[#0d1117] p-3">
									<div class="h-2.5 w-3/4 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-1/2 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-5/6 rounded bg-slate-800/60"></div>
								</div>
							{/if}
						</div>
					</div>

					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-emerald-400/90"
						>
							<span class="size-1.5 rounded-full bg-emerald-400"></span>
							2. Client RPC Call
						</div>
						<div class="overflow-hidden rounded-lg border border-border/80 bg-[#0d1117]">
							{#if isReady && superSvelteClientHtml}
								{@html superSvelteClientHtml}
							{:else}
								<div class="animate-pulse space-y-2 bg-[#0d1117] p-3">
									<div class="h-2.5 w-3/4 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-1/2 rounded bg-slate-800/60"></div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-2.5 text-[10px]">
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> 0 Build Steps
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> Auto OpenAPI 3.1
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> Interactive Swagger UI
					</span>
				</div>
			</div>

			<!-- RIGHT COLUMN: COMPETITOR -->
			<div class="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
				<div class="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
					<div>
						<h3 class="flex items-center gap-2 text-xs font-bold text-foreground">
							<FileCode class="size-3.5 text-muted-foreground" />
							{currentCompetitor.title}
						</h3>
						<p class="mt-0.5 text-[10px] text-muted-foreground">
							{currentCompetitor.subtitle}
						</p>
					</div>
					<button
						onclick={() =>
							copyCode(
								activeCompetitor,
								currentCompetitor.server + '\n\n' + currentCompetitor.client
							)}
						class="rounded-md border border-border bg-background p-1.5 text-muted-foreground transition hover:text-foreground"
						title="Copy Competitor Snippet"
					>
						{#if copiedSnippet === activeCompetitor}
							<Check class="size-3.5 text-emerald-400" />
						{:else}
							<Copy class="size-3.5" />
						{/if}
					</button>
				</div>

				<div class="flex flex-1 flex-col justify-between space-y-3 bg-muted/20 p-4">
					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-muted-foreground"
						>
							<span class="size-1.5 rounded-full bg-muted-foreground"></span>
							Server Implementation
						</div>
						<div class="overflow-hidden rounded-lg border border-border/60 bg-[#0d1117]">
							{#if isReady && currentCompetitorHtml.server}
								{@html currentCompetitorHtml.server}
							{:else}
								<div class="animate-pulse space-y-2 bg-[#0d1117] p-3">
									<div class="h-2.5 w-3/4 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-1/2 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-5/6 rounded bg-slate-800/60"></div>
								</div>
							{/if}
						</div>
					</div>

					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-muted-foreground"
						>
							<span class="size-1.5 rounded-full bg-muted-foreground"></span>
							Client Consumption
						</div>
						<div class="overflow-hidden rounded-lg border border-border/60 bg-[#0d1117]">
							{#if isReady && currentCompetitorHtml.client}
								{@html currentCompetitorHtml.client}
							{:else}
								<div class="animate-pulse space-y-2 bg-[#0d1117] p-3">
									<div class="h-2.5 w-3/4 rounded bg-slate-800/60"></div>
									<div class="h-2.5 w-1/2 rounded bg-slate-800/60"></div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div
					class="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-2.5 text-[10px] text-muted-foreground"
				>
					<span class="inline-flex items-center gap-1 font-medium text-amber-500">
						⚠️ Manual Type Mapping
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-amber-500">
						⚠️ Extra Boilerplate Files
					</span>
				</div>
			</div>
		</div>

		<!-- Summary Callout Banner -->
		<div
			class="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 md:flex-row"
		>
			<div class="flex items-center gap-3">
				<ShieldCheck class="size-6 shrink-0 text-primary" />
				<div class="space-y-0.5">
					<h4 class="text-xs font-bold">Why OpenAPI Hono RPC Beats Codegen Toolchains</h4>
					<p class="text-[11px] text-muted-foreground">
						TypeScript infers route contracts at edit time, while generating standard OpenAPI 3.1
						JSON schemas & Swagger UI docs at <code>/api/docs</code>. Zero build steps, zero codegen
						binaries.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(pre.shiki) {
		margin: 0 !important;
		padding: 0.65rem 0.85rem !important;
		box-sizing: border-box !important;
		overflow-x: auto !important;
		background-color: transparent !important;
		font-size: 11px !important;
		line-height: 1.45 !important;
	}

	:global(pre.shiki code) {
		display: block !important;
		min-height: 100% !important;
	}
</style>
