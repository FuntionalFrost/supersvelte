<!-- src/routes/(marketing)/terms/+page.svelte -->
<script lang="ts">
	import ContactEmailBadge from '#lib/components/ContactEmailBadge.svelte';
	import { Seo } from 'yaxa-svelte';
	import { siteConfig } from '../../../site.config';
</script>

<Seo
	title="Terms of Service — SuperSvelte"
	description="Read the terms and conditions governing your access to and commercial use of the SuperSvelte codebase."
	ogImage={{
		title: 'Terms of Service',
		description: 'Commercial licensing & usage conditions',
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
					class="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 font-mono text-xs font-semibold text-teal-400"
				>
					Commercial Licensing
				</span>
			</div>

			<h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
				Terms of Service
			</h1>

			<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
				The terms and conditions governing your access to, licensing of, and commercial usage of
				SuperSvelte.
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
			<!-- 1. Acceptance -->
			<section class="space-y-3 pt-6 first:pt-0">
				<h2 class="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
				<p>
					By purchasing, accessing, downloading, or using <strong class="text-foreground"
						>SuperSvelte</strong
					>
					(<a href={siteConfig.url} class="text-foreground underline hover:text-primary"
						>{siteConfig.url}</a
					>), you agree to be bound by these Terms of Service. If you do not agree to all terms, do
					not purchase or use the codebase.
				</p>
			</section>

			<!-- 2. License Grant -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">2. License Grant & Acceptable Use</h2>
				<ul class="list-disc space-y-2 pl-5">
					<li>
						<strong class="text-foreground">Standard License:</strong> Grants a worldwide, non-exclusive,
						non-transferable lifetime license for one (1) developer to build and deploy one (1) commercial
						SaaS application or client deliverable.
					</li>
					<li>
						<strong class="text-foreground">Pro Unlimited License:</strong> Grants a worldwide, non-exclusive
						lifetime license for unlimited personal SaaS projects, agency client deliverables, and commercial
						applications.
					</li>
					<li>
						<strong class="text-foreground">Strict Restrictions:</strong> You may
						<span class="font-semibold text-foreground">not</span> redistribute, re-license, sublicense,
						or resell the SuperSvelte source code or components as a boilerplate, starter kit, template,
						or UI library under any circumstances.
					</li>
				</ul>
			</section>

			<!-- 3. Payments & Taxes -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">3. Payments, Invoicing & Taxes</h2>
				<p>
					All order processing and recurring billing is conducted by our online reseller and
					Merchant of Record, <strong class="text-foreground"
						>Polar Payments Inc. ("Polar.sh")</strong
					>. Polar handles all payments, sales tax calculation, EU VAT compliance, and VAT invoice
					delivery.
				</p>
			</section>

			<!-- 4. Limitation of Liability -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">
					4. Limitation of Liability & Warranty Disclaimer
				</h2>
				<p>
					SuperSvelte is provided "as is" without warranty of any kind, express or implied. To the
					maximum extent permitted by law, SuperSvelte and its maintainers shall not be liable for
					any indirect, consequential, or incidental damages arising out of the use or inability to
					use this software.
				</p>
			</section>

			<!-- 5. Governing Law -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">5. Governing Law & Dispute Resolution</h2>
				<p>
					These Terms shall be governed by and construed in accordance with applicable laws. Any
					legal disputes shall be settled through amicable resolution or standard arbitration.
				</p>
			</section>
		</div>

		<!-- Direct Inquiry Box -->
		<div
			class="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card/70 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">
					Commercial Licensing Inquiries
				</h3>
				<p class="mt-1 text-xs text-muted-foreground">
					For enterprise procurement, custom billing terms, or licensing assistance.
				</p>
			</div>
			<ContactEmailBadge />
		</div>
	</div>
</div>
