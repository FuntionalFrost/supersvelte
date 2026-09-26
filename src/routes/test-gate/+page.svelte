<!-- src/routes/test-gate/+page.svelte -->
<script lang="ts">
	import { Gate } from 'yaxa-svelte';
	import { ShieldAlert, ShieldCheck } from '@lucide/svelte';
</script>

<div class="mx-auto max-w-xl space-y-6 p-8">
	<div class="space-y-1 border-b border-border pb-4">
		<h1 class="text-xl font-bold">Feature Gate Diagnostic</h1>
		<p class="text-xs text-muted-foreground">
			Verifies declarative <code>&lt;Gate&gt;</code> evaluation for the <strong>PRO</strong> tier.
		</p>
	</div>

	<Gate requiredPlan="pro">
		<div
			class="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-500"
		>
			<ShieldCheck class="size-5 shrink-0" />
			<div>
				<p class="font-bold">Access Granted</p>
				<p class="text-[11px] opacity-80">You have an active Pro license.</p>
			</div>
		</div>

		{#snippet fallback()}
			<div
				class="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-semibold text-amber-500"
			>
				<ShieldAlert class="size-5 shrink-0" />
				<div>
					<p class="font-bold">Pro License Required</p>
					<p class="text-[11px] opacity-80">Upgrade your account to unlock this feature.</p>
				</div>
			</div>
		{/snippet}
	</Gate>
</div>
