<!-- src/routes/(auth)/+layout.svelte -->
<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
	<div class="w-full max-w-sm">
		{@render children()}
	</div>
</div>
