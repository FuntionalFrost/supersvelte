<script lang="ts">
	import { browser } from '$app/env';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { CommandPalette, theme, YaxaApp } from 'yaxa-svelte';
	import { siteConfig } from '../site.config';
	import type { LayoutServerData } from './$types';
	import './layout.css';

	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();

	let isCommandPaletteOpen = $state(false);

	// Dynamically update site favicon on theme changes
	$effect(() => {
		if (!browser) return;
		const isDark = theme.resolvedTheme === 'dark';
		const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
		if (favicon) {
			favicon.href = isDark ? '/favicon-dark.svg' : '/favicon-light.svg';
		}
	});

	const commandItems = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			description: 'Overview & metrics',
			href: resolve('dashboard'),
			group: 'Navigation',
			icon: 'home' as const,
			shortcut: 'D'
		},
		{
			id: 'billing',
			label: 'Billing & Plan',
			description: 'Manage subscriptions & Polar licenses',
			href: resolve('dashboard/billing'),
			group: 'Navigation',
			icon: 'credit-card' as const,
			shortcut: 'B'
		},
		{
			id: 'team',
			label: 'Team & Workspaces',
			description: 'Manage workspace members',
			href: resolve('settings/team'),
			group: 'Navigation',
			icon: 'users' as const
		},
		{
			id: 'admin',
			label: 'Admin Console',
			description: 'Auto-introspecting Drizzle CRUD',
			href: resolve('admin'),
			group: 'Administration',
			icon: 'shield' as const,
			shortcut: 'A'
		},
		{
			id: 'diagnostics',
			label: 'Diagnostics & Sandbox',
			description: 'Test S3, Email, Auth, Rate limits',
			href: resolve('test'),
			group: 'Developer',
			icon: 'sparkles' as const,
			shortcut: 'T'
		},
		{
			id: 'docs',
			label: 'Documentation',
			description: 'Read SuperSvelte architecture guides',
			href: resolve('docs'),
			group: 'Developer',
			icon: 'document' as const
		},
		{
			id: 'contact',
			label: 'Contact & Support',
			description: 'Maintainer email & help inquiries',
			href: resolve('contact'),
			group: 'Help',
			icon: 'mail' as const
		},
		{
			id: 'theme-studio',
			label: 'Theme Studio',
			description: 'Interactive visual design token editor',
			href: `${resolve('test')}?tab=theme`,
			group: 'Developer',
			icon: 'sparkles' as const
		},
		{
			id: 'toggle-theme',
			label: 'Toggle Dark / Light Mode',
			description: 'Switch application color theme',
			onSelect: () => theme.toggle(),
			group: 'Preferences',
			icon: 'sun' as const
		},
		{
			id: 'accent-svelte',
			label: 'Accent: Svelte Flame',
			description: 'Signature Svelte fiery orange palette',
			onSelect: () => theme.setAccent('svelte'),
			group: 'Preferences',
			icon: 'sparkles' as const
		},
		{
			id: 'accent-emerald',
			label: 'Accent: Emerald Mint',
			description: 'Crisp, modern green palette',
			onSelect: () => theme.setAccent('emerald'),
			group: 'Preferences',
			icon: 'sparkles' as const
		},
		{
			id: 'accent-sky',
			label: 'Accent: Sky Blue',
			description: 'Clean, radiant cyan palette',
			onSelect: () => theme.setAccent('sky'),
			group: 'Preferences',
			icon: 'sparkles' as const
		},
		{
			id: 'accent-violet',
			label: 'Accent: Violet Dream',
			description: 'Elegant deep purple palette',
			onSelect: () => theme.setAccent('violet'),
			group: 'Preferences',
			icon: 'sparkles' as const
		},
		{
			id: 'accent-amber',
			label: 'Accent: Sunset Amber',
			description: 'Warm gold-amber palette',
			onSelect: () => theme.setAccent('amber'),
			group: 'Preferences',
			icon: 'sparkles' as const
		},
		{
			id: 'accent-rose',
			label: 'Accent: Rose Pink',
			description: 'Vibrant punchy red-rose palette',
			onSelect: () => theme.setAccent('rose'),
			group: 'Preferences',
			icon: 'sparkles' as const
		}
	];

	// Smooth page navigation with native View Transitions API
	onNavigate((navigation) => {
		if (navigation.shallow) return;
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<!-- src/routes/+layout.svelte -->

<YaxaApp config={siteConfig} user={data.user}>
	<!-- Global Command Palette (Cmd+K / Ctrl+K) -->
	<CommandPalette bind:open={isCommandPaletteOpen} items={commandItems} />

	<div
		class="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
	>
		{@render children()}
	</div>
</YaxaApp>
