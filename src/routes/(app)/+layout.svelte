<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background md:flex-row">
	<!-- Sidebar -->
	<aside class="flex w-full flex-col justify-between border-r border-border bg-card p-4 md:w-64">
		<div class="space-y-4">
			<div class="px-2 py-1 text-lg font-bold tracking-tight">SaaS App</div>
			<Separator />
			<nav class="space-y-1">
				<a
					href={resolve('/dashboard')}
					class="block rounded-md px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent"
				>
					Dashboard
				</a>
				<a
					href={resolve('/test')}
					class="block rounded-md px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent"
				>
					Diagnostics (/test)
				</a>
			</nav>
		</div>

		<!-- User Profile & Sign Out -->
		<div class="flex items-center justify-between border-t border-border pt-4">
			<div class="truncate text-xs">
				<p class="truncate font-medium">{data.user.name ?? 'User'}</p>
				<p class="truncate text-muted-foreground">{data.user.email}</p>
			</div>
			<form method="POST" action="/test?/signOut" use:enhance>
				<Button
					variant="ghost"
					size="sm"
					type="submit"
					class="text-xs text-destructive hover:text-destructive"
				>
					Exit
				</Button>
			</form>
		</div>
	</aside>

	<!-- Main View -->
	<main class="flex-1 p-6 md:p-8">
		{@render children()}
	</main>
</div>
