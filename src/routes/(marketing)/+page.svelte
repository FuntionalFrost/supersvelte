<!-- src/routes/(marketing)/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { matrices, type Mode } from '$lib/config/comparison';
	import {
		ArrowRight,
		Check,
		Cloud,
		Cpu,
		Database,
		Layers,
		Mail,
		Rocket,
		ShieldCheck,
		Sparkles,
		Terminal,
		Zap
	} from '@lucide/svelte';

	// Default directly to TS Batteries-Included Mode
	let mode = $state<Mode>('ts-batteries');
	let currentMatrix = $derived(matrices[mode]);
</script>

<div
	class="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<!-- 1. HERO SECTION -->
	<header class="relative overflow-hidden border-b border-border/40 py-20 sm:py-28">
		<div
			class="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"
		></div>

		<div class="relative container mx-auto max-w-5xl px-4 text-center">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs"
			>
				<Sparkles class="size-3.5" />
				<span>Super Svelte • Svelte 5 + Hono RPC + Neon</span>
			</div>

			<h1 class="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl">
				Super <span
					class="bg-linear-to-r from-primary via-emerald-400 to-cyan-500 bg-clip-text text-transparent"
					>Svelte</span
				>
			</h1>

			<p class="mx-auto mt-4 max-w-xl text-lg font-medium text-foreground sm:text-xl">
				The Batteries-Included Edge TS Framework
			</p>

			<p class="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
				Stop assembling your stack from 15 npm packages. Super Svelte ships Auth, Neon DB, Redis
				SSE, Uploads, and Resend out-of-the-box with sub-10ms edge cold starts.
			</p>

			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href={resolve('/test')}
					class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/25"
				>
					<Rocket class="size-4" />
					<span>Launch Sandbox Demo</span>
				</a>
				<a
					href="https://github.com"
					target="_blank"
					class="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:bg-accent"
				>
					<Terminal class="size-4" />
					<span>Architecture Specs</span>
				</a>
			</div>
		</div>
	</header>

	<!-- 2. TECH STACK HIGHLIGHTS -->
	<section class="border-b border-border/40 bg-muted/30 py-16">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<Zap class="size-6 text-amber-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Svelte 5</span>
					<span class="text-[11px] text-muted-foreground">Fine-grained Runes</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<Cpu class="size-6 text-cyan-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Hono RPC</span>
					<span class="text-[11px] text-muted-foreground">0-Codegen API</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<Database class="size-6 text-emerald-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Drizzle + Neon</span>
					<span class="text-[11px] text-muted-foreground">Serverless Postgres</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<ShieldCheck class="size-6 text-indigo-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Better Auth</span>
					<span class="text-[11px] text-muted-foreground">Sessions & Social</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<Cloud class="size-6 text-red-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Upstash Redis</span>
					<span class="text-[11px] text-muted-foreground">Cache & SSE Queue</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<Mail class="size-6 text-pink-400 transition-transform group-hover:scale-110" />
					<span class="text-xs font-bold">Resend & UT</span>
					<span class="text-[11px] text-muted-foreground">Mail & Storage</span>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. VALUE PROPOSITIONS -->
	<section class="border-b border-border/40 py-20">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="mb-12 text-center">
				<h2 class="text-2xl font-bold sm:text-3xl">Why Super Svelte?</h2>
				<p class="mt-2 text-sm text-muted-foreground">
					The productivity of Laravel with the sub-millisecond speed of Svelte 5 and Serverless
					Edge.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<div
					class="group space-y-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
				>
					<div
						class="inline-flex rounded-lg bg-primary/10 p-2 text-primary transition-transform group-hover:scale-110"
					>
						<Zap class="size-5" />
					</div>
					<h3 class="text-base font-semibold">Zero Virtual DOM Overhead</h3>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Powered by Svelte 5 Runes (<code class="font-mono text-primary">$state</code>,
						<code class="font-mono text-primary">$effect</code>). Updates compile down to surgical
						DOM mutations with zero virtual DOM diffing cascades.
					</p>
				</div>

				<div
					class="group space-y-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
				>
					<div
						class="inline-flex rounded-lg bg-primary/10 p-2 text-primary transition-transform group-hover:scale-110"
					>
						<Cpu class="size-5" />
					</div>
					<h3 class="text-base font-semibold">0-Codegen Hono RPC</h3>
					<p class="text-muted-relaxed text-xs leading-relaxed">
						Call backend routes with pure TypeScript type inference. No GraphQL codegen, no custom <code
							class="font-mono text-primary">.wasp</code
						> DSL compilers, and zero starter-kit template bloat.
					</p>
				</div>

				<div
					class="group space-y-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
				>
					<div
						class="inline-flex rounded-lg bg-primary/10 p-2 text-primary transition-transform group-hover:scale-110"
					>
						<Layers class="size-5" />
					</div>
					<h3 class="text-base font-semibold">Native Edge Serverless</h3>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Pre-configured with Neon Postgres, Upstash Redis, Better Auth, UploadThing, and
						Resend—deploying instantly to Cloudflare or Vercel Edge with &lt;10ms cold starts.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- 4. FEATURED COMPARISON MATRIX -->
	<section class="py-24">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
				>
					<Sparkles class="size-3.5" />
					<span>Direct Competitor Matrix</span>
				</div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">How Super Svelte Compares</h2>
				<p class="mt-2 text-sm text-muted-foreground">
					See how Super Svelte stacks up directly against other batteries-included TypeScript
					solutions and classic monoliths.
				</p>

				<!-- 2-Way Toggle -->
				<div
					class="mt-8 inline-flex items-center justify-center rounded-lg border border-border bg-card p-1 shadow-sm"
				>
					<button
						onclick={() => (mode = 'ts-batteries')}
						class="relative rounded-md px-4 py-2 text-xs font-semibold transition-all duration-200 {mode ===
						'ts-batteries'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						<span>vs. Full-Stack TS Batteries (AdonisJS, Redwood, Wasp, Epic Stack)</span>
						{#if mode === 'ts-batteries'}
							<span class="absolute -top-1 -right-1 flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
							</span>
						{/if}
					</button>

					<button
						onclick={() => (mode = 'monoliths')}
						class="rounded-md px-4 py-2 text-xs font-semibold transition-all duration-200 {mode ===
						'monoliths'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. Classic Monoliths (Laravel, Rails, Django, .NET)
					</button>
				</div>
			</div>

			<!-- Unified Table (DRY) -->
			<div class="mt-12 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
				<table class="w-full text-left text-xs">
					<thead class="border-b border-border bg-muted/50 text-muted-foreground">
						<tr>
							{#each currentMatrix.columns as col (col.key)}
								{#if col.isPrimary}
									<th
										class="border-x border-primary/20 bg-primary/10 p-4 font-bold text-primary {col.minWidth ??
											''}"
									>
										{col.label}
									</th>
								{:else if col.key === 'feature'}
									<th class="p-4 font-semibold">{col.label}</th>
								{:else}
									<th class="p-4 font-semibold {col.minWidth ?? ''}">{col.label}</th>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each currentMatrix.rows as row (row.feature)}
							<tr class="transition-colors duration-150 hover:bg-muted/40">
								{#each currentMatrix.columns as col (col.key)}
									{#if col.key === 'feature'}
										<td class="p-4 font-semibold whitespace-nowrap text-foreground"
											>{row[col.key]}</td
										>
									{:else if col.isPrimary}
										<td
											class="border-x border-primary/20 bg-primary/5 p-4 font-semibold text-primary"
										>
											<div class="flex items-center gap-1.5">
												<Check class="size-4 shrink-0 text-emerald-500" />
												<span>{row[col.key]}</span>
											</div>
										</td>
									{:else}
										<td class="p-4 text-muted-foreground">{row[col.key]}</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- 5. FOOTER CTA -->
	<footer class="border-t border-border/40 bg-card py-16 text-center">
		<div class="container mx-auto max-w-4xl px-4">
			<h2 class="text-2xl font-bold sm:text-3xl">Ready to experience Super Svelte?</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Explore the live interactive diagnostic dashboard to test session auth, Hono RPC endpoints,
				SSE real-time events, and Upstash Redis rate limiting.
			</p>
			<div class="mt-6">
				<a
					href={resolve('/test')}
					class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/25"
				>
					<Rocket class="size-4" />
					<span>Explore Super Svelte Sandbox</span>
					<ArrowRight class="size-4" />
				</a>
			</div>
		</div>
	</footer>
</div>
