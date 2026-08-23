<!-- src/routes/(marketing)/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { PUBLIC_PADDLE_PRO_PRICE_ID, PUBLIC_PADDLE_STANDARD_PRICE_ID } from '$env/static/public';
	import CodeComparison from '$lib/components/CodeComparison.svelte';
	import PaddleCheckout from '$lib/components/PaddleCheckout.svelte';
	import SuperSvelteVsOthers from '$lib/components/SuperSvelteVsOthers.svelte';
	import { matrices, type Mode } from '$lib/config/comparison';
	import {
		Check,
		CircleQuestionMark,
		Cloud,
		Cpu,
		Database,
		Mail,
		Rocket,
		ShieldCheck,
		Sparkles,
		Terminal,
		Zap
	} from '@lucide/svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let mode = $state<Mode>('saas-starters');
	let currentMatrix = $derived(matrices[mode]);

	// Safe accessor helper to satisfy TypeScript dynamic key indexing
	function getCellValue(row: Record<string, unknown>, key: string): string {
		return String(row[key] ?? '');
	}
</script>

<MetaTags
	title="SuperSvelte — Ship Svelte 5 SaaS Apps at Light Speed"
	description="The ultimate Svelte 5 production boilerplate. Features Better Auth, Drizzle ORM, Neon Postgres, Upstash Redis, UploadThing, and 0-codegen Hono Zod RPC."
	canonical="https://supersvelte.netlify.app"
