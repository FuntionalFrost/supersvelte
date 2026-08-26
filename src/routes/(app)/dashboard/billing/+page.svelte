<!-- src/routes/(app)/dashboard/billing/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		PUBLIC_POLAR_PRO_PRODUCT_ID,
		PUBLIC_POLAR_STANDARD_PRODUCT_ID
	} from '$env/static/public';
	import PolarCheckout from '$lib/components/PolarCheckout.svelte';
	import { Check, CreditCard, ExternalLink, ShieldCheck } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const hasActivePlan = $derived(!!data.purchase);
	const planName = $derived(
		data.purchase?.productId === PUBLIC_POLAR_PRO_PRODUCT_ID ||
			data.purchase?.priceId === PUBLIC_POLAR_PRO_PRODUCT_ID
			? 'Pro Plan (Unlimited License)'
			: data.purchase?.productId === PUBLIC_POLAR_STANDARD_PRODUCT_ID ||
				  data.purchase?.priceId === PUBLIC_POLAR_STANDARD_PRODUCT_ID
				? 'Standard Plan (Single License)'
				: 'No Active License'
	);
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Billing & Licenses</h1>
		<p class="text-sm text-muted-foreground">
			Manage your SuperSvelte license, view invoices, and update billing details.
		</p>
	</div>

	{#if hasActivePlan}
		<!-- Active Plan Card -->
		<div class="rounded-2xl border border-border bg-card p-6 shadow-xs">
			<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div class="flex items-center gap-3">
					<div
						class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
					>
						<ShieldCheck class="size-6 text-emerald-500" />
					</div>
					<div>
						<div class="flex items-center gap-2">
							<h3 class="text-lg font-bold">{planName}</h3>
							<span
								class="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500"
							>
								Lifetime Access
							</span>
						</div>
						<p class="text-xs text-muted-foreground">
							Account: <span class="font-medium text-foreground">{data.user.email}</span>
						</p>
					</div>
				</div>

				<!-- Customer Portal Action -->
				<a
					href={resolve('/api/portal')}
					class="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold transition hover:bg-accent"
				>
					<CreditCard class="size-4" />
					<span>Manage Invoices & Billing</span>
					<ExternalLink class="size-3.5 opacity-60" />
				</a>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
				<div>
					<span class="text-xs text-muted-foreground">Customer ID</span>
					<div class="font-mono text-xs font-semibold text-foreground">
						{data.purchase?.customerId ?? 'N/A'}
					</div>
				</div>
				<div>
					<span class="text-xs text-muted-foreground">Transaction ID</span>
					<div class="font-mono text-xs font-semibold text-foreground">
						{data.purchase?.transactionId ?? 'N/A'}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Upgrade License Options -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Standard Tier -->
			<div class="flex flex-col justify-between rounded-2xl border border-border bg-card p-6">
				<div>
					<div class="flex items-center justify-between">
						<h3 class="text-base font-bold">Standard License</h3>
						<span
							class="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold"
						>
							1 Developer
						</span>
					</div>
					<div class="mt-3 flex items-baseline gap-1">
						<span class="text-3xl font-extrabold">€99</span>
						<span class="text-xs text-muted-foreground">/ one-time</span>
					</div>

					<ul class="mt-4 space-y-2 text-xs text-muted-foreground">
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Full Svelte 5 + Hono Source Code
						</li>
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Drizzle ORM + Neon Postgres
						</li>
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Private GitHub Repo Access
						</li>
					</ul>
				</div>

				<div class="mt-6">
					<PolarCheckout
						productId={PUBLIC_POLAR_STANDARD_PRODUCT_ID}
						buttonText="Get Standard License"
					/>
				</div>
			</div>

			<!-- Pro Tier -->
			<div
				class="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-card p-6 shadow-md"
			>
				<div>
					<div class="flex items-center justify-between">
						<h3 class="text-base font-bold text-primary">Unlimited Pro License</h3>
						<span
							class="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary"
						>
							Unlimited Projects
						</span>
					</div>
					<div class="mt-3 flex items-baseline gap-1">
						<span class="text-3xl font-extrabold">€199</span>
						<span class="text-xs text-muted-foreground">/ one-time</span>
					</div>

					<ul class="mt-4 space-y-2 text-xs text-muted-foreground">
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Everything in Standard License
						</li>
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Multi-Tenant Team Workspaces
						</li>
						<li class="flex items-center gap-2 text-foreground">
							<Check class="size-3.5 text-emerald-500" /> Priority GitHub Issue Support
						</li>
					</ul>
				</div>

				<div class="mt-6">
					<PolarCheckout productId={PUBLIC_POLAR_PRO_PRODUCT_ID} buttonText="Get Unlimited Pro" />
				</div>
			</div>
		</div>
	{/if}
</div>
