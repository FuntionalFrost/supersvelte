<!-- src/lib/components/SuperSvelteVsOthers.svelte -->
<script lang="ts">
	import { Zap } from '@lucide/svelte';

	let selectedTab = $state<'performance' | 'codegen' | 'reactivity'>('performance');

	const metrics = [
		{
			framework: 'SuperSvelte',
			badge: 'Svelte 5 Runes + Hono RPC',
			bundleSize: '12 kB',
			bundleWidth: '12%',
			coldStart: '< 10 ms',
			coldWidth: '8%',
			codegenTime: '0s (Zero-Codegen)',
			isWinner: true
		},
		{
			framework: 'Supastarter (SvelteKit)',
			badge: 'Svelte 3/4 Stores + Melt UI',
			bundleSize: '68 kB',
			bundleWidth: '48%',
			coldStart: '140 ms',
			coldWidth: '65%',
			codegenTime: '8s CLI Compile',
			isWinner: false
		},
		{
			framework: 'Epic Stack',
			badge: 'Remix + React 18 + Prisma',
			bundleSize: '145 kB',
			bundleWidth: '100%',
			coldStart: '180 ms',
			coldWidth: '100%',
			codegenTime: '14s Typegen',
			isWinner: false
		}
	];
</script>

<div
	class="mx-auto max-w-4xl space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
>
	<!-- Tab Switcher -->
	<div class="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase"
			>
				<Zap class="size-4" />
				<span>Architectural Benchmark</span>
			</span>
			<h3 class="text-xl font-extrabold tracking-tight text-foreground">
				SuperSvelte vs. Industry Starters
			</h3>
		</div>

		<div class="flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
			<button
				onclick={() => (selectedTab = 'performance')}
				class="rounded-md px-3 py-1.5 font-semibold transition {selectedTab === 'performance'
					? 'border border-border/80 bg-background text-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				Bundle & Latency
			</button>
			<button
				onclick={() => (selectedTab = 'codegen')}
				class="rounded-md px-3 py-1.5 font-semibold transition {selectedTab === 'codegen'
					? 'border border-border/80 bg-background text-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				0-Codegen RPC
			</button>
		</div>
	</div>

	<!-- Visual Benchmark Bars -->
	{#if selectedTab === 'performance'}
		<div class="space-y-6">
			<div class="space-y-2">
				<h4 class="text-xs font-bold text-muted-foreground uppercase">
					JS Client Bundle Size (Lower is better)
				</h4>
				<div class="space-y-3">
					{#each metrics as m (m.framework)}
						<div class="space-y-1">
							<div class="flex justify-between text-xs font-semibold">
								<span
									class={m.isWinner
										? 'font-bold text-cyan-500 dark:text-cyan-400'
										: 'text-foreground'}>{m.framework}</span
								>
								<span class="font-mono">{m.bundleSize}</span>
							</div>
							<div class="h-3 w-full overflow-hidden rounded-full bg-muted/60">
								<div
									class="h-full transition-all duration-500 {m.isWinner
										? 'bg-cyan-500 dark:bg-cyan-400'
										: 'bg-muted-foreground/40'}"
									style="width: {m.bundleWidth};"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="space-y-2 border-t border-border/60 pt-4">
				<h4 class="text-xs font-bold text-muted-foreground uppercase">
					Edge Cold-Start Latency (Lower is better)
				</h4>
				<div class="space-y-3">
					{#each metrics as m (m.framework)}
						<div class="space-y-1">
							<div class="flex justify-between text-xs font-semibold">
								<span class={m.isWinner ? 'font-bold text-emerald-500' : 'text-foreground'}
									>{m.framework}</span
								>
								<span class="font-mono">{m.coldStart}</span>
							</div>
							<div class="h-3 w-full overflow-hidden rounded-full bg-muted/60">
								<div
									class="h-full transition-all duration-500 {m.isWinner
										? 'bg-emerald-500'
										: 'bg-muted-foreground/40'}"
									style="width: {m.coldWidth};"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Codegen Feature Comparison -->
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
				<div class="text-xs font-bold text-primary">SuperSvelte</div>
				<div class="text-lg font-black text-foreground">Hono RPC (hc)</div>
				<p class="text-xs text-muted-foreground">
					Instant TypeScript inference from OpenAPI routes directly into Svelte 5 Runes. Zero build
					watchers or CLI steps required.
				</p>
			</div>

			<div class="space-y-2 rounded-xl border border-border bg-card p-4">
				<div class="text-xs font-bold text-muted-foreground">Supastarter</div>
				<div class="text-lg font-black text-foreground">tRPC / Actions</div>
				<p class="text-xs text-muted-foreground">
					Requires custom router definitions and manual type exports.
				</p>
			</div>

			<div class="space-y-2 rounded-xl border border-border bg-card p-4">
				<div class="text-xs font-bold text-muted-foreground">Epic Stack</div>
				<div class="text-lg font-black text-foreground">Remix Conform</div>
				<p class="text-xs text-muted-foreground">
					Relies on heavy React form schemas, manual Zod parsing in route actions, and CLI typegen
					watchers.
				</p>
			</div>
		</div>
	{/if}
</div>
