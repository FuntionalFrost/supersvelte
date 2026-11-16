<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { getSafeRedirectUrl } from '#lib/utils.js';
	import { SignInCard } from 'yaxa-svelte/auth';

	const callbackURL = $derived(getSafeRedirectUrl(page.url));
</script>

<SignInCard
	title="Welcome back"
	subtitle="Enter your credentials to access your account"
	providers={['github']}
	showSocial={true}
	showPasskey={true}
	showMagicLinkToggle={false}
	showForgotPassword={false}
	{callbackURL}
/>
