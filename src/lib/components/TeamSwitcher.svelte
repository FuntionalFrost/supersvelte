<!-- src/lib/components/TeamSwitcher.svelte -->
<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { OrgSwitcher, type OrgItem } from 'yaxa-svelte';

	let rawOrgs = $state<Array<{ id: string; name: string; slug: string }>>([]);
	let activeOrgId = $state<string>('');

	let organizations = $derived<OrgItem[]>(
		rawOrgs.map((org) => ({
			id: org.id,
			name: org.name
		}))
	);

	async function loadOrganizations() {
		const res = await authClient.organization.list();
		if (res.data && res.data.length > 0) {
			rawOrgs = res.data;
			activeOrgId = res.data[0]?.id ?? '';
		}
	}

	async function handleSelectOrg(org: OrgItem) {
		activeOrgId = org.id;
		await authClient.organization.setActive({ organizationId: org.id });
	}

	$effect(() => {
		loadOrganizations();
	});
</script>

<OrgSwitcher
	{organizations}
	bind:currentOrgId={activeOrgId}
	onselect={handleSelectOrg}
	createLabel="Create Workspace"
	class="w-full"
/>
