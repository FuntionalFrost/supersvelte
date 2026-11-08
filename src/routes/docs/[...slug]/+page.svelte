<!-- src/routes/docs/[...slug]/+page.svelte -->
<script lang="ts">
	import { ArrowLeft, ArrowRight, ChevronRight, Hash } from '@lucide/svelte';
	import { CodeBlock, Seo, generateBreadcrumbSchema } from 'yaxa-svelte';
	import { siteConfig } from '../../../site.config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

					{#if section.code}
						<CodeBlock
							code={section.code.code}
							language={section.code.lang}
							filename={section.code.filename}
							themeMode="dark"
						/>
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

			<div class="border-t border-border/60 pt-4">
				<a
					href="/api/og?title={encodeURIComponent(data.doc.title)}&badge={encodeURIComponent(
						data.doc.category
					)}"
					target="_blank"
					rel="noreferrer"
					class="text-[11px] font-semibold text-muted-foreground transition hover:text-primary"
				>
					View Social Preview Card ↗
				</a>
			</div>
		</div>
	</aside>
</div>
