<!-- src/lib/components/PaddleCheckout.svelte -->
<script lang="ts">
	import { PUBLIC_PADDLE_CLIENT_TOKEN, PUBLIC_PADDLE_ENV } from '$env/static/public';
	import { ArrowRight, LoaderCircle, ShieldCheck } from '@lucide/svelte';
	import { initializePaddle, type Paddle } from '@paddle/paddle-js';
	import { onMount } from 'svelte';

	interface Props {
		priceId: string;
		buttonText?: string;
		githubUsername?: string;
		class?: string;
	}

	let {
		priceId,
		buttonText = 'Get SuperSvelte',
		githubUsername = '',
		class: className = ''
	}: Props = $props();

	let paddle = $state<Paddle | null>(null);
	let loading = $state(false);

	onMount(async () => {
		const paddleInstance = await initializePaddle({
			environment: (PUBLIC_PADDLE_ENV as 'sandbox' | 'production') || 'sandbox',
			token: PUBLIC_PADDLE_CLIENT_TOKEN
		});

		if (paddleInstance) {
			paddle = paddleInstance;
		}
	});

	function handleCheckout() {
		if (!paddle || loading) return;
		loading = true;

		paddle.Checkout.open({
			items: [{ priceId, quantity: 1 }],
			customData: {
				github_username: githubUsername
			},
			settings: {
				displayMode: 'overlay',
				theme: 'dark',
				successUrl: `${window.location.origin}/test?payment=success`
			}
		});

		setTimeout(() => {
			loading = false;
		}, 1000);
	}
</script>

<div class={className}>
	<button
		onclick={handleCheckout}
		disabled={!paddle || loading}
		class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-sans text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if !paddle}
			<LoaderCircle class="size-4 animate-spin" />
			<span>Initializing Paddle...</span>
		{:else if loading}
			<LoaderCircle class="size-4 animate-spin" />
			<span>Opening Checkout...</span>
		{:else}
			<span>{buttonText}</span>
			<ArrowRight class="size-4" />
		{/if}
	</button>

	<div
		class="mt-2.5 flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground"
	>
		<ShieldCheck class="size-3.5 text-emerald-500" />
		<span>EU VAT Automated & Secure Checkout</span>
	</div>
</div>
