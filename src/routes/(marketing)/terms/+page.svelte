<!-- src/routes/(marketing)/terms/+page.svelte -->
<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Terms of Service — SuperSvelte"
	description="Terms of Service for SuperSvelte boilerplate."
/>

<div class="container mx-auto max-w-4xl px-4 py-16 text-foreground">
	<h1 class="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
	<p class="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

	<div class="prose prose-neutral dark:prose-invert mt-8 space-y-6 text-sm leading-relaxed">
		<section>
			<h2 class="text-lg font-bold">1. Overview & License Grant</h2>
			<p class="text-muted-foreground">
				By purchasing SuperSvelte, you receive a non-exclusive, worldwide lifetime license to use
				the codebase to build commercial SaaS applications, client projects, and personal websites.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">2. Restrictions</h2>
			<p class="text-muted-foreground">
				You may not redistribute, sub-license, host, or resell the source code of SuperSvelte as a
				starter kit, boilerplate, template, or competing software development kit under any
				circumstances.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">3. Merchant of Record</h2>
			<p class="text-muted-foreground">
				Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant
				of Record for all our orders. Paddle handles all customer service inquiries, taxes, and
				returns.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-bold">4. Disclaimer & Warranty</h2>
			<p class="text-muted-foreground">
				SuperSvelte is provided "as is" without warranty of any kind, express or implied. We do not
				guarantee that the boilerplate will meet all your requirements or operate uninterrupted.
			</p>
		</section>
	</div>
</div>
