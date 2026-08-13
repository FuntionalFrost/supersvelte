<!-- src/lib/components/SEO.svelte -->
<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		title?: string;
		description?: string;
		type?: 'website' | 'article';
		image?: string;
		publishDate?: string;
	}

	let {
		title = 'SuperSvelte | The Batteries-Included Edge Svelte 5 Framework',
		description = 'Launch Svelte 5 apps in hours with Better Auth, Drizzle, Neon Postgres, Upstash Redis, and OpenAPI Hono RPC.',
		type = 'website',
		image,
		publishDate
	}: Props = $props();

	let siteUrl = $derived(page.url.origin);
	let canonicalUrl = $derived(page.url.href);

	let fullTitle = $derived(title.includes('SuperSvelte') ? title : `${title} — SuperSvelte`);

	// Fallback to dynamic SVG OG image endpoint if no explicit image is provided
	let ogImageUrl = $derived(
		image ||
			`${siteUrl}/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`
	);
</script>

<svelte:head>
	<!-- Primary Search Meta -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook / LinkedIn -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:site_name" content="SuperSvelte" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />

	{#if publishDate}
		<meta property="article:published_time" content={publishDate} />
	{/if}
</svelte:head>
