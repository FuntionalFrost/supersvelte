<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import './layout.css';

	let { children } = $props();

	// Seamless View Transitions on every page navigation
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

<!-- Dark / Light theme watcher -->
<ModeWatcher />

<!-- Global Toast Notification Engine -->
<Toaster position="top-right" richColors closeButton />

<!-- Render route content -->
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
	class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
>
	{@render children()}
</div>
