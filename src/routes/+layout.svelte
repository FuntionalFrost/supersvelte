<!-- src/routes/(marketing)/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Rocket, ShieldCheck } from '@lucide/svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import './layout.css';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<!-- Global Default SEO Fallback -->
<SEO
	title="SuperSvelte — The Batteries-Included Edge Svelte 5 Framework"
	description="Launch Svelte 5 apps in hours with Better Auth, Drizzle, Neon Postgres, Upstash Redis, and OpenAPI Hono RPC."
/>

<ModeWatcher />
<Toaster position="top-right" richColors closeButton />

<div
	class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
>
	<!-- Sticky Header -->
	<header
		class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
	>
		<div class="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
			<!-- Logo -->
			<a href={resolve('/')} class="flex items-center gap-2.5 transition hover:opacity-90">
				<div
					class="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground"
				>
					S5
				</div>
				<span class="text-lg font-extrabold tracking-tight">
					Super<span class="text-primary">Svelte</span>
				</span>
			</a>

			<!-- Nav Links -->
			<nav class="hidden items-center gap-6 text-xs font-semibold text-muted-foreground md:flex">
				<a href="#features" class="transition hover:text-foreground">Stack & Specs</a>
				<a href="#comparison" class="transition hover:text-foreground">Matrix</a>
				<a href="#pricing" class="transition hover:text-foreground">Pricing</a>
				<a href="#faq" class="transition hover:text-foreground">FAQ</a>
			</nav>

			<!-- Actions -->
			<div class="flex items-center gap-3">
				<ThemeToggle />
				<a
					href="#pricing"
					class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90"
				>
					<Rocket class="size-3.5" />
					<span>Get SuperSvelte</span>
				</a>
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-border/40 bg-card py-12 text-xs text-muted-foreground">
		<div
			class="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row"
		>
			<div class="flex items-center gap-2 font-mono">
				<ShieldCheck class="size-4 text-emerald-500" />
				<span>Official Svelte 5 + Hono Edge Boilerplate</span>
			</div>
			<div class="font-mono text-[11px]">
				&copy; {new Date().getFullYear()} SuperSvelte. EU VAT Automated.
			</div>
		</div>
	</footer>
</div>
