<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import TeamSwitcher from '$lib/components/TeamSwitcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Activity, CreditCard, LayoutDashboard, LogOut, Users } from '@lucide/svelte';

	let { data, children } = $props();

	const navItems = [
		{ href: resolve('/dashboard'), label: 'Dashboard', icon: LayoutDashboard },
		{ href: resolve('/dashboard/billing'), label: 'Billing & Plan', icon: CreditCard },
		{ href: resolve('/settings/team'), label: 'Team & Workspaces', icon: Users },
		{ href: resolve('/test'), label: 'Diagnostics (/test)', icon: Activity, accent: true }
	];
</script>

<div class="flex min-h-screen flex-col bg-background md:flex-row">
	<!-- Sidebar -->
	<aside
		class="flex w-full flex-col justify-between border-r border-border bg-card p-4 md:min-h-screen md:w-64"
	>
		<div class="space-y-4">
			<!-- Workspace / Team Selector -->
			<div class="pb-1">
				<TeamSwitcher />
			</div>

			<Separator />

			<!-- Navigation Links -->
			<nav class="space-y-1">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href}
					<a
						href={item.href}
						class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors {isActive
							? 'bg-primary/10 font-bold text-primary'
							: item.accent
								? 'text-muted-foreground hover:bg-accent hover:text-foreground'
								: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
					>
						<item.icon
							class="size-4 {isActive
								? 'text-primary'
								: item.accent
									? 'text-cyan-400'
									: 'text-muted-foreground'}"
						/>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>

		<!-- User Profile & Sign Out -->
		<div class="flex items-center justify-between border-t border-border pt-4">
			<div class="min-w-0 flex-1 truncate pr-2 text-xs">
				<p class="truncate font-semibold text-foreground">{data.user?.name ?? 'Developer'}</p>
				<p class="truncate text-muted-foreground">{data.user?.email ?? ''}</p>
			</div>
			<form method="POST" action="/dashboard?/signOut" use:enhance>
				<Button
					variant="ghost"
					size="sm"
					type="submit"
					class="size-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
					title="Sign Out"
				>
					<LogOut class="size-4" />
				</Button>
			</form>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex-1 p-6 md:p-8">
		{@render children()}
	</main>
</div>
