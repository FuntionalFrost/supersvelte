<!-- src/routes/(auth)/+layout.svelte -->
<script lang="ts">
	import Logo from '#lib/components/Logo.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
	<div class="w-full max-w-sm space-y-6">
		<!-- Simple Brand Header -->
		<div class="flex justify-center">
			<a href="/" class="group flex items-center gap-2.5 transition">
				<Logo size="md" />
				<span class="text-lg font-black tracking-tight text-foreground">SuperSvelte</span>
			</a>
		</div>

		<!-- Auth Form Card Container -->
		{@render children()}
	</div>
</div>
