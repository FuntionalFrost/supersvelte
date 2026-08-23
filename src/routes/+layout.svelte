<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { defaultMetaTags } from '$lib/config/seo';
	import { mode, ModeWatcher } from 'mode-watcher';
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

	// Dynamically update favicon based on the active mode-watcher theme
	$effect(() => {
		const isDark = mode.current === 'dark';
		const bg = isDark ? '%23e2e8f0' : '%23090d16'; // Light badge in dark mode, dark badge in light mode
		const fg = isDark ? '%23090d16' : '%23ffffff'; // Dark text in dark mode, white text in light mode

		const svg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='9' fill='${bg}'/><text x='16' y='22.5' font-family='system-ui,-apple-system,sans-serif' font-weight='900' font-size='16' letter-spacing='-0.5px' fill='${fg}' text-anchor='middle'>S5</text></svg>`;

		const link = document.getElementById('favicon') as HTMLLinkElement | null;
		if (link) {
			link.href = svg;
		}
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
