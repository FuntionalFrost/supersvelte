<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from 'yaxa-svelte';
	import { AlertTriangle, ArrowLeft, Home, LayoutDashboard, ShieldAlert } from '@lucide/svelte';
	import { MetaTags } from 'svelte-meta-tags';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An unexpected error occurred.');

	const is404 = $derived(status === 404);
	const is403 = $derived(status === 403);
	const is500 = $derived(status >= 500);

	const title = $derived(
		is404
			? 'Page Not Found'
			: is403
				? 'Access Denied'
				: is500
					? 'Internal Server Error'
					: 'Something Went Wrong'
	);

	const description = $derived(
		is404
			? "The page you are looking for doesn't exist, has been removed, or is temporarily unavailable."
			: is403
				? 'You do not have the required permissions or license to view this resource.'
				: is500
					? 'Our servers encountered an error while processing your request. Please try again shortly.'
					: message
	);
</script>

<MetaTags title="{status} — {title}" {description} robots="noindex, nofollow" />

<div
	class="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground"
>
	<div class="mx-auto max-w-md space-y-6 text-center">
		<!-- Icon Badge -->
		<div
			class="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-xs"
		>
			{#if is403}
				<ShieldAlert class="size-8 text-amber-500" />
			{:else if is500}
				<AlertTriangle class="size-8 text-destructive" />
			{:else}
				<AlertTriangle class="size-8 text-primary" />
			{/if}
		</div>

		<!-- Status & Title -->
		<div class="space-y-2">
			<span
				class="rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-xs font-bold text-muted-foreground"
			>
				Error {status}
			</span>
			<h1 class="text-3xl font-black tracking-tight sm:text-4xl">
				{title}
			</h1>
			<p class="text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{description}
			</p>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
			<Button
				variant="outline"
				size="sm"
				onclick={() => history.back()}
				class="w-full gap-2 text-xs font-semibold sm:w-auto"
			>
				<ArrowLeft class="size-3.5" />
				<span>Go Back</span>
			</Button>

			<a
				href={resolve('/dashboard')}
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90 sm:w-auto"
			>
				<LayoutDashboard class="size-3.5" />
				<span>Dashboard</span>
			</a>

			<a
				href={resolve('/')}
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto"
			>
				<Home class="size-3.5" />
				<span>Home</span>
			</a>
		</div>

		<!-- Support Help -->
		<div class="border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
			<span>Need assistance? </span>
			<a href="mailto:support@supersvelte.dev" class="font-semibold text-primary hover:underline">
				Contact Support
			</a>
		</div>
	</div>
</div>
