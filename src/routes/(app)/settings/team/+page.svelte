<!-- src/routes/(app)/settings/team/+page.svelte -->
<script lang="ts">
	import { authClient, useActiveOrganization } from '$lib/auth-client';
	import {
		Building2,
		Check,
		Crown,
		Mail,
		Plus,
		Shield,
		Trash2,
		UserPlus,
		Users
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'yaxa-svelte';

	const activeOrg = useActiveOrganization();

	let newOrgName = $state('');
	let newOrgSlug = $state('');
	let inviteEmail = $state('');
	let inviteRole = $state<'admin' | 'member'>('member');
	let isCreatingOrg = $state(false);
	let isSendingInvite = $state(false);
	let actionLoadingId = $state<string | null>(null);

	let userOrgs = $state<Array<{ id: string; name: string; slug: string }>>([]);

	// Auto-generate URL-friendly slug from organization name
	function handleNameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		newOrgName = target.value;
		newOrgSlug = target.value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
	}

	async function loadUserOrgs() {
		try {
			const res = await authClient.organization.list();
			if (res.data) {
				userOrgs = res.data;
			}
		} catch (err) {
			console.error('Failed to load user organizations:', err);
		}
	}

	onMount(() => {
		loadUserOrgs();
	});

	async function handleCreateOrg(e: SubmitEvent) {
		e.preventDefault();
		if (!newOrgName || !newOrgSlug) return;

		isCreatingOrg = true;
		const res = await authClient.organization.create({
			name: newOrgName,
			slug: newOrgSlug
		});

		isCreatingOrg = false;
		if (res.error) {
			toast.error(res.error.message ?? 'Failed to create organization');
			return;
		}

		toast.success('Organization created!');
		newOrgName = '';
		newOrgSlug = '';

		if (res.data?.id) {
			await authClient.organization.setActive({ organizationId: res.data.id });
		}
		await loadUserOrgs();
	}

	async function handleSwitchOrg(orgId: string) {
		const res = await authClient.organization.setActive({ organizationId: orgId });
		if (res.error) {
			toast.error(res.error.message ?? 'Failed to switch organization');
			return;
		}
		toast.success('Switched workspace');
	}

	async function handleSendInvite(e: SubmitEvent) {
		e.preventDefault();
		if (!inviteEmail || !$activeOrg.data?.id) return;

		isSendingInvite = true;
		const res = await authClient.organization.inviteMember({
			email: inviteEmail,
			role: inviteRole,
			organizationId: $activeOrg.data.id
		});

		isSendingInvite = false;
		if (res.error) {
			toast.error(res.error.message ?? 'Failed to send invite');
			return;
		}

		toast.success(`Invite sent to ${inviteEmail}`);
		inviteEmail = '';
	}

	async function handleRemoveMember(memberId: string) {
		if (!$activeOrg.data?.id) return;
		actionLoadingId = memberId;

		const res = await authClient.organization.removeMember({
			memberIdOrEmail: memberId,
			organizationId: $activeOrg.data.id
		});

		actionLoadingId = null;
		if (res.error) {
			toast.error(res.error.message ?? 'Failed to remove member');
			return;
		}

		toast.success('Member removed from workspace');
	}

	async function handleUpdateRole(memberId: string, currentRole: string) {
		if (!$activeOrg.data?.id) return;
		actionLoadingId = memberId;
		const nextRole = currentRole === 'admin' ? 'member' : 'admin';

		const res = await authClient.organization.updateMemberRole({
			memberId,
			role: nextRole,
			organizationId: $activeOrg.data.id
		});

		actionLoadingId = null;
		if (res.error) {
			toast.error(res.error.message ?? 'Failed to update role');
			return;
		}

		toast.success(`Member role updated to ${nextRole}`);
	}
</script>

