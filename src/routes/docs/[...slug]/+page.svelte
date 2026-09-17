<!-- src/routes/docs/[...slug]/+page.svelte -->
<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ChevronRight, Copy, FileCode, Hash } from '@lucide/svelte';
	import { Seo, generateBreadcrumbSchema } from 'yaxa-svelte';
	import { toast } from 'svelte-sonner';
	import { siteConfig } from '../../../site.config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let copiedSectionId = $state<string | null>(null);

	async function copyCode(code: string, id: string) {
		await navigator.clipboard.writeText(code);
		copiedSectionId = id;
		toast.success('Code copied to clipboard!');
		setTimeout(() => {
			if (copiedSectionId === id) copiedSectionId = null;
		}, 2000);
	}

	const breadcrumbSchema = $derived(
		generateBreadcrumbSchema(siteConfig, [
			{ name: 'Docs', url: `${siteConfig.url}/docs` },
			{ name: data.doc.category, url: `${siteConfig.url}/docs/${data.doc.slug}` },
			{ name: data.doc.title, url: `${siteConfig.url}/docs/${data.doc.slug}` }
		])
	);
</script>

<Seo
	title="{data.doc.title} — SuperSvelte Docs"
	description={data.doc.description}
	ogImage={{
		title: data.doc.title,
		description: data.doc.description,
		badge: data.doc.category
	}}
	schema={breadcrumbSchema}
/>

<div class="flex gap-10">
	<!-- Article Main Content -->
	<article class="min-w-0 flex-1 space-y-10">
		<!-- Breadcrumbs -->
		<nav class="flex items-center gap-1.5 text-xs text-muted-foreground">
			<a href="/docs/getting-started/introduction" class="hover:text-foreground">Docs</a>
			<ChevronRight class="size-3" />
			<span>{data.doc.category}</span>
			<ChevronRight class="size-3" />
			<span class="font-semibold text-foreground">{data.doc.title}</span>
		</nav>

		<!-- Title Header -->
		<div class="space-y-3 border-b border-border/60 pb-6">
			{#if data.doc.badge}
				<span
					class="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase"
				>
					{data.doc.badge}
				</span>
			{/if}
			<h1 class="text-3xl font-black tracking-tight sm:text-4xl">
				{data.doc.title}
			</h1>
			<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
				{data.doc.description}
			</p>
		</div>

		<!-- Sections Content -->
		<div class="space-y-10">
			{#each data.sections as section (section.id)}
				<section id={section.id} class="scroll-mt-24 space-y-4">
					<div class="flex items-center gap-2">
						<a
							href="#{section.id}"
							class="group flex items-center gap-1.5 text-lg font-bold text-foreground hover:text-primary sm:text-xl"
						>
							<Hash class="size-4 text-primary opacity-0 transition group-hover:opacity-100" />
							<span>{section.heading}</span>
						</a>
					</div>

					<p class="text-sm leading-relaxed text-muted-foreground">
						{section.body}
					</p>

					{#if section.code && section.highlightedCode}
						<div class="overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-xs">
							<!-- Code Header -->
							<div
								class="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground"
							>
								<div class="flex items-center gap-2 font-mono text-[11px]">
									<FileCode class="size-3.5 text-primary" />
									<span class="font-semibold text-zinc-300">
										{section.code.filename || section.code.lang}
									</span>
								</div>
								<button
									onclick={() => copyCode(section.code!.code, section.id)}
									class="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition hover:bg-white/10 hover:text-white"
									title="Copy Code"
								>
									{#if copiedSectionId === section.id}
										<Check class="size-3 text-emerald-400" />
										<span class="text-emerald-400">Copied</span>
									{:else}
										<Copy class="size-3" />
										<span>Copy</span>
									{/if}
								</button>
							</div>

							<!-- Pre-highlighted Shiki Output -->
							<div
								class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200 [&>pre]:bg-transparent! [&>pre]:p-0!"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html section.highlightedCode}
							</div>
						</div>
					{/if}
				</section>
			{/each}
		</div>

		<!-- Footer Pagination (Prev / Next) -->
		<div class="grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
			{#if data.prevDoc}
				<a
					href="/docs/{data.prevDoc.slug}"
					class="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:bg-accent/30"
				>
					<div class="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
						<ArrowLeft class="size-3 transition group-hover:-translate-x-1" />
						<span>Previous Article</span>
					</div>
					<span class="mt-2 text-sm font-bold text-foreground group-hover:text-primary">
						{data.prevDoc.title}
					</span>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if data.nextDoc}
				<a
					href="/docs/{data.nextDoc.slug}"
					class="group flex flex-col items-end justify-between rounded-xl border border-border bg-card p-4 text-right transition hover:border-primary/50 hover:bg-accent/30"
				>
					<div class="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
						<span>Next Article</span>
						<ArrowRight class="size-3 transition group-hover:translate-x-1" />
					</div>
					<span class="mt-2 text-sm font-bold text-foreground group-hover:text-primary">
						{data.nextDoc.title}
					</span>
				</a>
			{/if}
		</div>
	</article>

	<!-- Right Sidebar: On This Page (TOC) -->
	<aside class="hidden w-52 shrink-0 xl:block">
		<div class="sticky top-24 space-y-3">
			<h4 class="text-xs font-bold tracking-wider text-foreground uppercase">On this page</h4>
			<ul class="space-y-2 text-xs">
				{#each data.sections as section (section.id)}
					<li>
						<a
							href="#{section.id}"
							class="line-clamp-1 text-muted-foreground transition hover:text-foreground"
						>
							{section.heading}
						</a>
					</li>
				{/each}
			</ul>

			<div class="border-t border-border/40 pt-4">
				<a
					href="/api/og?title={encodeURIComponent(data.doc.title)}"
					target="_blank"
					class="text-[11px] font-medium text-primary hover:underline"
				>
					View Social Preview Card ↗
				</a>
			</div>
		</div>
	</aside>
</div>
