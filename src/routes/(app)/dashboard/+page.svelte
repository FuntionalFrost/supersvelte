<!-- src/routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl space-y-6 p-8">
	<div class="flex items-center justify-between border-b border-border pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
			<p class="text-sm text-muted-foreground">
				Welcome back, {data.user.name ?? data.user.email}!
			</p>
		</div>

		<!-- Sign Out Action -->
		<form method="POST" action="/test?/signOut" use:enhance>
			<Button variant="outline" size="sm" type="submit">Sign Out</Button>
		</form>
	</div>

	<div class="space-y-2 rounded-xl border border-border bg-card p-6">
		<p class="text-sm font-medium">
			Session Status: <span class="font-bold text-emerald-500">Active</span>
		</p>
		<p class="font-mono text-xs text-muted-foreground">User ID: {data.user.id}</p>
	</div>
</div>
