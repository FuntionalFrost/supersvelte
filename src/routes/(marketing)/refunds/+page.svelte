<!-- src/routes/(marketing)/refunds/+page.svelte -->
<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
</script>

<MetaTags
	title="Refund Policy"
	description="Review the 14-day refund policy and satisfaction guarantee for SuperSvelte licenses."
	canonical="https://supersvelte.netlify.app/refunds"
/>

<div class="container mx-auto max-w-4xl px-4 py-16 text-foreground">
	<h1 class="text-4xl font-extrabold tracking-tight">Refund Policy</h1>
	<p class="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

	<div class="prose prose-neutral dark:prose-invert mt-8 space-y-6 text-sm leading-relaxed">
		<section>
			<h2 class="text-lg font-bold">1. 14-Day Money-Back Guarantee</h2>
			<p class="text-muted-foreground">
				We want you to be satisfied with SuperSvelte. If you determine the boilerplate does not suit
				your technical stack or needs within 14 days of purchase, you are eligible for a full
				refund.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">2. How to Request a Refund</h2>
			<p class="text-muted-foreground">
				Because Polar is our Merchant of Record, you can request a refund directly via Polar's Buyer
				Support portal or by contacting us with your order transaction ID. Upon issuing a refund,
				your access to the private GitHub repository will be revoked.
			</p>
		</section>
	</div>
</div>
