<!-- src/routes/(marketing)/privacy/+page.svelte -->
<script lang="ts">
	import ContactEmailBadge from '$lib/components/ContactEmailBadge.svelte';
	import { Seo } from 'yaxa-svelte';
	import { siteConfig } from '../../../site.config';
</script>

<Seo
	title="Privacy Policy — SuperSvelte"
	description="How SuperSvelte handles, secures, and protects your personal data in full compliance with GDPR and global privacy standards."
	ogImage={{
		title: 'Privacy Policy',
		description: 'Data collection & privacy protection principles',
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
					GDPR Compliant
				</span>
			</div>

			<h1 class="text-3xl font-black tracking-tight text-foreground sm:text-5xl">Privacy Policy</h1>

			<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
				How SuperSvelte handles, secures, and protects your personal data in full compliance with
				GDPR and global privacy standards.
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
			<!-- 1. Overview -->
			<section class="space-y-3 pt-6 first:pt-0">
				<h2 class="text-lg font-bold text-foreground">1. Overview & Data Controller</h2>
				<p>
					This Privacy Policy outlines how <strong class="text-foreground">SuperSvelte</strong>
					("we", "us", or "our"), operating at
					<a href={siteConfig.url} class="text-foreground underline hover:text-primary"
						>{siteConfig.url}</a
					>, collects, processes, and protects your personal data. We are dedicated to respecting
					your privacy and strictly upholding the European Union General Data Protection Regulation
					(GDPR), the UK GDPR, and applicable global data privacy regulations.
				</p>
			</section>

			<!-- 2. Data Collected -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">2. Information We Collect</h2>
				<p>
					We collect minimal personal information strictly essential for delivering our software and
					repository access:
				</p>
				<ul class="list-disc space-y-2 pl-5">
					<li>
						<strong class="text-foreground">Account & Identity Data:</strong> When authenticating or creating
						an account, we store your name, email address, and GitHub username to grant repository access.
					</li>
					<li>
						<strong class="text-foreground">Authentication Logs:</strong> Cryptographically hashed session
						tokens and sign-in timestamps to secure your account and prevent unauthorized access.
					</li>
					<li>
						<strong class="text-foreground">Communications:</strong> Inquiries sent directly to our
						maintainer email address at
						<a href="mailto:{siteConfig.email}" class="text-foreground underline"
							>{siteConfig.email}</a
						>.
					</li>
				</ul>
			</section>

			<!-- 3. Payments -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">3. Payments & Merchant of Record</h2>
				<p>
					All payments, recurring billing, and European Union VAT / sales tax calculations are
					handled by <strong class="text-foreground">Polar Payments Inc. ("Polar.sh")</strong> acting
					as Merchant of Record. We never receive, store, or process raw credit card numbers or banking
					credentials on our local servers. Polar processes all transaction data under strict PCI-DSS
					Level 1 compliance.
				</p>
			</section>

			<!-- 4. Zero Tracking -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">4. Privacy-First Zero-Tracking Guarantee</h2>
				<p>
					We do not sell, rent, or trade your personal information. We do not operate behavioral
					tracking scripts, cross-site profiling pixels, or third-party data analytics cookies.
				</p>
			</section>

			<!-- 5. Cookies -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">5. Cookies & Local Storage</h2>
				<p>
					Our website utilizes client-side <code
						class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
						>localStorage</code
					> solely to preserve functional user preferences (such as your chosen dark/light color mode).
					We do not use persistent advertising trackers or third-party profiling cookies.
				</p>
			</section>

			<!-- 6. GDPR Rights -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">
					6. Your Rights Under GDPR & International Privacy Laws
				</h2>
				<p>
					Under GDPR and equivalent data protection regulations, you hold the following statutory
					rights:
				</p>
				<ul class="list-disc space-y-1.5 pl-5">
					<li>
						<strong class="text-foreground">Right of Access:</strong> Request a complete copy of the personal
						data we hold about you.
					</li>
					<li>
						<strong class="text-foreground">Right to Rectification:</strong> Correct any inaccurate or
						incomplete personal information.
					</li>
					<li>
						<strong class="text-foreground">Right to Erasure:</strong> Request permanent deletion of your
						account and personal identifiers.
					</li>
					<li>
						<strong class="text-foreground">Right to Data Portability:</strong> Receive your data in a
						structured, machine-readable format.
					</li>
				</ul>
				<p class="pt-1">
					To exercise any of these rights, email our data protection representative at <a
						href="mailto:{siteConfig.email}"
						class="text-foreground underline">{siteConfig.email}</a
					>.
				</p>
			</section>

			<!-- 7. Contact -->
			<section class="space-y-3 pt-8">
				<h2 class="text-lg font-bold text-foreground">7. Contact & Data Protection Officer</h2>
				<p>
					For any questions, compliance verification, or data requests regarding this Privacy
					Policy, please contact us directly.
				</p>
			</section>
		</div>

		<!-- Direct Inquiry Box -->
		<div
			class="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card/70 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<h3 class="text-xs font-bold tracking-wider text-foreground uppercase">
					Have Privacy or GDPR Questions?
				</h3>
				<p class="mt-1 text-xs text-muted-foreground">
					Submit data requests, GDPR queries, or deletion notices directly to our maintainer.
				</p>
			</div>
			<ContactEmailBadge />
		</div>
	</div>
</div>
