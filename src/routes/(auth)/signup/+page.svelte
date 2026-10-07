<!-- src/routes/(auth)/signup/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import GithubIcon from '#lib/components/GithubIcon.svelte';
	import { getSafeRedirectUrl } from '#lib/utils.js';
	import { Button, Divider, FormField, Input, toast } from 'yaxa-svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let githubLoading = $state(false);
	let emailLoading = $state(false);
	let errorText = $state('');

	async function handleEmailSignup(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !password || !name) {
			errorText = 'Please enter your name, email, and password';
			return;
		}

		emailLoading = true;
		errorText = '';

		const safeTarget = getSafeRedirectUrl(page.url);

		const res = await authClient.signUp.email({
			name,
			email,
			password
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

	async function signupWithGithub() {
		githubLoading = true;
		const callbackURL = getSafeRedirectUrl(page.url);
		await authClient.signIn.social({
			provider: 'github',
			callbackURL
		});
	}
</script>

<div class="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs yaxa-surface-elevated">
	<div class="space-y-1 text-center">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
		<p class="text-xs text-muted-foreground">Enter your details to get started with SuperSvelte</p>
	</div>

	<!-- Render error message -->
	{#if errorText}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive"
		>
			{errorText}
		</div>
	{/if}

	<!-- GitHub Social Signup -->
	<Button
		type="button"
		variant="outline"
		onclick={signupWithGithub}
		disabled={githubLoading || emailLoading}
		class="w-full yaxa-press text-xs font-semibold"
	>
		<GithubIcon class="mr-2 size-4" />
		<span>{githubLoading ? 'Connecting...' : 'Continue with GitHub'}</span>
	</Button>

	<div class="relative">
		<Divider />
	</div>

	<form onsubmit={handleEmailSignup} class="space-y-4">
		<!-- NAME FIELD -->
		<FormField label="Full Name">
			<Input
				type="text"
				placeholder="Jane Doe"
				bind:value={name}
				size="sm"
				required
				class="border-border bg-background text-foreground placeholder:text-muted-foreground"
			/>
		</FormField>

		<!-- EMAIL FIELD -->
		<FormField label="Email">
			<Input
				type="email"
				placeholder="name@example.com"
				bind:value={email}
				size="sm"
				required
				class="border-border bg-background text-foreground placeholder:text-muted-foreground"
			/>
		</FormField>

		<!-- PASSWORD FIELD -->
		<FormField label="Password">
			<Input
				type="password"
				placeholder="••••••••"
				bind:value={password}
				size="sm"
				required
				class="border-border bg-background text-foreground placeholder:text-muted-foreground"
			/>
		</FormField>

		<Button type="submit" disabled={emailLoading} class="w-full yaxa-press text-xs font-bold">
			{emailLoading ? 'Creating account...' : 'Create Account with Email'}
		</Button>
	</form>

	<div class="text-center text-xs text-muted-foreground">
		Already have an account?
		<a href={resolve('login')} class="font-semibold text-primary hover:underline">Sign In</a>
	</div>
</div>
