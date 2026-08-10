<!-- src/routes/(marketing)/+layout.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- Page Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Global Footer for Marketing Pages -->
	<footer class="border-t border-border/40 bg-card py-8 text-xs text-muted-foreground">
		<div
			class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row"
		>
			<p>© 2026 SuperSvelte. All rights reserved.</p>
			<div class="flex items-center gap-6 font-medium">
				<a href={resolve('/terms')} class="transition hover:text-foreground">Terms of Service</a>
				<a href={resolve('/privacy')} class="transition hover:text-foreground">Privacy Policy</a>
				<a href={resolve('/refunds')} class="transition hover:text-foreground">Refund Policy</a>
			</div>
		</div>
	</footer>
</div>
