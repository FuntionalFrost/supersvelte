<!-- src/lib/components/PolarCheckout.svelte -->
<script lang="ts">
	import { LoaderCircle, Rocket } from '@lucide/svelte';
	import { toast } from 'yaxa-svelte';

	interface Props {
		productId: string;
		buttonText?: string;
		className?: string;
	}

	let { productId, buttonText = 'Get SuperSvelte', className = '' }: Props = $props();

	let loading = $state(false);

	async function handleCheckout() {
		try {
			loading = true;
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId })
			});

			const data = await res.json();

			if (!res.ok || !data.url) {
				throw new Error(data.error || 'Failed to initiate checkout session.');
			}

			// Redirect directly to the secure hosted Polar checkout page
			window.location.href = data.url;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Checkout failed';
			toast.error(message);
			loading = false;
		}
	}
</script>

<button
	type="button"
	onclick={handleCheckout}
	disabled={loading}
	class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-50 {className}"
>
	{#if loading}
		<LoaderCircle class="size-4 animate-spin" />
		<span>Redirecting to Checkout...</span>
	{:else}
		<Rocket class="size-4" />
		<span>{buttonText}</span>
	{/if}
</button>
