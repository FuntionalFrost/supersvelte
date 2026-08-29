<!-- src/lib/components/Gate.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Lock, Sparkles } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		required?: 'standard' | 'pro';
		allowed?: Snippet;
		children?: Snippet;
		fallback?: Snippet;
		denied?: Snippet;
	}

	let { required = 'standard', allowed, children, fallback, denied }: Props = $props();

	// Read session and purchases from layout data
	const user = $derived(page.data.user);
	const purchases = $derived(page.data.purchases ?? []);

	const hasPro = $derived(
		purchases.some((p: { productId?: string; priceId?: string }) =>
			(p.productId || p.priceId)?.includes('pro')
		)
	);
	const hasStandard = $derived(purchases.length > 0 || hasPro);

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
				href={resolve('/dashboard/billing')}
				class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition hover:brightness-110"
			>
				<Sparkles class="size-3.5" />
				<span>Upgrade License</span>
			</a>
		</div>
	</div>
{/if}
