<!-- src/routes/(marketing)/refunds/+page.svelte -->
<script lang="ts">
	import ContactEmailBadge from '$lib/components/ContactEmailBadge.svelte';
	import { Seo } from 'yaxa-svelte';
	import { siteConfig } from '../../../site.config';
</script>

<Seo
	title="Cancellation & Refund Policy — SuperSvelte"
	description="Our transparent 14-day refund policy, self-serve cancellation terms, and EU statutory withdrawal rights."
	ogImage={{
		title: 'Refund Policy',
		description: '14-day satisfaction money-back guarantee',
		badge: 'Legal'
	}}
/>

<div class="relative py-12 sm:py-16">
	<div class="container mx-auto max-w-4xl px-4 sm:px-6">
		<!-- Badges & Page Header -->
		<div class="space-y-4 border-b border-border/60 pb-8">
			<div class="flex flex-wrap items-center gap-2">
				<span
					class="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-semibold text-muted-foreground"
				>
					Legal & Compliance
				</span>
				<span
					class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400"
				>
					14-Day Money-Back Guarantee
				</span>
			</div>

			<h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
				Cancellation & Refund Policy
			</h1>

			<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
				Our transparent 14-day refund policy, self-serve cancellation terms, and EU statutory
				withdrawal rights.
			</p>

			<!-- Clean Metadata Strip -->
			<div class="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
				<span><strong>Last Updated:</strong> September 2026</span>
				<span class="text-border">•</span>
				<span><strong>Entity:</strong> {siteConfig.company?.legalName || 'SuperSvelte'}</span>
				<span class="text-border">•</span>
				<span
					><strong>Contact:</strong>
					<a href="mailto:{siteConfig.email}" class="text-foreground hover:underline"
						>{siteConfig.email}</a
					></span
				>
			</div>
		</div>

		<!-- Legal Clauses Content -->
		<div
			class="space-y-8 divide-y divide-border/60 py-8 text-sm leading-relaxed text-muted-foreground"
		>
			<!-- 1. Self-Serve Cancellation -->
			<section class="space-y-3 pt-6 first:pt-0">
				<h2 class="text-lg font-bold text-foreground">1. Self-Serve Cancellation</h2>
				<p>
					You may manage or cancel your active subscription plan at any time with immediate effect.
					Upon cancellation, your access remains fully active through the end of your current paid
					billing cycle, and no further automatic charges will occur.
				</p>
			</section>

			<!-- 2. 14-Day Guarantee -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">2. 14-Day Money-Back Guarantee</h2>
				<p>
					We stand behind the quality of SuperSvelte. If you determine the boilerplate does not suit
					your technical stack or requirements within <strong class="text-foreground"
						>14 days of purchase</strong
					>, you are eligible for a 100% full refund. Simply send an email with your purchase
					transaction ID to
					<a href="mailto:{siteConfig.email}" class="text-foreground underline"
						>{siteConfig.email}</a
					>.
				</p>
			</section>

			<!-- 3. EU Withdrawal Rights -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">3. EU Statutory Right of Withdrawal</h2>
				<p>
					If you are a consumer residing in the European Union, you hold the statutory right to
					withdraw from a purchase within 14 days without giving any reason. Because our Merchant of
					Record is <strong class="text-foreground">Polar Payments Inc.</strong>, refunds are
					processed securely and credited back to your original payment method.
				</p>
			</section>

			<!-- 4. Chargebacks & Friendly Resolution -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">4. Chargebacks & Friendly Resolution</h2>
				<p>
					If you experience any billing discrepancies or unexpected charges, please contact us
					directly before initiating a bank dispute or chargeback. We resolve all billing tickets
					promptly.
				</p>
			</section>
		</div>

		<!-- Direct Inquiry Box -->
		<div
			class="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card/70 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">
					Need Assistance with a Refund?
				</h3>
				<p class="mt-1 text-xs text-muted-foreground">
					Contact our support team directly with your order ID for rapid processing.
				</p>
			</div>
			<ContactEmailBadge />
		</div>
	</div>
</div>
