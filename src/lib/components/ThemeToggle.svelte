<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
	import { Button, theme } from 'yaxa-svelte';
	import { Moon, Sun } from '@lucide/svelte';
</script>

<Button
	onclick={() => theme.toggle()}
	variant="ghost"
	size="sm"
	aria-label="Toggle Theme"
	class="size-8 rounded-lg border border-border/70 bg-card/50 p-0 text-muted-foreground shadow-xs transition hover:bg-muted hover:text-foreground"
>
	{#if theme.resolvedTheme === 'dark'}
		<Moon class="size-4" />
	{:else}
		<Sun class="size-4" />
	{/if}
</Button>
