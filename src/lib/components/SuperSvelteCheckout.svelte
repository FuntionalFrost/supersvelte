<!-- src/lib/components/SuperSvelteCheckout.svelte -->
<script lang="ts">
	import { ArrowRight, LoaderCircle, ShieldCheck } from '@lucide/svelte';

	interface Props {
		variantId: string;
		buttonText?: string;
	}

	let { variantId, buttonText = 'Get SuperSvelte' }: Props = $props();
	let loading = $state(false);

	async function handleCheckout() {
		loading = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ variantId })
			});

			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err) {
			console.error('Checkout error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<button
	onclick={handleCheckout}
	disabled={loading}
	class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-sans text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:opacity-50"
>
	{#if loading}
		<LoaderCircle class="size-4 animate-spin" />
		<span>Preparing Checkout...</span>
	{:else}
		<span>{buttonText}</span>
		<ArrowRight class="size-4" />
	{/if}
</button>
<div
	class="mt-2 flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground"
>
	<ShieldCheck class="size-3.5 text-emerald-500" />
	<span>EU VAT Automated & Secure Checkout</span>
</div>
