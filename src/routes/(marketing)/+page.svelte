<!-- src/routes/(marketing)/+page.svelte -->
<script lang="ts">
	import {
		PUBLIC_POLAR_PRO_PRODUCT_ID,
		PUBLIC_POLAR_STANDARD_PRODUCT_ID
	} from '$env/static/public';
	import CodeComparison from '$lib/components/CodeComparison.svelte';
	import PolarCheckout from '$lib/components/PolarCheckout.svelte';
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
	import { Seo } from 'yaxa-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let mode = $state<Mode>('saas-starters');
	let currentMatrix = $derived(matrices[mode]);

	function getCellValue(row: Record<string, unknown>, key: string): string {
		return String(row[key] ?? '');
	}
</script>

<Seo
	title="SuperSvelte — Ship Svelte 5 SaaS Apps at Light Speed"
	description="The ultimate Svelte 5 production boilerplate. Features Better Auth, Drizzle ORM, Neon Postgres, Upstash Redis, UploadThing, and 0-codegen Hono Zod RPC."
	ogImage={{
		title: 'SuperSvelte',
		description: 'Ship Svelte 5 SaaS Apps at Light Speed',
		badge: 'Svelte 5 + Hono RPC'
	}}
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
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs"
			>
				<Sparkles class="size-3.5 text-muted-foreground" />
				<span>SuperSvelte • Svelte 5 + Hono RPC + Neon</span>
			</div>

			<h1 class="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl">
				<span class="text-foreground">Super</span><span
					class="bg-linear-to-r from-teal-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent"
					>Svelte</span
				>
			</h1>

			<p class="mx-auto mt-4 max-w-xl text-lg font-bold text-foreground sm:text-2xl">
				The Batteries-Included Edge TS Framework
			</p>

			<p class="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
				Stop assembling your stack from 15 npm packages. SuperSvelte ships Auth, Neon DB, Redis SSE,
				OpenAPI 3.1 Hono RPC, Uploads, and Resend out-of-the-box with sub-10ms edge cold starts.
			</p>

			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="#pricing"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background shadow-md transition hover:scale-105 hover:bg-foreground/90"
				>
					<Rocket class="size-4" />
					<span>Get SuperSvelte!</span>
				</a>
				<a
					href="#features"
					class="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground shadow-xs transition hover:border-border hover:bg-muted"
				>
					<Terminal class="size-4 text-muted-foreground" />
					<span>Explore Architecture</span>
				</a>
			</div>
		</div>
	</header>

	<!-- 2. TECH STACK HIGHLIGHTS -->
	<section id="features" class="border-b border-border/40 bg-muted/30 py-16">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				<a
					href="/docs/getting-started/introduction"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50"
				>
					<Zap class="size-6 text-amber-400" />
					<span class="text-sm font-bold">Svelte 5</span>
					<span class="text-[11px] text-muted-foreground">Fine-grained Runes</span>
				</a>
				<a
					href="/docs/architecture/hono-rpc"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
				>
					<Cpu class="size-6 text-cyan-400" />
					<span class="text-sm font-bold">Hono Zod RPC</span>
					<span class="text-[11px] text-muted-foreground">Auto OpenAPI 3.1</span>
				</a>
				<a
					href="/docs/architecture/database"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50"
				>
					<Database class="size-6 text-emerald-400" />
					<span class="text-sm font-bold">Drizzle + Neon</span>
					<span class="text-[11px] text-muted-foreground">Serverless Postgres</span>
				</a>
				<a
					href="/docs/architecture/authentication"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50"
				>
					<ShieldCheck class="size-6 text-indigo-400" />
					<span class="text-sm font-bold">Better Auth</span>
					<span class="text-[11px] text-muted-foreground">Sessions & Social</span>
				</a>
				<a
					href="/docs/architecture/queue-realtime"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-400/50"
				>
					<Cloud class="size-6 text-red-400" />
					<span class="text-sm font-bold">Upstash Redis</span>
					<span class="text-[11px] text-muted-foreground">Cache & SSE Queue</span>
				</a>
				<a
					href="/docs/architecture/storage"
					class="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/50"
				>
					<Mail class="size-6 text-pink-400" />
					<span class="text-sm font-bold">Resend & UT</span>
					<span class="text-[11px] text-muted-foreground">Mail & Storage</span>
				</a>
			</div>
		</div>
	</section>

	<!-- 3. FEATURED COMPARISON MATRIX -->
	<section id="comparison" class="py-24">
		<div class="container mx-auto max-w-6xl px-4">
			<div class="text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
				>
					<Sparkles class="size-3.5" />
					<span>Direct Competitor Matrix</span>
				</div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">How SuperSvelte Compares</h2>
				<p class="mt-2 text-sm text-muted-foreground">
					See how SuperSvelte stacks up directly against paid SaaS boilerplates, TypeScript
					toolkits, and classic monoliths.
				</p>

				<div
					class="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs"
				>
					<button
						onclick={() => (mode = 'saas-starters')}
						class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {mode ===
						'saas-starters'
							? 'border border-border/80 bg-background text-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. SaaS Starters (Supastarter, Makerkit, Epic Stack)
					</button>

					<button
						onclick={() => (mode = 'ts-frameworks')}
						class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {mode ===
						'ts-frameworks'
							? 'border border-border/80 bg-background text-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. TS Frameworks (AdonisJS, Redwood, Wasp)
					</button>

					<button
						onclick={() => (mode = 'monoliths')}
						class="rounded-lg px-4 py-2 text-sm font-semibold transition-all {mode === 'monoliths'
							? 'border border-border/80 bg-background text-foreground shadow-xs'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						vs. Backend Monoliths (Laravel, Rails, Django, .NET)
					</button>
				</div>
			</div>

			<div class="mt-12 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
				<table class="w-full text-left text-sm">
					<thead class="border-b border-border bg-muted/50 text-muted-foreground">
						<tr>
							{#each currentMatrix.columns as col (col.key)}
								{#if col.isPrimary}
									<th
										class="border-x border-emerald-500/20 bg-emerald-500/10 p-4 font-bold text-emerald-600 dark:text-emerald-400 {col.minWidth ??
											''}"
									>
										<div class="flex items-center gap-1.5">
											<Sparkles class="size-4 text-emerald-600 dark:text-emerald-400" />
											<span>{col.label}</span>
										</div>
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
										<td class="p-4 font-semibold whitespace-nowrap text-foreground">
											{getCellValue(row, col.key)}
										</td>
									{:else if col.isPrimary}
										<td
											class="border-x border-emerald-500/20 bg-emerald-500/5 p-4 font-semibold text-emerald-600 dark:text-emerald-400"
										>
											<div class="flex items-center gap-1.5">
												<Check class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
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
	<CodeComparison snippets={data.comparisonSnippets} />

	<!-- 5. BENCHMARKS -->
	<section class="border-t border-border/60 bg-muted/20 py-20">
		<div class="container mx-auto px-4">
			<SuperSvelteVsOthers />
		</div>
	</section>

	<!-- 6. PRICING SECTION -->
	<section id="pricing" class="border-t border-border/40 bg-muted/20 py-24">
		<div class="container mx-auto max-w-5xl px-4">
			<div class="text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
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
							<h3 class="text-sm font-bold">Standard License</h3>
							<span
								class="rounded-md border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] font-bold"
							>
								1 Developer
							</span>
						</div>
						<div class="mt-4 flex items-baseline gap-1">
							<span class="text-4xl font-extrabold">€99</span>
							<span class="text-sm text-muted-foreground">/ one-time</span>
						</div>
						<p class="mt-2 text-sm text-muted-foreground">
							Perfect for solopreneurs launching a single product.
						</p>

						<ul class="mt-6 space-y-3 text-sm font-medium text-foreground/90">
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Full Svelte 5 + Hono Source Code
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Auto-Introspecting /admin CRUD Dashboard
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Better Auth (Session + Social Logins)
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Drizzle ORM + Neon Serverless Postgres
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Dual Storage (UploadThing & Cloudflare R2 /
								S3)
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Resend Mail + Zero-Config Dev Logger
							</li>
							<li class="flex items-center gap-2">
								<Check class="size-4 text-emerald-500" /> Private GitHub Repository Access
							</li>
						</ul>
					</div>

					<div class="mt-8">
						<PolarCheckout
							productId={PUBLIC_POLAR_STANDARD_PRODUCT_ID}
							buttonText="Get Standard License"
						/>
					</div>
				</div>

				<!-- Pro Tier -->
				<div
					class="relative flex flex-col justify-between rounded-2xl border-2 border-primary/50 bg-card p-8 shadow-xl ring-1 ring-primary/20"
				>
					<div
						class="absolute -top-3.5 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase shadow-xs"
					>
						Most Popular
					</div>
					<div>
						<div class="flex items-center justify-between">
							<h3 class="text-sm font-bold text-foreground">Unlimited Pro License</h3>
							<span
								class="rounded-md border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] font-bold text-foreground"
							>
								Unlimited Projects
							</span>
						</div>
						<div class="mt-4 flex items-baseline gap-1">
							<span class="text-4xl font-extrabold">€199</span>
							<span class="text-sm text-muted-foreground">/ one-time</span>
						</div>
						<p class="mt-2 text-sm text-muted-foreground">
							For agencies, serial founders, and team workflows.
						</p>

						<ul class="mt-6 space-y-3 text-sm font-medium text-foreground/90">
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
								<Check class="size-4 text-emerald-500" /> Yaxa Svelte UI Design System & Themes
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
						<PolarCheckout productId={PUBLIC_POLAR_PRO_PRODUCT_ID} buttonText="Get Pro License" />
					</div>
				</div>
			</div>

			<!-- Pricing Trust Guarantee Strip -->
			<div
				class="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/60 bg-card/60 px-6 py-4 text-xs font-semibold text-muted-foreground shadow-xs backdrop-blur-sm sm:justify-between"
			>
				<div class="flex items-center gap-2">
					<ShieldCheck class="size-4 text-emerald-500" />
					<span>Secure Checkout via Polar</span>
				</div>
				<div class="flex items-center gap-2">
					<Zap class="size-4 text-cyan-400" />
					<span>Instant GitHub Collaborator Access</span>
				</div>
				<div class="flex items-center gap-2">
					<Check class="size-4 text-emerald-500" />
					<span>14-Day Money-Back Guarantee</span>
				</div>
			</div>
		</div>
	</section>

	<!-- 6. DEVELOPER FAQ SECTION -->
	<section id="faq" class="border-t border-border/40 py-20">
		<div class="container mx-auto max-w-4xl px-4">
			<div class="mb-12 text-center">
				<div
					class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
				>
					<CircleQuestionMark class="size-3.5" />
					<span>Got Questions?</span>
				</div>
				<h2 class="text-3xl font-bold">Frequently Asked Questions</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
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
						Yes. Both licences grant lifetime access to repository updates, bug fixes, and
						compatibility patches as Svelte 5 evolves.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
