<!-- src/lib/components/ContactEmailBadge.svelte -->
<script lang="ts">
	import { Check, Copy, Mail } from '@lucide/svelte';
	import { toast } from 'yaxa-svelte';
	import { siteConfig } from '../../site.config';

	interface Props {
		class?: string;
		showLabel?: boolean;
	}

	let { class: className = '', showLabel = true }: Props = $props();

	let copied = $state(false);
	const email = siteConfig.email || 'devfrost@protonmail.com';

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			toast.success('Email address copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			toast.error('Failed to copy email');
		}
	}
</script>

<div
	class="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card/80 px-3 py-1.5 font-mono text-xs shadow-xs backdrop-blur-sm {className}"
>
	{#if showLabel}
		<Mail class="size-3.5 shrink-0 text-teal-400" />
	{/if}
	<a
		href="mailto:{email}"
		class="font-semibold text-foreground transition hover:text-primary hover:underline"
	>
		{email}
	</a>
	<button
		type="button"
		onclick={copyEmail}
		class="inline-flex size-5 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
		title="Copy email to clipboard"
		aria-label="Copy email address"
	>
		{#if copied}
			<Check class="size-3 text-emerald-400" />
		{:else}
			<Copy class="size-3" />
		{/if}
	</button>
</div>
