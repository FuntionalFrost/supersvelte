<!-- src/routes/(marketing)/welcome/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import { ArrowRight, CircleCheck, Mail, ShieldCheck } from '@lucide/svelte';
</script>

<SEO
	title="Welcome to SuperSvelte — Purchase Complete"
	description="Thank you for your purchase."
/>

<div
	class="container mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center"
>
	<!-- Success Badge -->
	<div class="rounded-full bg-emerald-500/10 p-4 text-emerald-500 ring-1 ring-emerald-500/20">
		<CircleCheck class="size-12" />
	</div>

	<h1 class="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
		You're in! Welcome to SuperSvelte 🎉
	</h1>
	<p class="mt-3 text-base text-muted-foreground">
		Your transaction has been confirmed and your license is active.
	</p>

	<!-- Action Steps Card -->
	<div
		class="mt-8 w-full space-y-4 rounded-2xl border border-border/60 bg-card p-6 text-left shadow-sm"
	>
		<h2 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">Next Steps</h2>

		<div class="flex items-start gap-3 text-sm">
			<div class="rounded-lg bg-primary/10 p-2 text-primary">
				<!-- GitHub SVG -->
				<svg
					class="size-5 shrink-0"
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
				<p class="font-semibold text-foreground">GitHub Access Granted</p>
				<p class="text-xs leading-relaxed text-muted-foreground">
					An invitation to join the private GitHub repository has been sent to your email. Check
					your inbox or GitHub notifications to accept it.
				</p>
			</div>
		</div>

		<div class="flex items-start gap-3 text-sm">
			<div class="rounded-lg bg-primary/10 p-2 text-primary">
				<Mail class="size-5 shrink-0" />
			</div>
			<div>
				<p class="font-semibold text-foreground">Receipt & Invoice</p>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Paddle has sent your official tax invoice and receipt to your checkout email address.
				</p>
			</div>
		</div>
	</div>

	<!-- Navigation CTA -->
	<div class="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
		<a
			href={resolve('/dashboard')}
			class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 sm:w-auto"
		>
			<span>Go to Dashboard</span>
			<ArrowRight class="size-4" />
		</a>
	</div>

	<div
		class="mt-6 flex items-center justify-center gap-1.5 font-mono text-xs text-muted-foreground"
	>
		<ShieldCheck class="size-4 text-emerald-500" />
		<span>Lifetime License Verified</span>
	</div>
</div>
