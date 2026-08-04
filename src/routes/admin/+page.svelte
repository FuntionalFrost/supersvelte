<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import {
		ArrowLeft,
		Ban,
		CircleCheck,
		Database,
		ExternalLink,
		RefreshCw,
		UserCheck,
		Users
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeSection = $state<'users' | 'studio'>('users');
	let searchFilter = $state('');
	let actionLoadingId = $state<string | null>(null);

	// Client override state for active mutations & manually refreshed lists
	let clientUsers = $state<typeof data.users | null>(null);

	// Idiomatic Svelte 5 local override: prefers client updates, falls back to server prop
	let usersList = $derived(clientUsers ?? data.users);

	let filteredUsers = $derived(
		usersList.filter(
			(u) =>
				u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
				(u.name && u.name.toLowerCase().includes(searchFilter.toLowerCase()))
		)
	);

	async function refreshUsers() {
		actionLoadingId = 'refresh';
		const res = await authClient.admin.listUsers({ query: { limit: 50 } });
		if (res.data?.users) {
			clientUsers = res.data.users as typeof data.users;
		}
		actionLoadingId = null;
	}

	async function toggleBan(userId: string, isCurrentlyBanned: boolean) {
		actionLoadingId = userId;
		if (isCurrentlyBanned) {
			await authClient.admin.unbanUser({ userId });
			toast.success('User unbanned successfully');
		} else {
			await authClient.admin.banUser({
				userId,
				banReason: 'Administrative action via /admin console'
			});
			toast.error('User has been banned');
		}
		await refreshUsers();
		actionLoadingId = null;
	}

	async function toggleRole(userId: string, currentRole: string) {
		actionLoadingId = userId;
		const newRole = currentRole === 'admin' ? 'user' : 'admin';
		await authClient.admin.setRole({ userId, role: newRole });
		toast.success('User role updated successfully');
		await refreshUsers();
		actionLoadingId = null;
	}

	async function impersonate(userId: string) {
		const res = await authClient.admin.impersonateUser({ userId });
		if (res.error) {
			toast.error(res.error?.message ?? 'An unexpected error occurred');
			return;
		}
		toast.success('Impersonating user...');
		window.location.href = '/dashboard';
	}
</script>

<div
	class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<!-- Top Header -->
	<header class="sticky top-0 z-40 border-b border-border bg-card/60 backdrop-blur-md">
		<div class="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<div class="flex items-center gap-3">
				<a
					href={resolve('/dashboard')}
					class="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
					title="Back to Dashboard"
				>
					<ArrowLeft class="size-4" />
				</a>
				<div>
					<div class="flex items-center gap-2">
						<span class="text-lg font-black">Super Svelte</span>
						<span
							class="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400"
						>
							Admin Console
						</span>
					</div>
					<p class="text-xs text-muted-foreground">Logged in as {data.user.email}</p>
				</div>
			</div>

			<button
				onclick={refreshUsers}
				disabled={actionLoadingId === 'refresh'}
				class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-xs transition hover:bg-accent disabled:opacity-50"
			>
				<RefreshCw class="size-3.5 {actionLoadingId === 'refresh' ? 'animate-spin' : ''}" />
				<span>Refresh Users</span>
			</button>
		</div>
	</header>

	<main class="container mx-auto max-w-6xl px-4 py-10">
		<!-- Navigation Tabs -->
		<div class="mb-8 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs">
			<button
				onclick={() => (activeSection = 'users')}
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all {activeSection ===
				'users'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Users class="size-4" />
				<span>Registered Users ({usersList.length})</span>
			</button>

			<button
				onclick={() => (activeSection = 'studio')}
				class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all {activeSection ===
				'studio'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Database class="size-4" />
				<span>Drizzle Studio GUI</span>
			</button>
		</div>

		<!-- SECTION: USERS MANAGEMENT TABLE -->
		{#if activeSection === 'users'}
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<input
						type="text"
						bind:value={searchFilter}
						placeholder="Filter by name or email..."
						class="w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
					/>
					<span class="text-xs text-muted-foreground">Showing {filteredUsers.length} users</span>
				</div>

				<div class="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
					<table class="w-full text-left text-xs">
						<thead class="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
							<tr>
								<th class="p-3.5">User</th>
								<th class="p-3.5">Role</th>
								<th class="p-3.5">Status</th>
								<th class="p-3.5">Joined Date</th>
								<th class="p-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border/60">
							{#each filteredUsers as user (user.id)}
								<tr class="transition hover:bg-muted/20">
									<td class="p-3.5 font-medium">
										<div>{user.name || 'No Name'}</div>
										<div class="font-mono text-[11px] text-muted-foreground">{user.email}</div>
									</td>
									<td class="p-3.5">
										<button
											onclick={() => toggleRole(user.id, user.role || 'user')}
											disabled={actionLoadingId === user.id}
											class="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20"
											title="Click to toggle Role (Admin <-> User)"
										>
											{user.role || 'user'}
										</button>
									</td>
									<td class="p-3.5">
										{#if user.banned}
											<span class="inline-flex items-center gap-1 font-semibold text-red-400">
												<Ban class="size-3" /> Banned
											</span>
										{:else}
											<span class="inline-flex items-center gap-1 font-semibold text-emerald-400">
												<CircleCheck class="size-3" /> Active
											</span>
										{/if}
									</td>
									<td class="p-3.5 font-mono text-muted-foreground">
										{new Date(user.createdAt).toLocaleDateString()}
									</td>
									<td class="p-3.5 text-right">
										<button
											onclick={() => toggleBan(user.id, !!user.banned)}
											disabled={actionLoadingId === user.id}
											class="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-semibold transition hover:bg-accent disabled:opacity-50"
										>
											{#if actionLoadingId === user.id}
												<RefreshCw class="size-3 animate-spin" />
											{:else if user.banned}
												<UserCheck class="size-3 text-emerald-400" /> Unban
											{:else}
												<Ban class="size-3 text-red-400" /> Ban User
											{/if}
										</button>
										<button
											onclick={() => impersonate(user.id)}
											class="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
											title="Log in as this user"
										>
											Impersonate
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- SECTION: DRIZZLE STUDIO -->
		{#if activeSection === 'studio'}
			<div
				class="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-8 text-center"
			>
				<Database class="mx-auto size-10 text-emerald-400" />
				<div class="space-y-1">
					<h3 class="text-base font-bold">Local Database GUI</h3>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Launch Drizzle Studio locally to visually edit Postgres rows, inspect relations, and run
						SQL queries directly on your Neon database instance.
					</p>
				</div>
				<div class="rounded-lg bg-muted/60 p-3 font-mono text-xs text-foreground">
					pnpm db:studio
				</div>
				<a
					href="https://local.drizzle.team"
					target="_blank"
					rel="external"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
				>
					<span>Open Drizzle Studio</span>
					<ExternalLink class="size-3.5" />
				</a>
			</div>
		{/if}
	</main>
</div>
