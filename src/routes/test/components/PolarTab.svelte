<script lang="ts">
	import { PUBLIC_POLAR_PRO_PRODUCT_ID, PUBLIC_POLAR_STANDARD_PRODUCT_ID } from '$app/env/public';
	import PolarCheckout from '#lib/components/PolarCheckout.svelte';
	import { CreditCard, Sparkles } from '@lucide/svelte';

	let { systemStatus } = $props<{
		systemStatus?: {
			polarToken?: boolean;
			polarSecret?: boolean;
		};
	}>();

	let testGithubUser = $state('octocat');
</script>

<div class="grid gap-6 md:grid-cols-3">
	<div class="space-y-4 rounded-xl border border-border bg-card p-6">
		<div class="flex items-center gap-2 text-sm font-bold">
			<CreditCard class="size-4 text-cyan-400" />
			<span>Polar Billing Diagnostics</span>
		</div>

		<p class="text-xs leading-relaxed text-muted-foreground">
			Tests Polar SDK checkout creation and webhook signature verification.
		</p>

		<div class="space-y-2 border-t border-border/60 pt-3 font-mono text-xs">
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">Polar API Token:</span>
				<span
					class="rounded px-2 py-0.5 font-bold {systemStatus?.polarToken
						? 'bg-emerald-500/10 text-emerald-500'
						: 'bg-red-500/10 text-red-400'}"
				>
					{systemStatus?.polarToken ? 'Configured ✅' : 'Missing ❌'}
				</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">Webhook Secret:</span>
				<span
					class="rounded px-2 py-0.5 font-bold {systemStatus?.polarSecret
						? 'bg-emerald-500/10 text-emerald-500'
						: 'bg-red-500/10 text-red-400'}"
				>
					{systemStatus?.polarSecret ? 'Configured ✅' : 'Missing ❌'}
				</span>
			</div>
			<div class="flex flex-col gap-1 pt-1">
				<span class="text-[10px] text-muted-foreground">Standard Product ID:</span>
				<span class="truncate rounded bg-muted/60 p-1.5 text-[10px] text-foreground"
					>{PUBLIC_POLAR_STANDARD_PRODUCT_ID || 'Not configured'}</span
				>
			</div>
			<div class="flex flex-col gap-1 pt-1">
				<span class="text-[10px] text-muted-foreground">Pro Product ID:</span>
				<span class="truncate rounded bg-muted/60 p-1.5 text-[10px] text-foreground"
					>{PUBLIC_POLAR_PRO_PRODUCT_ID || 'Not configured'}</span
				>
			</div>
		</div>
	</div>

	<div class="space-y-6 rounded-xl border border-border bg-card p-6 md:col-span-2">
		<div class="flex items-center justify-between border-b border-border pb-3">
			<div class="flex items-center gap-2">
				<Sparkles class="size-4 text-emerald-400" />
				<span class="text-xs font-bold">Hosted Polar Checkout Test</span>
			</div>
			<span class="font-mono text-[10px] text-muted-foreground"
				>Redirect URL: /welcome?checkout_id=...</span
			>
		</div>

		<div class="space-y-1.5">
			<label for="gh-test" class="text-xs font-medium text-foreground">
				Test Custom Metadata (<code class="text-primary">github_username</code>)
			</label>
			<input
				id="gh-test"
				type="text"
				bind:value={testGithubUser}
				placeholder="e.g. octocat"
				class="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
			/>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<div
				class="flex flex-col justify-between space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4"
			>
				<div>
					<h4 class="text-xs font-bold text-foreground">Standard License Checkout</h4>
					<p class="mt-1 font-mono text-[11px] text-muted-foreground">
						Product: {PUBLIC_POLAR_STANDARD_PRODUCT_ID || 'prod_...'}
					</p>
				</div>
				<PolarCheckout
					productId={PUBLIC_POLAR_STANDARD_PRODUCT_ID}
					buttonText="Test Standard Checkout"
				/>
			</div>

			<div
				class="flex flex-col justify-between space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4"
			>
				<div>
					<h4 class="text-xs font-bold text-foreground">Pro License Checkout</h4>
					<p class="mt-1 font-mono text-[11px] text-muted-foreground">
						Product: {PUBLIC_POLAR_PRO_PRODUCT_ID || 'prod_...'}
					</p>
				</div>
				<PolarCheckout productId={PUBLIC_POLAR_PRO_PRODUCT_ID} buttonText="Test Pro Checkout" />
			</div>
		</div>
	</div>
</div>
