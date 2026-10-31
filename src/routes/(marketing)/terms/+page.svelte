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
					Open Source (MIT)
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
					By accessing, cloning, downloading, or using <strong class="text-foreground"
						>SuperSvelte</strong
					>
					(<a href={siteConfig.url} class="text-foreground underline hover:text-primary"
						>{siteConfig.url}</a
					>), you agree to be bound by these Terms of Service and the accompanying MIT License.
				</p>
			</section>

			<!-- 2. License Grant -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">2. Open Source License (MIT)</h2>
				<p>
					SuperSvelte is licensed under the permissive <strong class="text-foreground"
						>MIT License</strong
					>. You are granted full permission, free of charge, to deal in the software without
					restriction, including the rights to use, copy, modify, merge, publish, distribute,
					sublicense, and sell copies.
				</p>
				<ul class="list-disc space-y-2 pl-5">
					<li>
						<strong class="text-foreground">Commercial & Client Usage:</strong> You may build and deploy
						unlimited personal apps, commercial SaaS products, and client deliverables with zero royalties.
					</li>
					<li>
						<strong class="text-foreground">License Notice:</strong> The copyright notice and permission
						notice shall be included in substantial portions of the software as set forth in the MIT License.
					</li>
				</ul>
			</section>

			<!-- 3. Payments & Taxes -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">3. SaaS Billing Engine & Demo Payments</h2>
				<p>
					All order processing and subscription billing showcased within SuperSvelte is conducted by
					the online reseller and Merchant of Record, <strong class="text-foreground"
						>Polar Payments Inc. ("Polar.sh")</strong
					>. When test or live orders are processed, Polar handles payment execution, sales tax
					calculation, EU VAT compliance, and VAT invoice delivery.
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
					Questions & Inquiries
				</h3>
				<p class="mt-1 text-xs text-muted-foreground">
					For architecture guidance, enterprise questions, or contributor inquiries.
				</p>
			</div>
			<ContactEmailBadge />
		</div>
	</div>
</div>
