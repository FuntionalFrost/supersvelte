<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '#lib/auth-client.js';
	import { CircleAlert, CircleCheck, Lock, ShieldCheck } from '@lucide/svelte';
	import { onMount } from 'svelte';

	type UserData = { id: string; email: string; name?: string | null };

	let { initialUser = null } = $props<{ initialUser?: UserData | null }>();

	// Initialize with literal defaults to avoid capturing prop references locally
	let session = $state<{ user: UserData } | null>(null);
	let authLoading = $state(true);

	// Synchronize whenever initialUser prop changes
	$effect(() => {
		if (initialUser) {
			session = { user: initialUser };
			authLoading = false;
		}
	});

	onMount(() => {
		authClient.getSession().then((res) => {
			if (res.data) session = res.data as { user: UserData };
			authLoading = false;
		});
	});
</script>

<div class="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
	<div class="flex items-center justify-between border-b border-border pb-4">
		<div class="flex items-center gap-2">
			<ShieldCheck class="size-5 text-indigo-400" />
			<div>
				<h3 class="text-sm font-bold">Better Auth Session Diagnostics</h3>
				<p class="text-xs text-muted-foreground">
					Inspect active session token state & cookie context
				</p>
			</div>
		</div>

		<div>
			{#if session}
				<span
					class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500"
				>
					<CircleCheck class="size-3" /> Authenticated
				</span>
			{:else}
				<span
					class="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500"
				>
					<CircleAlert class="size-3" /> Guest Mode
				</span>
			{/if}
		</div>
	</div>

	{#if authLoading}
		<div class="animate-pulse py-8 text-center text-xs text-muted-foreground">
			Reading session state from cookies...
		</div>
	{:else if session}
		<div class="space-y-4">
			<div class="space-y-2 rounded-lg bg-muted/50 p-4 font-mono text-xs">
				<div class="flex justify-between">
					<span class="text-muted-foreground">User ID:</span><span
						class="font-semibold text-foreground">{session.user.id}</span
					>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Email:</span><span
						class="font-semibold text-foreground">{session.user.email}</span
					>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Name:</span><span
						class="font-semibold text-foreground">{session.user.name || 'N/A'}</span
					>
				</div>
			</div>
			<a
				href={resolve('dashboard')}
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
			>
				<span>Enter Protected App Area</span>
			</a>
		</div>
	{:else}
		<div class="space-y-4 py-4 text-center">
			<p class="mx-auto max-w-sm text-xs text-muted-foreground">
				No active authentication session detected. Sign in to test protected queries.
			</p>
			<a
				href={resolve('login')}
				class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
			>
				<Lock class="size-3.5" />
				<span>Go to Auth Login Route</span>
			</a>
		</div>
	{/if}
</div>
