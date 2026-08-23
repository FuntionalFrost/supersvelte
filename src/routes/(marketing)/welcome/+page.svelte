<!-- src/routes/(marketing)/welcome/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { MetaTags } from 'svelte-meta-tags';
	import {
		ArrowRight,
		Check,
		CircleCheck,
		Copy,
		Download,
		Key,
		Mail,
		ShieldCheck
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let copiedKey = $state(false);

	async function copyLicenseKey(key: string) {
		await navigator.clipboard.writeText(key);
		copiedKey = true;
		toast.success('License key copied to clipboard!');
		setTimeout(() => (copiedKey = false), 2000);
	}
</script>

<MetaTags
	title="Welcome to SuperSvelte!"
	description="Getting started with your SuperSvelte license and GitHub repository access."
	robots="noindex, nofollow"
/>

<div class="container mx-auto max-w-4xl space-y-8 px-4 py-12 md:py-16">
	<!-- Success Banner -->
	<div
		class="rounded-2xl border border-emerald-500/30 bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-8 text-center shadow-xs"
	>
		<div
			class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30"
		>
			<CircleCheck class="size-6" />
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
			You're in! Welcome to SuperSvelte 🎉
		</h1>
		<p class="mx-auto mt-2 max-w-lg text-xs text-muted-foreground sm:text-sm">
			Your transaction has been confirmed and your lifetime license is active. Download your files
			and copy your license key below.
		</p>
	</div>

	<!-- Fulfillment Matrix Grid -->
	<div class="grid gap-6 md:grid-cols-2">
		<!-- Card 1: License Key & API Verification -->
		<div
			class="flex flex-col justify-between space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-xs"
		>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Key class="size-5 text-primary" />
						<h2 class="text-sm font-bold text-foreground">API License Key</h2>
					</div>
					<span
						class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase"
					>
						Active
					</span>
				</div>

				<p class="text-xs leading-relaxed text-muted-foreground">
					Use this license key to authenticate CLI tools, desktop apps, or verify programmatically
					via <code class="font-mono text-primary">/api/v1/verify-license</code>.
				</p>

				{#if data.purchase?.licenseKey}
					<div
						class="flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 p-3 font-mono text-xs font-bold text-foreground"
					>
						<span class="truncate">{data.purchase.licenseKey}</span>
						<button
							onclick={() => copyLicenseKey(data.purchase!.licenseKey!)}
							class="ml-2 rounded-lg border border-border bg-background p-1.5 text-muted-foreground transition hover:text-foreground"
							title="Copy License Key"
						>
							{#if copiedKey}
								<Check class="size-3.5 text-emerald-500" />
							{:else}
								<Copy class="size-3.5" />
							{/if}
						</button>
					</div>
				{:else}
					<div
						class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500"
					>
						License key generating... Refresh page if it doesn't appear shortly.
					</div>
				{/if}
			</div>

			<div class="border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
				<span
					>Verify via API: <code class="font-mono text-foreground">POST /api/v1/verify-license</code
					></span
				>
			</div>
		</div>

		<!-- Card 2: Direct .zip Archive Download -->
		<div
			class="flex flex-col justify-between space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-xs"
		>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Download class="size-5 text-emerald-500" />
						<h2 class="text-sm font-bold text-foreground">Direct Archive Download</h2>
					</div>
					<span
						class="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase"
					>
						Instant Access
					</span>
				</div>

				<p class="text-xs leading-relaxed text-muted-foreground">
					Download the full SuperSvelte boilerplate source code package directly as a pre-built <code
						class="font-mono text-foreground">.zip</code
					> archive.
				</p>

				<a
					href={resolve('/api/download')}
					class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500"
				>
					<Download class="size-4" />
					<span>Download Source Code (.zip)</span>
				</a>
			</div>

			<div class="border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
				<span>Includes all Svelte 5 Runes, Hono RPC, & Drizzle schemas</span>
			</div>
		</div>
	</div>

	<!-- GitHub Repo & Receipt Details Card -->
	<div class="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
		<h2 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
			Additional Details & Support
		</h2>

		<div class="grid gap-4 text-xs sm:grid-cols-2">
			<div class="flex items-start gap-3">
				<div class="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
					<!-- Inline GitHub Icon -->
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
						></path>
						<path d="M9 18c-4.51 2-5-2-7-2"></path>
					</svg>
				</div>
				<div>
					<p class="font-semibold text-foreground">GitHub Private Repository</p>
					<p class="mt-0.5 leading-relaxed text-muted-foreground">
						An invitation to join the private GitHub repository has been dispatched to your email
						address.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3">
				<div class="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
					<Mail class="size-5" />
				</div>
				<div>
					<p class="font-semibold text-foreground">Receipt & Tax Invoice</p>
					<p class="mt-0.5 leading-relaxed text-muted-foreground">
						Paddle (Merchant of Record) has emailed your official VAT receipt to your checkout
						email.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Navigation CTA -->
	<div class="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
		<div class="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
			<ShieldCheck class="size-4 text-emerald-500" />
			<span>Lifetime License Verified</span>
		</div>

		<a
			href={resolve('/dashboard')}
			class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90"
		>
			<span>Go to Dashboard</span>
			<ArrowRight class="size-4" />
		</a>
	</div>
</div>
