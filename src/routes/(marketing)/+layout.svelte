<!-- src/routes/(marketing)/+layout.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Rocket, ShieldCheck } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- Sticky Marketing Header -->
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
					href={resolve('/login')}
					class="text-xs font-semibold text-muted-foreground transition hover:text-foreground"
				>
					Sign In
				</a>
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

	<!-- Page Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Marketing Footer -->
	<footer class="border-t border-border/40 bg-card py-12 text-xs text-muted-foreground">
		<div
			class="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row"
		>
			<div class="flex items-center gap-2 font-mono">
				<ShieldCheck class="size-4 text-emerald-500" />
				<span>Official Svelte 5 + Hono Edge Boilerplate</span>
			</div>
			<div class="flex items-center gap-6 font-medium">
				<a href={resolve('/terms')} class="transition hover:text-foreground">Terms of Service</a>
				<a href={resolve('/privacy')} class="transition hover:text-foreground">Privacy Policy</a>
				<a href={resolve('/refunds')} class="transition hover:text-foreground">Refund Policy</a>
			</div>
			<div class="font-mono text-[11px]">
				&copy; {new Date().getFullYear()} SuperSvelte. All rights reserved.
			</div>
		</div>
	</footer>
</div>
