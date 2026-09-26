<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import { AdminDashboard } from 'yaxa-svelte/admin';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.adminData}
	<AdminDashboard data={data.adminData} title="SuperSvelte Admin Console" />
{/if}
