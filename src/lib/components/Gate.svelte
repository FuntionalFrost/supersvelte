<!-- src/lib/components/Gate.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_POLAR_PRO_PRODUCT_ID } from '$env/static/public';
	import { Lock, Sparkles } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		required?: 'standard' | 'pro' | string;
		allowed?: Snippet;
		children?: Snippet;
		fallback?: Snippet;
		denied?: Snippet;
		preview?: boolean;
		upgradeUrl?: string;
		class?: string;
	}

	let {
		required = 'standard',
		allowed,
		children,
		fallback,
		denied,
		preview = false,
		upgradeUrl = resolve('/dashboard/billing'),
		class: className = ''
	}: Props = $props();

	// Read session and purchases from layout data
	const user = $derived(page.data.user);
	const purchases = $derived(page.data.purchases ?? []);

	const hasPro = $derived(
		purchases.some(
			(p: { productId?: string; priceId?: string; status?: string }) =>
				(p.status === 'active' || !p.status) &&
				(p.productId === PUBLIC_POLAR_PRO_PRODUCT_ID ||
					p.productId?.toLowerCase().includes('pro') ||
					p.priceId?.toLowerCase().includes('pro'))
		)
	);
	const hasStandard = $derived(
		purchases.some((p: { status?: string }) => p.status === 'active' || !p.status) || hasPro
	);

	const isUnlocked = $derived.by(() => {
		if (user?.role === 'admin') return true;
		return required === 'pro' ? hasPro : hasStandard;
	});

	// Support both snippet naming conventions
	const renderAllowed = $derived(allowed ?? children);
	const renderDenied = $derived(denied ?? fallback);
</script>

{#if isUnlocked}
	{#if renderAllowed}
		{@render renderAllowed()}
	{/if}
{:else if preview && renderAllowed}
	<div class="relative overflow-hidden rounded-2xl border border-border bg-card {className}">
		<!-- Blurred disabled preview of children -->
		<div
			class="pointer-events-none max-h-95 opacity-40 blur-[3px] transition-all select-none"
			aria-hidden="true"
			tabindex="-1"
		>
			{@render renderAllowed()}
		</div>

		<!-- Centered Upgrade Callout Overlay -->
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 p-6 text-center backdrop-blur-xs transition-colors"
		>
			<div
				class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs"
			>
				<Lock class="size-6" />
			</div>

			<h4 class="mt-3 text-base font-bold text-foreground">
				{required === 'pro' ? 'Pro Plan Required' : 'Active License Required'}
			</h4>

			<p class="mt-1 max-w-sm text-xs text-muted-foreground">
				This feature is part of the {required === 'pro' ? 'Unlimited Pro' : 'Standard'} license tier.
			</p>

			<div class="mt-4 flex items-center gap-3">
				<a
					href={upgradeUrl}
					class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:brightness-110"
				>
					<Sparkles class="size-3.5" />
					<span>Upgrade License</span>
				</a>
			</div>
		</div>
	</div>
{:else if renderDenied}
	{@render renderDenied()}
{:else}
	<div
		class="relative overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-b from-primary/5 via-background to-background p-8 text-center"
	>
		<div
			class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs"
		>
			<Lock class="size-6" />
		</div>

		<h3 class="mt-4 text-lg font-bold">
			{required === 'pro' ? 'Pro Plan Required' : 'Active License Required'}
		</h3>

		<p class="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">
			This module is part of the {required === 'pro' ? 'Unlimited Pro' : 'Standard'} license tier.
		</p>

		<div class="mt-6 flex justify-center">
			<a
				href={upgradeUrl}
				class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition hover:brightness-110"
			>
				<Sparkles class="size-3.5" />
				<span>Upgrade License</span>
			</a>
		</div>
	</div>
{/if}
