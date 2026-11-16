<!-- src/routes/(auth)/signup/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { getSafeRedirectUrl } from '#lib/utils.js';
	import { SignUpCard } from 'yaxa-svelte/auth';

	const callbackURL = $derived(getSafeRedirectUrl(page.url));
</script>

<SignUpCard
	title="Create an account"
	subtitle="Enter your details to get started with SuperSvelte"
	providers={['github']}
	showSocial={true}
	showPasskey={false}
	showMagicLinkToggle={false}
	{callbackURL}
/>
