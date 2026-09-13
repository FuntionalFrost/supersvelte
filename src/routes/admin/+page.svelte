<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import {
		ArrowLeft,
		Ban,
		Building2,
		CircleCheck,
		CreditCard,
		Database,
		ExternalLink,
		FileText,
		FolderGit2,
		Pencil,
		RefreshCw,
		Search,
		Trash2,
		UserCheck,
		Users,
		X
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchInput = $state(page.url.searchParams.get('search') || '');
	let actionLoadingId = $state<string | null>(null);
	let selectedRecord = $state<Record<string, unknown> | null>(null);
	let isEditModalOpen = $state(false);

	// Map entity keys to Lucide icons
	function getEntityIcon(key: string) {
		switch (key) {
			case 'users':
				return Users;
			case 'organizations':
				return Building2;
			case 'purchases':
				return CreditCard;
			case 'customers':
				return UserCheck;
			case 'projects':
				return FolderGit2;
			case 'files':
				return FileText;
			default:
				return Database;
		}
	}

	function switchEntity(key: string) {
		const url = new URL(page.url);
		url.searchParams.set('entity', key);
		url.searchParams.set('page', '1');
		url.searchParams.delete('search');
		searchInput = '';
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		const url = new URL(page.url);
		if (searchInput.trim()) {
			url.searchParams.set('search', searchInput.trim());
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.set('page', '1');
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function handleSort(colName: string) {
		const url = new URL(page.url);
		const currentSortBy = url.searchParams.get('sortBy');
		const currentOrder = url.searchParams.get('sortOrder') || 'desc';

		if (currentSortBy === colName) {
			url.searchParams.set('sortOrder', currentOrder === 'asc' ? 'desc' : 'asc');
		} else {
			url.searchParams.set('sortBy', colName);
			url.searchParams.set('sortOrder', 'asc');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function goToPage(newPage: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(newPage));
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function openEditModal(record: Record<string, unknown>) {
		selectedRecord = { ...record };
		isEditModalOpen = true;
	}

	function closeEditModal() {
		selectedRecord = null;
		isEditModalOpen = false;
	}

	// Better-Auth User Actions
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
		actionLoadingId = null;
		goto(page.url.toString(), { invalidateAll: true });
	}

	async function toggleRole(userId: string, currentRole: string) {
		actionLoadingId = userId;
		const newRole = currentRole === 'admin' ? 'user' : 'admin';
		await authClient.admin.setRole({ userId, role: newRole });
		toast.success(`User role updated to ${newRole}`);
		actionLoadingId = null;
		goto(page.url.toString(), { invalidateAll: true });
	}

	async function impersonate(userId: string) {
		const res = await authClient.admin.impersonateUser({ userId });
		if (res.error) {
			toast.error(res.error?.message ?? 'An unexpected error occurred');
			return;
		}
		toast.success('Impersonating user...');
		window.location.href = resolve('/dashboard');
	}

	async function deleteRecord(id: string) {
		if (!confirm(`Are you sure you want to delete this ${data.activeEntityKey} record (${id})?`)) {
			return;
		}

		actionLoadingId = id;
		const formData = new FormData();
		formData.set('_entityKey', data.activeEntityKey);
		formData.set('_id', id);

		const res = await fetch('?/deleteRecord', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			toast.success('Record deleted successfully');
			goto(page.url.toString(), { invalidateAll: true });
		} else {
			toast.error('Failed to delete record');
		}
		actionLoadingId = null;
	}

	async function saveRecord(e: SubmitEvent) {
		e.preventDefault();
		if (!selectedRecord) return;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const res = await fetch('?/updateRecord', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			toast.success('Record updated successfully');
			closeEditModal();
			goto(page.url.toString(), { invalidateAll: true });
		} else {
			toast.error('Failed to update record');
		}
	}
</script>

<div
	class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<!-- Top Header -->
	<header class="sticky top-0 z-40 border-b border-border bg-card/70 backdrop-blur-md">
		<div class="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
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
						<span class="text-base font-black">SuperSvelte</span>
						<span
							class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
						>
							Auto-Introspecting Admin
						</span>
					</div>
					<p class="text-xs text-muted-foreground">Admin: {data.user.email}</p>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<button
					onclick={() => goto(page.url.toString(), { invalidateAll: true })}
					class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-xs transition hover:bg-accent"
				>
					<RefreshCw class="size-3.5" />
					<span>Sync</span>
				</button>
			</div>
		</div>
	</header>

	<main class="container mx-auto max-w-7xl space-y-6 px-4 py-8">
		<!-- Summary Metric Cards -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
				<div class="flex items-center justify-between text-muted-foreground">
					<span class="text-xs font-medium">Total Users</span>
					<Users class="size-4 text-primary" />
				</div>
				<div class="mt-2 text-2xl font-bold">{data.stats.users}</div>
			</div>
			<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
				<div class="flex items-center justify-between text-muted-foreground">
					<span class="text-xs font-medium">Organizations</span>
					<Building2 class="size-4 text-emerald-400" />
				</div>
				<div class="mt-2 text-2xl font-bold">{data.stats.organizations}</div>
			</div>
			<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
				<div class="flex items-center justify-between text-muted-foreground">
					<span class="text-xs font-medium">Purchases</span>
					<CreditCard class="size-4 text-amber-400" />
				</div>
				<div class="mt-2 text-2xl font-bold">{data.stats.purchases}</div>
			</div>
			<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
				<div class="flex items-center justify-between text-muted-foreground">
					<span class="text-xs font-medium">Projects</span>
					<FolderGit2 class="size-4 text-violet-400" />
				</div>
				<div class="mt-2 text-2xl font-bold">{data.stats.projects}</div>
			</div>
			<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
				<div class="flex items-center justify-between text-muted-foreground">
					<span class="text-xs font-medium">Stored Files</span>
					<FileText class="size-4 text-sky-400" />
				</div>
				<div class="mt-2 text-2xl font-bold">{data.stats.files}</div>
			</div>
		</div>

		<!-- Entity Navigation Tabs -->
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
			<div class="flex flex-wrap gap-1.5">
				{#each data.entityTabs as tab (tab.key)}
					{@const Icon = getEntityIcon(tab.key)}
					<button
						onclick={() => switchEntity(tab.key)}
						class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {data.activeEntityKey ===
						tab.key
							? 'bg-primary text-primary-foreground shadow-xs'
							: 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'}"
					>
						<Icon class="size-3.5" />
						<span>{tab.label}</span>
					</button>
				{/each}

				<a
					href="https://local.drizzle.team"
					target="_blank"
					rel="external"
					class="flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
				>
					<Database class="size-3.5 text-emerald-400" />
					<span>Drizzle Studio</span>
					<ExternalLink class="size-3" />
				</a>
			</div>

			<!-- Search Filter -->
			<form onsubmit={handleSearch} class="relative w-full max-w-xs">
				<Search class="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchInput}
					placeholder="Search records..."
					class="w-full rounded-lg border border-border bg-card py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
				/>
			</form>
		</div>

		<!-- Introspected Entity Data Table -->
		{#if data.entityData}
			<div class="space-y-4">
				<div class="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-xs">
							<thead class="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
								<tr>
									{#each data.entityData.columns as col (col.name)}
										<th
											onclick={() => handleSort(col.name)}
											class="cursor-pointer p-3 transition select-none hover:text-foreground"
										>
											<div class="flex items-center gap-1">
												<span>{col.label}</span>
												{#if page.url.searchParams.get('sortBy') === col.name}
													<span class="font-mono text-[10px] text-primary">
														{page.url.searchParams.get('sortOrder') === 'asc' ? '▲' : '▼'}
													</span>
												{/if}
											</div>
										</th>
									{/each}
									<th class="p-3 text-right">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-border/60">
								{#if data.entityData.rows.length === 0}
									<tr>
										<td
											colspan={data.entityData.columns.length + 1}
											class="p-8 text-center text-xs text-muted-foreground"
										>
											No records found matching your query.
										</td>
									</tr>
								{:else}
									{#each data.entityData.rows as row (row[data.entityData.primaryKey] || Math.random())}
										{@const pkVal = String(row[data.entityData.primaryKey])}
										<tr class="transition hover:bg-muted/20">
											{#each data.entityData.columns as col (col.name)}
												{@const val = row[col.name]}
												<td class="p-3 font-mono text-[11px]">
													{#if col.type === 'boolean'}
														{#if val}
															<span
																class="inline-flex items-center gap-1 font-semibold text-emerald-400"
															>
																<CircleCheck class="size-3" /> Yes
															</span>
														{:else}
															<span
																class="inline-flex items-center gap-1 font-semibold text-muted-foreground"
															>
																No
															</span>
														{/if}
													{:else if col.type === 'date' && val}
														<span class="text-muted-foreground">
															{new Date(val as string).toLocaleDateString()}
														</span>
													{:else if typeof val === 'string' && val.length > 30}
														<span title={val}>{val.slice(0, 28)}...</span>
													{:else if val === null || val === undefined}
														<span class="text-muted-foreground/50 italic">null</span>
													{:else}
														<span>{String(val)}</span>
													{/if}
												</td>
											{/each}

											<!-- Row Actions -->
											<td class="space-x-1 p-3 text-right whitespace-nowrap">
												{#if data.activeEntityKey === 'users'}
													{@const userRow = row as Record<string, unknown>}
													<button
														onclick={() => toggleRole(pkVal, (userRow.role as string) || 'user')}
														disabled={actionLoadingId === pkVal}
														class="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20"
														title="Toggle User/Admin Role"
													>
														{userRow.role || 'user'}
													</button>
													<button
														onclick={() => toggleBan(pkVal, !!userRow.banned)}
														disabled={actionLoadingId === pkVal}
														class="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold transition hover:bg-accent"
													>
														{#if userRow.banned}
															<UserCheck class="size-3 text-emerald-400" />
														{:else}
															<Ban class="size-3 text-red-400" />
														{/if}
													</button>
													<button
														onclick={() => impersonate(pkVal)}
														class="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
														title="Impersonate"
													>
														Login
													</button>
												{/if}

												<button
													onclick={() => openEditModal(row)}
													class="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold transition hover:bg-accent"
													title="Inspect & Edit Record"
												>
													<Pencil class="size-3" />
												</button>

												<button
													onclick={() => deleteRecord(pkVal)}
													disabled={actionLoadingId === pkVal}
													class="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 hover:bg-red-500/20"
													title="Delete Record"
												>
													<Trash2 class="size-3" />
												</button>
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>

				<!-- Pagination Bar -->
				<div class="flex items-center justify-between text-xs text-muted-foreground">
					<span>
						Showing {(data.entityData.pagination.page - 1) * data.entityData.pagination.limit + 1}
						to {Math.min(
							data.entityData.pagination.page * data.entityData.pagination.limit,
							data.entityData.pagination.total
						)} of {data.entityData.pagination.total} records
					</span>

					<div class="flex items-center gap-1">
						<button
							onclick={() => goToPage(data.entityData!.pagination.page - 1)}
							disabled={data.entityData.pagination.page <= 1}
							class="rounded-lg border border-border bg-card px-3 py-1 font-semibold transition hover:bg-accent disabled:opacity-40"
						>
							Previous
						</button>
						<span class="px-2 font-mono">
							{data.entityData.pagination.page} / {Math.max(
								1,
								data.entityData.pagination.totalPages
							)}
						</span>
						<button
							onclick={() => goToPage(data.entityData!.pagination.page + 1)}
							disabled={data.entityData.pagination.page >= data.entityData.pagination.totalPages}
							class="rounded-lg border border-border bg-card px-3 py-1 font-semibold transition hover:bg-accent disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Record Inspector & Edit Modal -->
{#if isEditModalOpen && selectedRecord && data.entityData}
	{@const pk = data.entityData.primaryKey}
	{@const pkVal = String(selectedRecord[pk])}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
		<div class="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
			<div class="flex items-center justify-between border-b border-border pb-3">
				<div>
					<h3 class="text-sm font-bold capitalize">
						Edit {data.activeEntityKey.slice(0, -1)}
					</h3>
					<p class="font-mono text-[10px] text-muted-foreground">ID: {pkVal}</p>
				</div>
				<button onclick={closeEditModal} class="text-muted-foreground hover:text-foreground">
					<X class="size-4" />
				</button>
			</div>

			<form onsubmit={saveRecord} class="space-y-3">
				<input type="hidden" name="_entityKey" value={data.activeEntityKey} />
				<input type="hidden" name="_id" value={pkVal} />

				<div class="max-h-96 space-y-3 overflow-y-auto pr-1">
					{#each data.entityData.columns as col (col.name)}
						<div class="space-y-1">
							<label
								for="field-{col.name}"
								class="flex items-center justify-between text-xs font-semibold text-muted-foreground"
							>
								<span>{col.label}</span>
								{#if !col.isEditable}
									<span class="text-[9px] tracking-wider text-muted-foreground/60 uppercase"
										>(Read-Only)</span
									>
								{/if}
							</label>

							{#if col.isEditable}
								{#if col.type === 'boolean'}
									<select
										id="field-{col.name}"
										name={col.name}
										bind:value={selectedRecord[col.name]}
										class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
									>
										<option value={true}>true (Yes)</option>
										<option value={false}>false (No)</option>
									</select>
								{:else}
									<input
										id="field-{col.name}"
										type="text"
										name={col.name}
										bind:value={selectedRecord[col.name]}
										class="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
									/>
								{/if}
							{:else}
								<div
									class="truncate rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 font-mono text-xs text-muted-foreground"
								>
									{String(selectedRecord[col.name] ?? 'null')}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="flex items-center justify-end gap-2 border-t border-border pt-4">
					<button
						type="button"
						onclick={closeEditModal}
						class="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
