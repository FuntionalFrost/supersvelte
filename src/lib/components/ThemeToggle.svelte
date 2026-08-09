<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<Button onclick={toggleMode} variant="outline" size="icon" aria-label="Toggle Theme">
	<Sun class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	<Moon class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
</Button>
