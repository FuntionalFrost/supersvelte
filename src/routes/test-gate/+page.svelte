<script lang="ts">
	import Gate from '$lib/components/Gate.svelte';
</script>

<div class="p-8">
	<Gate required="pro">
		{#snippet allowed()}
			<div
				class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-bold text-emerald-500"
			>
				🔓 Access Granted: You have an active Pro license.
			</div>
		{/snippet}
	</Gate>
</div>
