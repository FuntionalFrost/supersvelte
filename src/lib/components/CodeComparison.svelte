<!-- src/lib/components/CodeComparison.svelte -->
<script lang="ts">
	import {
		competitorExamples,
		superSvelteExample,
		type CompetitorKey
	} from '#lib/config/code-comparisons.js';
	import { Check, CodeXml, Copy, FileCode, Layers, Zap } from '@lucide/svelte';
	import { CodeBlock } from 'yaxa-svelte';

	let activeCompetitor = $state<CompetitorKey>('nextjs');
	let copiedSnippet = $state<string | null>(null);

	let currentCompetitor = $derived(competitorExamples[activeCompetitor]);

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
		<div class="mb-8 flex justify-center">
			<div
				class="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-xs"
			>
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
						class="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
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
						<CodeBlock
							code={superSvelteExample.server}
							language="typescript"
							themeMode="dark"
							class="my-0! rounded-lg border-border/80"
						/>
					</div>

					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-emerald-400/90"
						>
							<span class="size-1.5 rounded-full bg-emerald-400"></span>
							2. Client RPC Call
						</div>
						<CodeBlock
							code={superSvelteExample.client}
							language="svelte"
							themeMode="dark"
							class="my-0! rounded-lg border-border/80"
						/>
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
						class="rounded-md border border-border bg-background p-1.5 text-muted-foreground transition hover:text-foreground active:scale-95"
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
						<CodeBlock
							code={currentCompetitor.server}
							language="typescript"
							themeMode="dark"
							class="my-0! rounded-lg border-border/60"
						/>
					</div>

					<div class="space-y-1.5">
						<div
							class="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-muted-foreground"
						>
							<span class="size-1.5 rounded-full bg-muted-foreground"></span>
							Client Consumption
						</div>
						<CodeBlock
							code={currentCompetitor.client}
							language="typescript"
							themeMode="dark"
							class="my-0! rounded-lg border-border/60"
						/>
					</div>
				</div>

				<div
					class="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-2.5 text-[10px] text-muted-foreground"
				>
					<span class="inline-flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-muted-foreground"></span>
						Framework-specific patterns
					</span>
					<span class="inline-flex items-center gap-1">
						<span class="size-1.5 rounded-full bg-muted-foreground"></span>
						Manual client contracts
					</span>
				</div>
			</div>
		</div>
	</div>
</section>
