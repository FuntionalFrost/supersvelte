<!-- src/routes/(auth)/signup/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let githubLoading = $state(false);
	let emailLoading = $state(false);
	let errorText = $state('');

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		SPA: true,
		validators: false,
		onSubmit: async ({ cancel }) => {
			cancel();
			emailLoading = true;
			errorText = '';

			const target =
				page.url.searchParams.get('redirectTo') ||
				page.url.searchParams.get('callbackUrl') ||
				'/dashboard';
			const safeTarget = target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';

			const res = await authClient.signUp.email({
				name: $formData.name,
				email: $formData.email,
				password: $formData.password
			});

			if (res.error) {
				emailLoading = false;
				errorText = res.error.message || 'Failed to create account';
				toast.error(errorText);
			} else {
				toast.success('Account created successfully!');
				window.location.href = safeTarget;
			}
		}
	});
	const { form: formData, enhance, message } = form;

	async function signupWithGithub() {
		githubLoading = true;
		const callbackURL =
			page.url.searchParams.get('redirectTo') ||
			page.url.searchParams.get('callbackUrl') ||
			'/dashboard';
		await authClient.signIn.social({
			provider: 'github',
			callbackURL
		});
	}
</script>

<div class="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs">
	<div class="space-y-1 text-center">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
		<p class="text-xs text-muted-foreground">Enter your details to get started with SuperSvelte</p>
	</div>

	<!-- Render error message -->
	{#if errorText || $message}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive"
		>
			{errorText || $message}
		</div>
	{/if}

	<!-- GitHub Social Signup -->
	<Button
		type="button"
		variant="outline"
		onclick={signupWithGithub}
		disabled={githubLoading || emailLoading}
		class="w-full text-xs font-semibold"
	>
		<svg class="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
			/>
		</svg>
		<span>{githubLoading ? 'Connecting...' : 'Continue with GitHub'}</span>
	</Button>

	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<Separator />
		</div>
		<div class="relative flex justify-center text-[10px] uppercase">
			<span class="bg-card px-2 text-muted-foreground">Or register with email</span>
		</div>
	</div>

	<form method="POST" use:enhance class="space-y-4">
		<!-- NAME FIELD -->
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-xs font-semibold">Full Name</Form.Label>
					<Input
						{...props}
						type="text"
						placeholder="Jane Doe"
						bind:value={$formData.name}
						class="text-xs"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[11px]" />
		</Form.Field>

		<!-- EMAIL FIELD -->
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-xs font-semibold">Email</Form.Label>
					<Input
						{...props}
						type="email"
						placeholder="name@example.com"
						bind:value={$formData.email}
						class="text-xs"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[11px]" />
		</Form.Field>

		<!-- PASSWORD FIELD -->
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-xs font-semibold">Password</Form.Label>
					<Input
						{...props}
						type="password"
						placeholder="••••••••"
						bind:value={$formData.password}
						class="text-xs"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[11px]" />
		</Form.Field>

		<Button type="submit" disabled={emailLoading} class="w-full text-xs font-bold">
			{emailLoading ? 'Creating account...' : 'Create Account with Email'}
		</Button>
	</form>

	<div class="text-center text-xs text-muted-foreground">
		Already have an account?
		<a href={resolve('/login')} class="font-semibold text-primary hover:underline"> Sign In </a>
	</div>
</div>
