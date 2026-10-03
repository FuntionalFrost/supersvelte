<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from 'yaxa-svelte';
	import { Activity, ArrowRight, CreditCard, ShieldCheck, Users } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<!-- src/routes/(app)/dashboard/+page.svelte -->

<div class="mx-auto max-w-5xl space-y-8 p-4 md:p-6">
	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b border-border pb-5">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
			<p class="text-xs text-muted-foreground">
				Welcome back, <span class="font-semibold text-foreground">
					{data.user?.name || data.user?.email}
				</span>!
			</p>
		</div>

		<form method="POST" action="?/signOut" use:enhance>
			<Button variant="outline" size="sm" type="submit" class="text-xs font-semibold">
				Sign Out
			</Button>
		</form>
	</div>

	<!-- Active Session Banner -->
	<div
		class="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-xs"
	>
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<ShieldCheck class="size-4 text-emerald-500" />
				<span class="text-xs font-bold text-foreground">Session Status: Active</span>
			</div>
			<p class="font-mono text-[11px] text-muted-foreground">User ID: {data.user?.id}</p>
		</div>
	</div>

	<!-- Quick Action Navigation Grid -->
	<div class="grid gap-4 sm:grid-cols-3">
		<a
			href={resolve('dashboard/billing')}
			class="group flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-accent/30"
		>
			<div class="space-y-2">
				<CreditCard class="size-5 text-primary" />
				<h3 class="text-sm font-bold text-foreground">Billing & Licences</h3>
				<p class="text-xs text-muted-foreground">
					Manage Polar subscriptions, view invoices, or upgrade plans.
				</p>
			</div>
			<div
				class="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
			>
				<span>Manage Billing</span>
				<ArrowRight class="size-3" />
			</div>
		</a>

		<a
			href={resolve('settings/team')}
			class="group flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-accent/30"
		>
			<div class="space-y-2">
				<Users class="size-5 text-indigo-400" />
				<h3 class="text-sm font-bold text-foreground">Team Workspaces</h3>
				<p class="text-xs text-muted-foreground">
					Invite teammates, manage roles, and create organizations.
				</p>
			</div>
			<div
				class="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
			>
				<span>Manage Workspaces</span>
				<ArrowRight class="size-3" />
			</div>
		</a>

		<a
			href={resolve('test')}
			class="group flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:bg-accent/30"
		>
			<div class="space-y-2">
				<Activity class="size-5 text-cyan-400" />
				<h3 class="text-sm font-bold text-foreground">System Diagnostics</h3>
				<p class="text-xs text-muted-foreground">
					Test live Hono RPC, Drizzle DB queries, UploadThing, and SSE streams.
				</p>
			</div>
			<div
				class="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
			>
				<span>Run Benchmarks</span>
				<ArrowRight class="size-3" />
			</div>
		</a>
	</div>
</div>
