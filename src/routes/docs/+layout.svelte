<!-- src/routes/docs/+layout.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Input } from '$lib/components/ui/input';
	import { BookOpen, ExternalLink, Menu, Search, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let searchQuery = $state('');
	let mobileOpen = $state(false);

	const currentPath = $derived(page.url.pathname);

	// Filter categories based on search query
	const filteredCategories = $derived.by(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return data.categories;

		const result: Record<string, (typeof data.categories)[string]> = {};
		for (const [cat, docs] of Object.entries(data.categories)) {
			const matched = docs.filter(
				(d) =>
					d.title.toLowerCase().includes(q) ||
					d.description.toLowerCase().includes(q) ||
					d.sections.some(
						(s) => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
					)
			);
			if (matched.length > 0) {
				result[cat] = matched;
			}
		}
		return result;
	});
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- Top Documentation Header -->
	<header
		class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md"
	>
		<div class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
			<div class="flex items-center gap-3">
				<!-- Mobile Menu Button -->
				<button
					onclick={() => (mobileOpen = !mobileOpen)}
					class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted md:hidden"
					aria-label="Toggle navigation"
				>
					{#if mobileOpen}
						<X class="size-5" />
					{:else}
						<Menu class="size-5" />
					{/if}
				</button>

				<!-- Brand Logo -->
				<a href={resolve('/')} class="flex items-center gap-2.5 transition hover:opacity-90">
					<div
						class="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground"
					>
						S5
					</div>
					<span class="text-base font-extrabold tracking-tight">
						Super<span class="text-primary">Svelte</span>
					</span>
					<span
						class="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary"
					>
						DOCS
					</span>
				</a>
			</div>

			<!-- Search Bar -->
			<div class="hidden max-w-xs flex-1 px-4 sm:block">
				<div class="relative">
					<Search class="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search documentation..."
						bind:value={searchQuery}
						class="h-8 pl-8 text-xs"
					/>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-3">
				<ThemeToggle />
				<a
					href={resolve('/dashboard')}
					class="hidden text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:inline-block"
				>
					Dashboard
				</a>
				<a
					href="https://github.com/FunctionalFrost/supersvelte"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted"
				>
					<span>GitHub</span>
					<ExternalLink class="size-3 text-muted-foreground" />
				</a>
			</div>
		</div>
	</header>

	<div class="container mx-auto flex max-w-7xl flex-1 px-4 sm:px-6">
		<!-- Sidebar Desktop -->
		<aside class="hidden w-64 shrink-0 border-r border-border/60 py-8 pr-6 md:block">
			<nav class="sticky top-24 space-y-6">
				{#each Object.entries(filteredCategories) as [category, docs] (category)}
					<div class="space-y-2">
						<h4 class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
							{category}
						</h4>
						<ul class="space-y-1">
							{#each docs as doc (doc.slug)}
								{@const active = currentPath === `/docs/${doc.slug}`}
								<li>
									<a
										href="/docs/{doc.slug}"
										class="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition {active
											? 'bg-primary/10 font-bold text-primary'
											: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
									>
										<span>{doc.title}</span>
										{#if doc.badge}
											<span
												class="py-0.2 rounded-full bg-muted px-1.5 text-[9px] font-semibold text-muted-foreground"
											>
												{doc.badge}
											</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>
		</aside>

		<!-- Mobile Drawer -->
		{#if mobileOpen}
			<div class="fixed inset-0 z-50 bg-background/95 p-6 backdrop-blur-md md:hidden">
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<BookOpen class="size-5 text-primary" />
						<h3 class="text-sm font-bold">Documentation Index</h3>
					</div>
					<button
						onclick={() => (mobileOpen = false)}
						class="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
					>
						<X class="size-5" />
					</button>
				</div>

				<div class="mb-4">
					<Input
						type="text"
						placeholder="Search documentation..."
						bind:value={searchQuery}
						class="text-xs"
					/>
				</div>

				<nav class="max-h-[75vh] space-y-6 overflow-y-auto">
					{#each Object.entries(filteredCategories) as [category, docs] (category)}
						<div class="space-y-2">
							<h4 class="text-xs font-bold text-muted-foreground uppercase">{category}</h4>
							<ul class="space-y-1">
								{#each docs as doc (doc.slug)}
									{@const active = currentPath === `/docs/${doc.slug}`}
									<li>
										<a
											href="/docs/{doc.slug}"
											onclick={() => (mobileOpen = false)}
											class="block rounded-lg px-3 py-2 text-xs font-medium transition {active
												? 'bg-primary/10 font-bold text-primary'
												: 'text-muted-foreground hover:bg-muted'}"
										>
											{doc.title}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</nav>
			</div>
		{/if}

		<!-- Main Reading Area -->
		<main class="min-w-0 flex-1 py-8 md:pl-10">
			{@render children()}
		</main>
	</div>
</div>
