<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.js';
	import GithubIcon from '#lib/components/GithubIcon.svelte';
	import { getSafeRedirectUrl } from '#lib/utils.js';
	import { Button, Divider, FormField, Input, toast } from 'yaxa-svelte';

	let email = $state('');
	let password = $state('');
	let githubLoading = $state(false);
	let emailLoading = $state(false);
	let errorText = $state('');

	async function handleEmailLogin(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !password) {
			errorText = 'Please enter your email and password';
			return;
		}

		emailLoading = true;
		errorText = '';

		const safeTarget = getSafeRedirectUrl(page.url);

		const res = await authClient.signIn.email({
			email,
			password
		});

		if (res.error) {
			emailLoading = false;
			errorText = res.error.message || 'Invalid email or password';
			toast.error(errorText);
		} else {
			toast.success('Logged in successfully!');
			window.location.href = safeTarget;
		}
	}

	async function loginWithGithub() {
		githubLoading = true;
		const callbackURL = getSafeRedirectUrl(page.url);
		await authClient.signIn.social({
			provider: 'github',
			callbackURL
		});
	}
</script>

<div class="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs">
	<div class="space-y-1 text-center">
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
		<p class="text-xs text-muted-foreground">Enter your credentials to access your account</p>
	</div>

	<!-- Render error message -->
	{#if errorText}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive"
		>
			{errorText}
		</div>
	{/if}

	<!-- GitHub Social Login -->
	<Button
		type="button"
		variant="outline"
		onclick={loginWithGithub}
		disabled={githubLoading || emailLoading}
		class="w-full text-xs font-semibold"
	>
		<GithubIcon class="mr-2 size-4" />
		<span>{githubLoading ? 'Connecting...' : 'Continue with GitHub'}</span>
	</Button>

	<div class="relative">
		<Divider />
	</div>

	<form onsubmit={handleEmailLogin} class="space-y-4">
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

		<Button type="submit" disabled={emailLoading} class="w-full text-xs font-bold">
			{emailLoading ? 'Signing in...' : 'Sign In with Email'}
		</Button>
	</form>

	<div class="text-center text-xs text-muted-foreground">
		Don't have an account yet?
		<a href={resolve('signup')} class="font-semibold text-primary hover:underline">Sign Up</a>
	</div>
</div>
