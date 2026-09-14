<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { defaultMetaTags } from '$lib/config/seo';
	import { mode, ModeWatcher, toggleMode } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { Toaster } from 'svelte-sonner';
	import { CommandPalette } from 'yaxa-svelte';
	import './layout.css';

	let { children }: { children: Snippet } = $props();

	let isCommandPaletteOpen = $state(false);

	const commandItems = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			description: 'Overview & metrics',
			href: resolve('/dashboard'),
			group: 'Navigation',
			icon: 'home' as const,
			shortcut: 'D'
		},
		{
			id: 'billing',
			label: 'Billing & Plan',
			description: 'Manage subscriptions & Polar licenses',
			href: resolve('/dashboard/billing'),
			group: 'Navigation',
			icon: 'credit-card' as const,
			shortcut: 'B'
		},
		{
			id: 'team',
			label: 'Team & Workspaces',
			description: 'Manage workspace members',
			href: resolve('/settings/team'),
			group: 'Navigation',
			icon: 'users' as const
		},
		{
			id: 'admin',
			label: 'Admin Console',
			description: 'Auto-introspecting Drizzle CRUD',
			href: resolve('/admin'),
			group: 'Administration',
			icon: 'shield' as const,
			shortcut: 'A'
		},
		{
			id: 'diagnostics',
			label: 'Diagnostics & Sandbox',
			description: 'Test S3, Email, Auth, Rate limits',
			href: resolve('/test'),
			group: 'Developer',
			icon: 'sparkles' as const,
			shortcut: 'T'
		},
		{
			id: 'docs',
			label: 'Documentation',
			description: 'Read SuperSvelte architecture guides',
			href: resolve('/docs'),
			group: 'Developer',
			icon: 'document' as const
		},
		{
			id: 'toggle-theme',
			label: 'Toggle Dark / Light Mode',
			description: 'Switch application color theme',
			onSelect: () => toggleMode(),
			group: 'Preferences',
			icon: 'sun' as const
		}
	];

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
		const bg = isDark ? '%23e2e8f0' : '%23090d16';
		const fg = isDark ? '%23090d16' : '%23ffffff';

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

<!-- Global Command Palette (Cmd+K / Ctrl+K) -->
<CommandPalette bind:open={isCommandPaletteOpen} items={commandItems} />

<div
	class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
>
	{@render children()}
</div>