/>

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
				<span>SuperSvelte • Svelte 5 + Hono RPC + Neon</span>
			</div>

			<h1 class="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl">
				Super<span
					class="bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent"
					>Svelte</span
				>
			</h1>

			<p class="mx-auto mt-4 max-w-xl text-lg font-medium text-foreground sm:text-xl">
				The Batteries-Included Edge TS Framework
			</p>

			<p class="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
				Stop assembling your stack from 15 npm packages. SuperSvelte ships Auth, Neon DB, Redis SSE,
				OpenAPI 3.1 Hono RPC, Uploads, and Resend out-of-the-box with sub-10ms edge cold starts.
			</p>

			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="#pricing"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
				>
					<Rocket class="size-4" />
					<span>Get SuperSvelte!</span>
				</a>
				<a
					href={resolve('/test')}
					class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition hover:bg-accent"
				>
					<Terminal class="size-4" />
					<span>Live Interactive Sandbox</span>
				</a>
			</div>
		</div>
	</header>

	<!-- 2. TECH STACK HIGHLIGHTS -->
	<section id="features" class="border-b border-border/40 bg-muted/30 py-16">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50"
				>
					<Zap class="size-6 text-amber-400" />
					<span class="text-xs font-bold">Svelte 5</span>
					<span class="text-[11px] text-muted-foreground">Fine-grained Runes</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
				>
					<Cpu class="size-6 text-cyan-400" />
					<span class="text-xs font-bold">Hono Zod RPC</span>
					<span class="text-[11px] text-muted-foreground">Auto OpenAPI 3.1</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50"
				>
					<Database class="size-6 text-emerald-400" />
					<span class="text-xs font-bold">Drizzle + Neon</span>
					<span class="text-[11px] text-muted-foreground">Serverless Postgres</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50"
				>
					<ShieldCheck class="size-6 text-indigo-400" />
					<span class="text-xs font-bold">Better Auth</span>
					<span class="text-[11px] text-muted-foreground">Sessions & Social</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-400/50"
				>
					<Cloud class="size-6 text-red-400" />
					<span class="text-xs font-bold">Upstash Redis</span>
					<span class="text-[11px] text-muted-foreground">Cache & SSE Queue</span>
				</div>
				<div
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/50"
				>
					<Mail class="size-6 text-pink-400" />
					<span class="text-xs font-bold">Resend & UT</span>
					<span class="text-[11px] text-muted-foreground">Mail & Storage</span>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. FEATURED COMPARISON MATRIX -->
	<section id="comparison" class="py-24">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
				>
					<Sparkles class="size-3.5" />
					<span>Direct Competitor Matrix</span>
				</div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">How SuperSvelte Compares</h2>
				<p class="mt-2 text-sm text-muted-foreground">
					See how SuperSvelte stacks up directly against paid SaaS boilerplates, TypeScript
					toolkits, and classic monoliths.
				</p>

				<!-- 3-Way Mode Toggle -->
				<div
					class="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs"
				>
					<button
						onclick={() => (mode = 'saas-starters')}
						class="rounded-lg px-4 py-2 text-xs font-semibold transition-all {mode ===
						'saas-starters'
							? 'bg-primary text-primary-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. SaaS Starters (Supastarter, Makerkit, Epic Stack)
					</button>

					<button
						onclick={() => (mode = 'ts-frameworks')}
						class="rounded-lg px-4 py-2 text-xs font-semibold transition-all {mode ===
						'ts-frameworks'
							? 'bg-primary text-primary-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. TS Frameworks (AdonisJS, Redwood, Wasp)
					</button>

					<button
						onclick={() => (mode = 'monoliths')}
						class="rounded-lg px-4 py-2 text-xs font-semibold transition-all {mode === 'monoliths'
							? 'bg-primary text-primary-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. Backend Monoliths (Laravel, Rails, Django, .NET)
					</button>
				</div>
			</div>

			<!-- Unified Matrix Table -->
			<div class="mt-12 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
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
							<tr class="transition-colors hover:bg-muted/40">
								{#each currentMatrix.columns as col (col.key)}
									{#if col.key === 'feature'}
										<td class="p-4 font-semibold whitespace-nowrap text-foreground"
											>{getCellValue(row, col.key)}</td
										>
									{:else if col.isPrimary}
										<td
											class="border-x border-primary/20 bg-primary/5 p-4 font-semibold text-primary"
										>
											<div class="flex items-center gap-1.5">
												<Check class="size-4 shrink-0 text-emerald-500" />
												<span>{getCellValue(row, col.key)}</span>
											</div>
										</td>
									{:else}
										<td class="p-4 text-muted-foreground">{getCellValue(row, col.key)}</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- 4. CODE COMPARISON SHOWCASE -->
	<CodeComparison />

	<!-- 5. PRICING SECTION -->
	<section id="pricing" class="border-t border-border/40 bg-muted/20 py-24">
		<div class="container mx-auto max-w-5xl px-4">
			<div class="text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
				>
					<Zap class="size-3.5" />
					<span>One-Time Payment • Lifetime Access</span>
				</div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Launch Your SaaS This Weekend</h2>
				<p class="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
					Save 80+ hours of custom integration work. Get full source code access, automated GitHub
					repo invites, and lifetime updates.
				</p>
			</div>

			<div class="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Starter Tier -->
				<div
					class="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-xs"
				>
					<div>
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-bold">Standard License</h3>
							<span
								class="rounded-md border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] font-bold"
								>1 Developer</span
							>
						</div>
						<div class="mt-4 flex items-baseline gap-1">
							<span class="text-4xl font-extrabold">€99</span>
							<span class="text-xs text-muted-foreground">/ one-time</span>
						</div>
						<p class="mt-2 text-xs text-muted-foreground">
							Perfect for solopreneurs launching a single product.
						</p>

						<ul class="mt-6 space-y-3 text-xs font-medium text-foreground/90">
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Full Svelte 5 + Hono Source Code
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Better Auth (Session + Social Logins)
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Drizzle ORM + Neon Serverless Postgres
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Upstash Redis Caching & Rate Limiting
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> UploadThing File Uploads & Resend Mail
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Private GitHub Repository Access
							</li>
						</ul>
					</div>

					<div class="mt-8">
						<PaddleCheckout
							priceId={PUBLIC_PADDLE_STANDARD_PRICE_ID}
							buttonText="Get Standard License"
						/>
					</div>
				</div>

				<!-- Pro Tier -->
				<div
					class="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-card p-8 shadow-xl"
				>
					<div
						class="absolute -top-3.5 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase"
					>
						Most Popular
					</div>
					<div>
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-bold text-primary">Unlimited Pro License</h3>
							<span
								class="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary"
								>Unlimited Projects</span
							>
						</div>
						<div class="mt-4 flex items-baseline gap-1">
							<span class="text-4xl font-extrabold">€199</span>
							<span class="text-xs text-muted-foreground">/ one-time</span>
						</div>
						<p class="mt-2 text-xs text-muted-foreground">
							For agencies, serial founders, and team workflows.
						</p>

						<ul class="mt-6 space-y-3 text-xs font-medium text-foreground/90">
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Everything in Standard License
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Unlimited Commercial Projects & Clients
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Multi-Tenant Team Workspace Module
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Priority GitHub Issue Support
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Future SuperSvelte Feature Addons
							</li>
						</ul>
					</div>

					<div class="mt-8">
						<PaddleCheckout priceId={PUBLIC_PADDLE_PRO_PRICE_ID} buttonText="Get Unlimited Pro" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="border-t border-border/60 bg-muted/20 py-20">
		<div class="container mx-auto px-4">
			<SuperSvelteVsOthers />
		</div>
	</section>

	<!-- 6. DEVELOPER FAQ SECTION -->
	<section id="faq" class="border-t border-border/40 py-20">
		<div class="container mx-auto max-w-4xl px-4">
			<div class="mb-12 text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
				>
					<CircleQuestionMark class="size-3.5" />
					<span>Got Questions?</span>
				</div>
				<h2 class="text-3xl font-bold">Frequently Asked Questions</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 text-xs md:grid-cols-2">
				<div class="space-y-2 rounded-xl border border-border bg-card p-5">
					<h3 class="text-sm font-bold text-foreground">What happens after I complete payment?</h3>
					<p class="leading-relaxed text-muted-foreground">
						You receive an automated GitHub invite to the private SuperSvelte repository, along with
						a direct ZIP download link and setup documentation.
					</p>
				</div>

				<div class="space-y-2 rounded-xl border border-border bg-card p-5">
					<h3 class="text-sm font-bold text-foreground">How is EU VAT handled?</h3>
					<p class="leading-relaxed text-muted-foreground">
						Our checkout automatically calculates local EU VAT at purchase and handles B2B
						reverse-charge exemptions with valid EU VAT IDs. Tax invoices are emailed immediately.
					</p>
				</div>

				<div class="space-y-2 rounded-xl border border-border bg-card p-5">
					<h3 class="text-sm font-bold text-foreground">Can I use this for client projects?</h3>
					<p class="leading-relaxed text-muted-foreground">
						Yes! The Standard license covers a single client deliverable or personal SaaS, while the
						Unlimited Pro license covers unlimited client projects.
					</p>
				</div>

				<div class="space-y-2 rounded-xl border border-border bg-card p-5">
					<h3 class="text-sm font-bold text-foreground">Are updates included?</h3>
					<p class="leading-relaxed text-muted-foreground">
						Yes. Both licenses grant lifetime access to repository updates, bug fixes, and
						compatibility patches as Svelte 5 evolves.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
