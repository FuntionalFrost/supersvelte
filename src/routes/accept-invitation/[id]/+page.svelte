<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import { Button } from 'yaxa-svelte';
	import { CircleCheck, CircleX, LogIn } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let status = $state<'loading' | 'success' | 'unauthorized' | 'error'>('loading');
	let errorMessage = $state('');
	let invitationId = $state('');

	onMount(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		async function accept() {
			// Cascade lookup: route param -> ?id -> ?token -> ?invitationId
			invitationId =
				page.params.id ??
				page.url.searchParams.get('id') ??
				page.url.searchParams.get('token') ??
				page.url.searchParams.get('invitationId') ??
				'';

			if (!invitationId) {
				status = 'error';
				errorMessage = 'Invalid invitation link: No invitation ID or token provided.';
				return;
			}

			// Check if session exists first
			const session = await authClient.getSession();
			if (!session.data?.user) {
				status = 'unauthorized';
				return;
			}

			const res = await authClient.organization.acceptInvitation({
				invitationId
			});

			if (res.error) {
				status = 'error';
				errorMessage = res.error.message ?? 'Failed to accept invitation';
			} else {
				// Auto-switch active organization to the newly joined team
				const orgId = res.data?.invitation?.organizationId;
				if (orgId) {
					await authClient.organization.setActive({
						organizationId: orgId
					});
				}

				status = 'success';

				timeoutId = setTimeout(() => {
					goto(resolve('dashboard'));
				}, 1200);
			}
		}

		accept();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
</script>

<!-- src/routes/accept-invitation/[id]/+page.svelte -->
<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div
		class="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-lg"
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
			<CircleCheck class="mx-auto size-12 text-emerald-500" />
			<h2 class="text-base font-bold">Invitation Accepted!</h2>
			<p class="text-xs text-muted-foreground">
				Workspace joined successfully. Redirecting to dashboard...
			</p>
		{:else if status === 'unauthorized'}
			<div
				class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
			>
				<LogIn class="size-6" />
			</div>
			<h2 class="text-base font-bold">Authentication Required</h2>
			<p class="text-xs text-muted-foreground">
				You must sign in or create an account before you can accept this invitation.
			</p>
			<div class="mt-6 flex flex-col gap-2">
				<a
					href="{resolve('login')}?callbackUrl={encodeURIComponent(
						page.url.pathname + page.url.search
					)}"
					class="w-full"
				>
					<Button class="w-full text-xs font-bold">Sign In to Accept</Button>
				</a>
				<a
					href="{resolve('signup')}?callbackUrl={encodeURIComponent(
						page.url.pathname + page.url.search
					)}"
					class="w-full"
				>
					<Button variant="outline" class="w-full text-xs font-semibold">Create Account</Button>
				</a>
			</div>
		{:else}
			<CircleX class="mx-auto size-12 text-destructive" />
			<h2 class="text-base font-bold">Invitation Failed</h2>
			<p class="text-xs text-muted-foreground">{errorMessage}</p>

			<a href={resolve('dashboard')} class="mt-4 inline-block">
				<Button variant="soft" size="sm" class="text-xs font-semibold">Return to Dashboard</Button>
			</a>
		{/if}
	</div>
</div>
