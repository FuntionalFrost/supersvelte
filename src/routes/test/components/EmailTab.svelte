<!-- src/routes/test/components/EmailTab.svelte -->
<script lang="ts">
	import { CheckCircle, Mail, RefreshCw, Send } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let recipient = $state('developer@example.com');
	let name = $state('Alex Developer');
	let isSending = $state(false);
	let lastDispatched = $state<{
		id: string;
		subject: string;
		to: string;
		timestamp: string;
	} | null>(null);

	async function fetchLatestEmail() {
		try {
			const res = await fetch('/api/dev/last-email?format=json');
			if (res.ok) {
				const data = await res.json();
				if (data.email) {
					lastDispatched = {
						id: data.email.id,
						subject: data.email.subject,
						to: data.email.to,
						timestamp: data.email.timestamp
					};
				}
			}
		} catch (e) {
			console.error('Failed to load latest dev email', e);
		}
	}

	async function sendTestEmail() {
		isSending = true;
		try {
			const formData = new FormData();
			formData.set('email', recipient);
			formData.set('name', name);

			const res = await fetch('/test?/sendTestEmail', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				toast.success('Test email triggered! Check terminal or live preview below.');
				await fetchLatestEmail();
			} else {
				toast.error('Failed to trigger test email');
			}
		} catch {
			toast.error('Network error triggering test email');
		} finally {
			isSending = false;
		}
	}

	$effect(() => {
		fetchLatestEmail();
	});
</script>

<div class="space-y-6">
	<div class="rounded-2xl border border-border bg-card p-6 shadow-xs">
		<div class="flex items-center justify-between border-b border-border pb-4">
			<div class="flex items-center gap-3">
				<div
					class="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"
				>
					<Mail class="size-5" />
				</div>
				<div>
					<h2 class="text-base font-bold">Transactional Email & Dev Fallback</h2>
					<p class="text-xs text-muted-foreground">
						Production Resend delivery with automatic zero-dependency Terminal ASCII & In-Browser
						Preview fallback.
					</p>
				</div>
			</div>

			<button
				onclick={fetchLatestEmail}
				class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent"
			>
				<RefreshCw class="size-3" />
				<span>Refresh Preview</span>
			</button>
		</div>

		<!-- Test Trigger Form -->
		<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="space-y-1">
				<label for="email-recipient" class="text-xs font-semibold text-muted-foreground"
					>Recipient Email</label
				>
				<input
					id="email-recipient"
					type="email"
					bind:value={recipient}
					class="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
				/>
			</div>

			<div class="space-y-1">
				<label for="email-name" class="text-xs font-semibold text-muted-foreground">User Name</label
				>
				<input
					id="email-name"
					type="text"
					bind:value={name}
					class="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
				/>
			</div>

			<div class="flex items-end">
				<button
					onclick={sendTestEmail}
					disabled={isSending}
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50"
				>
					<Send class="size-3.5" />
					<span>{isSending ? 'Dispatching...' : 'Send Welcome Email'}</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Live In-Browser Email Preview Sandbox -->
	<div class="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<CheckCircle class="size-4 text-emerald-400" />
				<h3 class="text-sm font-bold">Latest Rendered Svelte 5 Email</h3>
			</div>

			{#if lastDispatched}
				<div class="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
					<span>To: {lastDispatched.to}</span>
					<span>•</span>
					<span>{new Date(lastDispatched.timestamp).toLocaleTimeString()}</span>
				</div>
			{/if}
		</div>

		<div class="min-h-[380px] overflow-hidden rounded-xl border border-border bg-white">
			<iframe
				src="/api/dev/last-email"
				title="Dev Email Render Preview"
				class="h-96 w-full border-0"
			></iframe>
		</div>
	</div>
</div>
