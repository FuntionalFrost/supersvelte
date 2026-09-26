<!-- src/lib/components/Logo.svelte -->
<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		showText?: boolean;
		iconOnly?: boolean;
		class?: string;
	}

	let { size = 'md', showText = false, iconOnly = false, class: className = '' }: Props = $props();

	const sizeConfig = {
		xs: { box: 'size-6 rounded-[6px]', text: 'text-sm font-bold', stroke: 3.4, dot: 2 },
		sm: { box: 'size-7.5 rounded-[8px]', text: 'text-base font-bold', stroke: 3.2, dot: 2.2 },
		md: { box: 'size-9 rounded-[10px]', text: 'text-lg font-black', stroke: 3.2, dot: 2.4 },
		lg: { box: 'size-10.5 rounded-xl', text: 'text-xl font-black', stroke: 3.0, dot: 2.6 },
		xl: { box: 'size-13 rounded-2xl', text: 'text-2xl font-black', stroke: 2.8, dot: 3 },
		'2xl': { box: 'size-16 rounded-2xl', text: 'text-3xl font-black', stroke: 2.6, dot: 3.5 }
	};
</script>

<div class="inline-flex items-center gap-3 font-bold tracking-tight select-none {className}">
	<!-- Icon Tile Matching Favicon -->
	<div
		class="relative flex shrink-0 items-center justify-center border border-border/80 bg-neutral-900 text-white shadow-xs transition-transform hover:scale-105 dark:border-white/20 dark:bg-[#0c121e] {sizeConfig[
			size
		].box}"
		aria-label="SuperSvelte Logo"
	>
		<svg viewBox="0 0 32 32" fill="none" class="size-full p-1.5" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M21.5 9.5C21.5 7.2 19.3 5.5 16 5.5C12.2 5.5 9.5 7.8 9.5 11.5C9.5 16.2 22.5 14.8 22.5 20.8C22.5 24.8 19.2 26.5 16 26.5C12.2 26.5 9.5 24.2 9.5 22"
				stroke="currentColor"
				stroke-width={sizeConfig[size].stroke}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="21.5" cy="9.5" r={sizeConfig[size].dot} fill="#2dd4bf" />
		</svg>
	</div>

	{#if showText && !iconOnly}
		<span class="tracking-tight text-foreground {sizeConfig[size].text}">
			Super<span
				class="bg-linear-to-r from-teal-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent"
				>Svelte</span
			>
		</span>
	{/if}
</div>
