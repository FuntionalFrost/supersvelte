<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { defaultMetaTags } from '$lib/config/seo';
	import { ModeWatcher } from 'mode-watcher';
	import { MetaTags } from 'svelte-meta-tags';
	import { Toaster } from 'svelte-sonner';
	import './layout.css';

	let { children } = $props();

	// Smooth page navigation with native View Transitions API
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

<!-- Global Site-Wide Meta Tags & OpenGraph -->
<MetaTags {...defaultMetaTags} />

<!-- Theme Watcher (Dark/Light mode persistence) -->
<ModeWatcher />

<!-- Global Notification Toast System -->
<Toaster position="top-right" richColors closeButton />

<div
	class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
>
	{@render children()}
</div>
