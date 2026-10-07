<!-- src/routes/test/components/ThemeTab.svelte -->
<script lang="ts">
	import { ThemeStudio } from 'yaxa-svelte';
	import { Palette, Sparkles } from '@lucide/svelte';
</script>

<div class="mt-8 space-y-6">
	<!-- Tab Header -->
	<div class="rounded-xl border border-border bg-card p-6 shadow-xs">
		<div class="flex items-center gap-3">
			<div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Palette class="size-5" />
			</div>
			<div>
				<div class="flex items-center gap-2">
					<h2 class="text-lg font-bold">Interactive Theme Studio</h2>
					<span
						class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
					>
						<Sparkles class="size-3" />
						yaxa-svelte 1.15.0
					</span>
				</div>
				<p class="text-xs text-muted-foreground">
					Preview and configure accent palettes, neutral scales, border radius, typography, and base
					font sizes in real time. Export the generated Tailwind CSS v4 design tokens with one
					click.
				</p>
			</div>
		</div>
	</div>

	<!-- Turnkey Theme Studio from Yaxa -->
	<ThemeStudio showHeader={false} class="rounded-xl border border-border bg-card p-6 shadow-xs" />
</div>
