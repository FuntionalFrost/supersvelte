<!-- src/routes/(auth)/+layout.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6">
	<div class="w-full max-w-sm space-y-6">
		<!-- Simple Brand Header -->
		<div class="flex justify-center">
			<a href={resolve('/')} class="group flex items-center gap-2 transition">
				<div
					class="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground shadow-xs transition group-hover:scale-105"
				>
					S5
				</div>
				<span class="text-lg font-black tracking-tight text-foreground">SuperSvelte</span>
			</a>
		</div>

		<!-- Auth Form Card Container -->
		{@render children()}
	</div>
</div>