<div class="mx-auto max-w-5xl space-y-8">
	<!-- Header -->
	<div class="border-b border-border pb-5">
		<h1 class="text-2xl font-bold tracking-tight text-foreground">Team & Workspaces</h1>
		<p class="text-xs text-muted-foreground">
			Manage organizations, invite collaborators, and assign access roles.
		</p>
	</div>

	<div class="grid gap-8 md:grid-cols-3">
		<!-- LEFT COLUMN: Workspace Switcher & Creator -->
		<div class="space-y-6">
			<!-- Workspace List -->
			<div class="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
				<h2 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">Workspaces</h2>
				<div class="space-y-1">
					{#each userOrgs as org (org.id)}
						{@const isActive = $activeOrg.data?.id === org.id}
						<button
							type="button"
							onclick={() => handleSwitchOrg(org.id)}
							class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition {isActive
								? 'bg-primary text-primary-foreground shadow-xs'
								: 'text-foreground hover:bg-accent'}"
						>
							<div class="flex items-center gap-2 truncate">
								<Building2 class="size-4 shrink-0" />
								<span class="truncate">{org.name}</span>
							</div>
							{#if isActive}
								<Check class="size-3.5 shrink-0" />
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Create New Organization -->
			<form
				onsubmit={handleCreateOrg}
				class="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs"
			>
				<h2 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
					Create Workspace
				</h2>
				<div class="space-y-2">
					<input
						type="text"
						value={newOrgName}
						oninput={handleNameInput}
						placeholder="Organization Name (e.g. Acme Inc)"
						required
						class="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
					/>
					<input
						type="text"
						bind:value={newOrgSlug}
						placeholder="Slug (e.g. acme-inc)"
						required
						class="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
					/>
				</div>
				<button
					type="submit"
					disabled={isCreatingOrg}
					class="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-50"
				>
					<Plus class="size-3.5" />
					<span>{isCreatingOrg ? 'Creating...' : 'Create Organization'}</span>
				</button>
			</form>
		</div>

		<!-- RIGHT COLUMN: Active Team Members & Invites -->
		<div class="space-y-6 md:col-span-2">
			{#if $activeOrg.data}
				<!-- Active Org Banner -->
				<div
					class="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-xs"
				>
					<div class="flex items-center gap-3">
						<div class="rounded-xl bg-primary/10 p-2.5 text-primary">
							<Building2 class="size-6" />
						</div>
						<div>
							<h2 class="text-base font-bold">{$activeOrg.data.name}</h2>
							<p class="font-mono text-xs text-muted-foreground">/{$activeOrg.data.slug}</p>
						</div>
					</div>
				</div>

				<!-- Send Member Invitation -->
				<form
					onsubmit={handleSendInvite}
					class="space-y-3 rounded-xl border border-border bg-card p-5 shadow-xs"
				>
					<div class="flex items-center gap-2">
						<UserPlus class="size-4 text-primary" />
						<h3 class="text-xs font-bold tracking-wider uppercase">Invite Teammate</h3>
					</div>
					<div class="flex flex-col gap-2 sm:flex-row">
						<input
							type="email"
							bind:value={inviteEmail}
							placeholder="colleague@company.com"
							required
							class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
						/>
						<select
							bind:value={inviteRole}
							class="rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
						>
							<option value="member">Member</option>
							<option value="admin">Admin</option>
						</select>
						<button
							type="submit"
							disabled={isSendingInvite}
							class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-50"
						>
							<Mail class="size-3.5" />
							<span>{isSendingInvite ? 'Sending...' : 'Invite'}</span>
						</button>
					</div>
				</form>

				<!-- Active Members Table -->
				<div class="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
					<div class="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
						<Users class="size-4 text-muted-foreground" />
						<h3 class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
							Team Members
						</h3>
					</div>
					<table class="w-full text-left text-xs">
						<thead class="border-b border-border bg-muted/20 font-semibold text-muted-foreground">
							<tr>
								<th class="p-3.5">User</th>
								<th class="p-3.5">Role</th>
								<th class="p-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border/60">
							{#each $activeOrg.data.members || [] as member (member.id)}
								<tr class="transition hover:bg-muted/20">
									<td class="p-3.5 font-medium">
										<div>{member.user?.name || 'Team Member'}</div>
										<div class="font-mono text-[11px] text-muted-foreground">
											{member.user?.email || 'N/A'}
										</div>
									</td>
									<td class="p-3.5">
										{#if member.role === 'owner'}
											<span
												class="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400"
											>
												<Crown class="size-3" /> Owner
											</span>
										{:else}
											<button
												type="button"
												onclick={() => handleUpdateRole(member.id, member.role)}
												disabled={actionLoadingId === member.id}
												class="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary hover:bg-primary/20 disabled:opacity-50"
											>
												<Shield class="size-3" />
												{member.role}
											</button>
										{/if}
									</td>
									<td class="p-3.5 text-right">
										{#if member.role !== 'owner'}
											<button
												type="button"
												onclick={() => handleRemoveMember(member.id)}
												disabled={actionLoadingId === member.id}
												class="inline-flex items-center gap-1 rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
											>
												<Trash2 class="size-3" /> Remove
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="space-y-3 rounded-xl border border-border bg-card p-12 text-center">
					<Building2 class="mx-auto size-10 text-muted-foreground" />
					<h3 class="text-base font-bold">No Workspace Selected</h3>
					<p class="text-xs text-muted-foreground">
						Select an existing organization or create a new workspace on the left to get started.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
