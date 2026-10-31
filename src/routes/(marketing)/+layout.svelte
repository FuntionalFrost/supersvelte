<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '#lib/components/Logo.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { ExternalLink, LayoutDashboard, Menu, Rocket, Sparkles, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { siteConfig } from '../../site.config';

	let { children }: { children: Snippet } = $props();
	const user = $derived(page.data.user);
	let mobileOpen = $state(false);
</script>

<!-- src/routes/(marketing)/+layout.svelte -->

<div
	class="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<!-- Sticky Marketing Header with responsive mobile layout -->
	<header class="sticky top-0 z-40 w-full border-b border-border/60 yaxa-glass">
		<div
			class="container mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:h-20 sm:px-6"
		>
			<div class="flex min-w-0 items-center gap-1.5 sm:gap-4">
				<!-- Mobile Menu Toggle Button -->
				<button
					type="button"
					onclick={() => (mobileOpen = !mobileOpen)}
					class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted sm:p-2 md:hidden"
					aria-label="Toggle navigation"
				>
					{#if mobileOpen}
						<X class="size-5 sm:size-6" />
					{:else}
						<Menu class="size-5 sm:size-6" />
					{/if}
				</button>

				<!-- Brand Logo & Text -->
				<a href="/" class="flex min-w-0 items-center gap-2 transition hover:opacity-90 sm:gap-3">
					<Logo size="md" showText />
				</a>
			</div>

			<!-- Desktop Nav Links -->
			<nav class="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
				{#each siteConfig.nav || [] as item (item.href)}
					<a href={item.href} class="transition hover:text-foreground">
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Header Actions -->
			<div class="flex shrink-0 items-center gap-2 sm:gap-4">
				<ThemeToggle />
				{#if user}
					<a
						href={resolve('dashboard')}
						class="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-background shadow-xs transition hover:bg-foreground/90 sm:gap-2 sm:px-5 sm:py-2 sm:text-sm"
					>
						<LayoutDashboard class="size-3.5 shrink-0 sm:size-4" />
						<span>Dashboard</span>
					</a>
				{:else}
					<a
						href={resolve('login')}
						class="hidden text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline-block"
					>
						Sign In
					</a>
					<a
						href="https://github.com/FunctionalFrost/supersvelte"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-background shadow-xs transition hover:bg-foreground/90 sm:gap-2 sm:px-5 sm:py-2 sm:text-sm"
					>
						<Rocket class="size-3.5 shrink-0 sm:size-4" />
						<span>Get<span class="hidden min-[420px]:inline"> SuperSvelte</span></span>
					</a>
				{/if}
			</div>
		</div>

		<!-- Mobile Navigation Drawer -->
		{#if mobileOpen}
			<div class="border-b border-border/60 bg-background/95 px-5 py-4 backdrop-blur-md md:hidden">
				<nav class="flex flex-col space-y-2">
					{#each siteConfig.nav || [] as item (item.href)}
						<a
							href={item.href}
							onclick={() => (mobileOpen = false)}
							class="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
						>
							{item.label}
						</a>
					{/each}
					<a
						href="/contact"
						onclick={() => (mobileOpen = false)}
						class="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
					>
						Contact & Support
					</a>
					<div class="flex items-center justify-between border-t border-border/40 px-3 pt-3">
						<span class="text-xs font-medium text-muted-foreground">Appearance</span>
						<ThemeToggle />
					</div>
					{#if !user}
						<div class="border-t border-border/40 pt-3">
							<a
								href={resolve('login')}
								onclick={() => (mobileOpen = false)}
								class="block rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								Sign In
							</a>
						</div>
					{/if}
				</nav>
			</div>
		{/if}
	</header>

	<!-- Main Page Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Marketing Footer -->
	<footer class="border-t border-border/60 bg-card/60 text-muted-foreground">
		<div class="container mx-auto max-w-6xl px-4 py-12 md:py-16">
			<div class="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
				<!-- Brand & Mission Description -->
				<div class="space-y-3 md:col-span-2 lg:col-span-2">
					<div class="flex items-center gap-3">
						<a href="/" class="inline-flex items-center gap-2.5">
							<Logo size="sm" showText />
						</a>
						<span
							class="inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal-400"
						>
							Svelte 5 Boilerplate
						</span>
					</div>

					<p class="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
						Enterprise-grade Svelte 5 boilerplate with OpenAPI Hono RPC, Better Auth, Neon Postgres,
						Drizzle ORM, Polar, and Upstash Redis. Built with Yaxa.
					</p>

					<!-- Copyright & License underneath description -->
					<p class="pt-1 font-mono text-xs text-muted-foreground">
						© 2026 SuperSvelte. · MIT Licensed
					</p>
				</div>

				<!-- Navigation Column -->
				<div>
					<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">Navigation</h3>
					<ul class="mt-4 space-y-2.5 text-xs">
						{#each siteConfig.nav || [] as item (item.href)}
							<li>
								<a href={item.href} class="transition hover:text-foreground">
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Legal & Compliance Column -->
				<div>
					<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">
						Legal & Compliance
					</h3>
					<ul class="mt-4 space-y-2.5 text-xs">
						<li>
							<a href={resolve('privacy')} class="transition hover:text-foreground"
								>Privacy Policy</a
							>
						</li>
						<li>
							<a href={resolve('terms')} class="transition hover:text-foreground"
								>Terms of Service</a
							>
						</li>
						<li>
							<a href={resolve('refunds')} class="transition hover:text-foreground"
								>Cancellation & Refunds</a
							>
						</li>
						<li>
							<a
								href={resolve('contact')}
								class="font-medium text-foreground transition hover:text-foreground"
							>
								Contact & Support
							</a>
						</li>
					</ul>
				</div>

				<!-- Community & Developer Column (X / Twitter removed) -->
				<div>
					<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">Community</h3>
					<ul class="mt-4 space-y-2.5 text-xs">
						<li>
							<a
								href={siteConfig.socials?.github}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 transition hover:text-foreground"
							>
								<span>GitHub</span>
								<ExternalLink class="size-3 text-muted-foreground" />
							</a>
						</li>
						<li>
							<a href={resolve('test')} class="transition hover:text-foreground"
								>Developer Sandbox (/test)</a
							>
						</li>
						<li>
							<a
								href="https://yaxa.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 font-semibold text-primary transition hover:underline"
							>
								<Sparkles class="size-3" />
								<span>Built with Yaxa</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
</div>
