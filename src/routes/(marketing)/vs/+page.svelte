<!-- src/routes/(marketing)/vs/+page.svelte -->
<script lang="ts">
	import SuperSvelteVsOthers from '$lib/components/SuperSvelteVsOthers.svelte';
</script>

<svelte:head>
	<title>SuperSvelte vs Supastarter & Epic Stack | Performance Benchmark</title>
	<meta
		name="description"
		content="Compare SuperSvelte against Supastarter and Epic Stack. See why Svelte 5 Runes and Hono RPC deliver zero-codegen type safety and 90% smaller client JS bundles."
	/>
</svelte:head>

<div class="container mx-auto max-w-5xl space-y-12 px-4 py-16">
	<div class="space-y-3 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight text-foreground">Architectural Comparison</h1>
		<p class="mx-auto max-w-xl text-sm text-muted-foreground">
			See how Svelte 5 Runes, 0-codegen Hono RPC, and Neon PostgreSQL compare to React, Remix, and
			legacy SvelteKit boilerplates.
		</p>
	</div>

	<SuperSvelteVsOthers />
</div>
