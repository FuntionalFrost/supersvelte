<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toggleMode } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import { CommandPalette, YaxaApp } from 'yaxa-svelte';
	import { siteConfig } from '../site.config';
	import type { LayoutServerData } from './$types';
	import './layout.css';

	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();

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
</script>

<YaxaApp config={siteConfig} user={data.user}>
	<!-- Global Command Palette (Cmd+K / Ctrl+K) -->
	<CommandPalette bind:open={isCommandPaletteOpen} items={commandItems} />

	<div
		class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
	>
		{@render children()}
	</div>
</YaxaApp>
