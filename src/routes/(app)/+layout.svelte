<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Activity, CreditCard, LayoutDashboard, LogOut, Users } from '@lucide/svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background md:flex-row">
	<!-- Sidebar -->
	<aside class="flex w-full flex-col justify-between border-r border-border bg-card p-4 md:w-64">
		<div class="space-y-4">
			<div class="px-2 py-1 text-lg font-bold tracking-tight text-foreground">SuperSvelte</div>
			<Separator />
			<nav class="space-y-1">
				<a
					href={resolve('/dashboard')}
					class="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent"
				>
					<LayoutDashboard class="size-4 text-primary" />
					<span>Dashboard</span>
				</a>
				<a
					href={resolve('/dashboard/billing')}
					class="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent"
				>
					<CreditCard class="size-4 text-primary" />
					<span>Billing & Plan</span>
				</a>
				<a
					href={resolve('/settings/team')}
					class="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent"
				>
					<Users class="size-4 text-primary" />
					<span>Team & Workspaces</span>
				</a>
				<a
					href={resolve('/test')}
					class="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
				>
					<Activity class="size-4 text-cyan-400" />
					<span>Diagnostics (/test)</span>
				</a>
			</nav>
		</div>

		<!-- User Profile & Sign Out (Production Safe Action) -->
		<div class="flex items-center justify-between border-t border-border pt-4">
			<div class="truncate text-xs">
				<p class="truncate font-semibold text-foreground">{data.user.name ?? 'User'}</p>
				<p class="truncate text-muted-foreground">{data.user.email}</p>
			</div>
			<form method="POST" action="/dashboard?/signOut" use:enhance>
				<Button
					variant="ghost"
					size="sm"
					type="submit"
					class="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
					title="Sign Out"
				>
					<LogOut class="size-3.5" />
				</Button>
			</form>
		</div>
	</aside>

	<!-- Main View -->
	<main class="flex-1 p-6 md:p-8">
		{@render children()}
	</main>
</div>
