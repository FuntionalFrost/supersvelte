<!-- src/routes/(app)/dashboard/billing/+page.svelte -->
<script lang="ts">
	import { PUBLIC_PADDLE_PRO_PRICE_ID, PUBLIC_PADDLE_STANDARD_PRICE_ID } from '$env/static/public';
	import {
		CircleCheck,
		CreditCard,
		ExternalLink,
		Receipt,
		ShieldCheck,
		Sparkles
	} from '@lucide/svelte';

	let { data } = $props();

	const hasActivePlan = $derived(!!data.purchase);
	const planName = $derived(
		data.purchase?.priceId === PUBLIC_PADDLE_PRO_PRICE_ID
			? 'Pro Plan (Lifetime License)'
			: data.purchase?.priceId === PUBLIC_PADDLE_STANDARD_PRICE_ID
				? 'Standard Plan (Single License)'
				: hasActivePlan
					? 'Active Plan'
					: 'Free Tier / Trial'
	);
</script>

<div class="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
	<!-- Header -->
	<div
		class="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Billing & Subscription</h1>
			<p class="text-xs text-muted-foreground">
				Manage your payment methods, view invoices, and upgrade your license terms.
			</p>
		</div>

		{#if data.portalUrls?.overview}
			<a
				href={data.portalUrls.overview}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
			>
				<ExternalLink class="size-3.5" />
				<span>Open Paddle Billing Portal</span>
			</a>
		{/if}
	</div>

	<!-- Plan Card -->
	<div class="grid gap-6 md:grid-cols-3">
		<div class="space-y-4 rounded-xl border border-border bg-card p-6 shadow-xs md:col-span-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Sparkles class="size-5 text-primary" />
					<h2 class="text-sm font-bold text-foreground">Current Active Plan</h2>
				</div>
				<span
					class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500"
				>
					{hasActivePlan ? 'Active' : 'No Active License'}
				</span>
			</div>

			<div class="space-y-1">
				<h3 class="text-xl font-extrabold text-foreground">{planName}</h3>
				<p class="text-xs text-muted-foreground">
					Registered under <span class="font-mono font-medium text-foreground"
						>{data.user.email}</span
					>
				</p>
			</div>

			<div class="grid gap-3 pt-2 sm:grid-cols-2">
				<div class="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
					<div class="text-muted-foreground">Merchant of Record</div>
					<div class="mt-1 font-semibold text-foreground">Paddle Payments Ltd.</div>
				</div>
				<div class="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
					<div class="text-muted-foreground">Customer ID</div>
					<div class="mt-1 font-mono font-semibold text-foreground">
						{data.purchase?.customerId ?? 'N/A'}
					</div>
				</div>
			</div>

			<!-- Self-Service Action Links -->
			<div class="flex flex-wrap gap-3 border-t border-border/60 pt-4">
				{#if data.portalUrls?.updatePaymentMethod}
					<a
						href={data.portalUrls.updatePaymentMethod}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-accent"
					>
						<CreditCard class="size-3.5 text-primary" />
						<span>Update Payment Method</span>
					</a>
				{/if}

				{#if data.portalUrls?.overview}
					<a
						href={data.portalUrls.overview}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-accent"
					>
						<Receipt class="size-3.5 text-primary" />
						<span>Download Tax Invoices</span>
					</a>
				{/if}
			</div>
		</div>

		<!-- Quick Verification Sidebar -->
		<div class="space-y-4 rounded-xl border border-border bg-card p-6 shadow-xs">
			<div class="flex items-center gap-2 text-sm font-bold text-foreground">
				<ShieldCheck class="size-4 text-emerald-500" />
				<span>License Benefits</span>
			</div>

			<ul class="space-y-2.5 text-xs text-muted-foreground">
				<li class="flex items-center gap-2">
					<CircleCheck class="size-3.5 shrink-0 text-emerald-500" />
					<span>Private GitHub Repository Access</span>
				</li>
				<li class="flex items-center gap-2">
					<CircleCheck class="size-3.5 shrink-0 text-emerald-500" />
					<span>Lifetime License Updates</span>
				</li>
				<li class="flex items-center gap-2">
					<CircleCheck class="size-3.5 shrink-0 text-emerald-500" />
					<span>Zero Vendor Lock-in & Royalty-Free</span>
				</li>
			</ul>
		</div>
	</div>
</div>
