<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { CircleCheck, CircleX } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let errorMessage = $state('');

	onMount(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		async function accept() {
			const invitationId = page.params.id;
			if (!invitationId) {
				status = 'error';
				errorMessage = 'Invalid invitation link';
				return;
			}

			const res = await authClient.organization.acceptInvitation({
				invitationId
			});

			if (res.error) {
				status = 'error';
				errorMessage = res.error.message ?? 'Failed to accept invitation';
			} else {
				status = 'success';
				timeoutId = setTimeout(() => {
					// Use SvelteKit's router and path resolver
					goto(resolve('/dashboard'));
				}, 1500);
			}
		}

		accept();

		// Cleanup timeout if component unmounts prematurely
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div
		class="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-8 text-center shadow-lg"
	>
		{#if status === 'loading'}
			<div
				class="mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
			></div>
			<h2 class="text-base font-bold">Joining Workspace...</h2>
			<p class="text-xs text-muted-foreground">
				Please wait while we process your workspace invitation.
			</p>
		{:else if status === 'success'}
			<CircleCheck class="mx-auto size-12 text-emerald-400" />
			<h2 class="text-base font-bold">Invitation Accepted!</h2>
			<p class="text-xs text-muted-foreground">Redirecting you to your dashboard...</p>
		{:else}
			<CircleX class="mx-auto size-12 text-red-400" />
			<h2 class="text-base font-bold">Invitation Failed</h2>
			<p class="text-xs text-muted-foreground">{errorMessage}</p>
			<a
				href={resolve('/dashboard')}
				class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
			>
				Return to App
			</a>
		{/if}
	</div>
</div>
