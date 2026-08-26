<!-- src/lib/components/TeamSwitcher.svelte -->
<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Check, ChevronsUpDown, Plus, Users } from '@lucide/svelte';

	interface Org {
		id: string;
		name: string;
		slug: string;
	}

	let activeOrg = $state<Org | null>(null);
	let orgs = $state<Org[]>([]);
	let open = $state(false);

	async function loadOrganizations() {
		const res = await authClient.organization.list();
		if (res.data) {
			orgs = res.data;
			activeOrg = res.data[0] ?? null;
		}
	}

	async function switchOrg(org: Org) {
		activeOrg = org;
		await authClient.organization.setActive({ organizationId: org.id });
		open = false;
	}

	$effect(() => {
		loadOrganizations();
	});
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (open = !open)}
		class="flex w-52 items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold shadow-xs transition hover:bg-accent"
	>
		<div class="flex items-center gap-2 truncate">
			<Users class="size-4 text-primary" />
			<span class="truncate">{activeOrg ? activeOrg.name : 'Personal Workspace'}</span>
		</div>
		<ChevronsUpDown class="size-3.5 opacity-50" />
	</button>

	{#if open}
		<div
			class="absolute top-full left-0 z-50 mt-1.5 w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl"
		>
			<div class="px-2 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
				Workspaces
			</div>

			{#each orgs as org (org.id)}
				<button
					type="button"
					onclick={() => switchOrg(org)}
					class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition hover:bg-accent"
				>
					<span>{org.name}</span>
					{#if activeOrg?.id === org.id}
						<Check class="size-3.5 text-primary" />
					{/if}
				</button>
			{/each}

			<div class="my-1 border-t border-border"></div>

			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
			>
				<Plus class="size-3.5" />
				<span>Create Workspace</span>
			</button>
		</div>
	{/if}
</div>
