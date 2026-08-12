<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import SEO from '$lib/components/SEO.svelte';
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
	{@render children()}
</div>
