<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
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

<ModeWatcher />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div
	class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
>
	{@render children()}
</div>
