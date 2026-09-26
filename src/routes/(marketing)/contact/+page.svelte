<!-- src/routes/(marketing)/contact/+page.svelte -->
<script lang="ts">
	import { Check, Copy, HelpCircle, Mail, MessageSquare, Shield, Sparkles } from '@lucide/svelte';
	import { Seo } from 'yaxa-svelte';
	import { toast } from 'svelte-sonner';
	import { siteConfig } from '../../../site.config';

	let copied = $state(false);
	const email = 'devfrost@protonmail.com';

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			toast.success('Email address copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			toast.error('Failed to copy email to clipboard');
		}
	}
</script>

<Seo
	title="Contact & Support — SuperSvelte"
	description="Get in touch with the SuperSvelte core team for technical support, licensing inquiries, and repository access."
	ogImage={{
		title: 'Contact & Support',
		description: 'Reach out to the SuperSvelte maintainers',
		badge: 'Support'
	}}
/>

<div class="relative min-h-[calc(100vh-14rem)] py-16 sm:py-24">
	<!-- Background Glow -->
	<div
		class="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"
	></div>

	<div class="relative container mx-auto max-w-4xl px-4">
		<!-- Header -->
		<div class="mx-auto max-w-2xl space-y-4 text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-xs"
			>
				<HelpCircle class="size-3.5 text-primary" />
				<span>Developer Support & Inquiries</span>
			</div>
			<h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
				Get in <span
					class="bg-linear-to-r from-teal-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent"
					>Touch</span
				>
			</h1>
			<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
				Have questions about SuperSvelte architecture, your commercial license, or need help
				integrating with your stack? We are here to help.
			</p>
		</div>

		<!-- Direct Email Card -->
		<div
			class="mt-12 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
		>
			<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-start gap-4">
					<div
						class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"
					>
						<Mail class="size-6 text-teal-400" />
					</div>
					<div class="space-y-1">
						<h2 class="text-base font-bold text-foreground">Direct Maintainer Email</h2>
						<p class="text-xs text-muted-foreground">
							Typical response time within 24 hours on business days.
						</p>

						<!-- Visible Mailto + Inline Copy Pair -->
						<div
							class="mt-2 inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-sm shadow-xs backdrop-blur-sm"
						>
							<a
								href="mailto:{email}"
								class="font-semibold text-foreground transition hover:text-primary hover:underline"
							>
								{email}
							</a>
							<button
								type="button"
								onclick={copyEmail}
								class="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
								title="Copy email to clipboard"
								aria-label="Copy email address"
							>
								{#if copied}
									<Check class="size-3.5 text-emerald-400" />
								{:else}
									<Copy class="size-3.5" />
								{/if}
							</button>
						</div>
					</div>
				</div>

				<div class="flex shrink-0 items-center gap-3">
					<a
						href="mailto:{email}"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background shadow-xs transition hover:bg-foreground/90"
					>
						<Mail class="size-3.5" />
						<span>Send Email</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Support Topics Grid -->
		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			<div class="space-y-2 rounded-xl border border-border bg-card/60 p-5">
				<div class="flex items-center gap-2 text-xs font-bold text-foreground">
					<Shield class="size-4 text-teal-400" />
					<span>License & Billing</span>
				</div>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Assistance with Polar.sh orders, receipt regeneration, invoices, and license upgrades.
				</p>
			</div>

			<div class="space-y-2 rounded-xl border border-border bg-card/60 p-5">
				<div class="flex items-center gap-2 text-xs font-bold text-foreground">
					<Sparkles class="size-4 text-cyan-400" />
					<span>GitHub Repo Access</span>
				</div>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Bought a Pro license? Send us your GitHub username to receive an invite to the private
					repository.
				</p>
			</div>

			<div class="space-y-2 rounded-xl border border-border bg-card/60 p-5">
				<div class="flex items-center gap-2 text-xs font-bold text-foreground">
					<MessageSquare class="size-4 text-emerald-400" />
					<span>Technical Queries</span>
				</div>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Guidance on Svelte 5 runes, Drizzle migrations, Neon connection pooling, and Hono RPC
					routes.
				</p>
			</div>
		</div>

		<!-- Bottom GitHub banner -->
		<div
			class="mt-8 rounded-xl border border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground"
		>
			Prefer public discussions? Open an issue on our <a
				href={siteConfig.project?.repositoryUrl || 'https://github.com/FunctionalFrost/supersvelte'}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-foreground underline hover:text-primary">GitHub Repository</a
			>.
		</div>
	</div>
</div>
