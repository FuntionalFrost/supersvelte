<!-- src/routes/(marketing)/privacy/+page.svelte -->
<script lang="ts">
	import { Seo } from 'yaxa-svelte';
</script>

<Seo
	title="Privacy Policy"
	description="Learn how SuperSvelte collects, processes, and protects your personal data and account information."
	ogImage={{
		title: 'Privacy Policy',
		description: 'Data collection & privacy protection principles',
		badge: 'Legal'
	}}
/>

<div class="container mx-auto max-w-4xl px-4 py-16 text-foreground">
	<h1 class="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
	<p class="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

	<div class="prose prose-neutral dark:prose-invert mt-8 space-y-6 text-sm leading-relaxed">
		<section>
			<h2 class="text-lg font-bold">1. Information We Collect</h2>
			<p class="text-muted-foreground">
				We collect basic personal information such as your name, email address, and GitHub username
				to grant you repository access and authenticate your account session.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">2. Payment Processing</h2>
			<p class="text-muted-foreground">
				Payment details (credit card numbers, billing addresses, tax identification numbers) are
				processed securely by Polar.sh. We do not store or transmit raw credit card or financial
				data on our servers.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">3. Data Usage & GDPR</h2>
			<p class="text-muted-foreground">
				Your data is used strictly for product fulfillment, repository invitation, and account
				management. We never sell, rent, or distribute your personal information to third parties.
				You may request account or data deletion at any time by contacting support.
			</p>
		</section>
	</div>
</div>
