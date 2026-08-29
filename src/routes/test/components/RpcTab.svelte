<script lang="ts">
	import { client } from '$lib/api-client';
	import { RefreshCw, Terminal, Zap } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { onLatencyUpdate } = $props<{ onLatencyUpdate?: (ms: number | null) => void }>();

	type RpcResponse = {
		error?: string;
		remaining?: number;
		limit?: number;
		reset?: number;
		mode?: string;
		message?: string;
	};

	let rpcLoading = $state(false);
	let rpcLatency = $state<number | null>(null);
	let rpcResponse = $state<RpcResponse | null>(null);
	let rpcStatus = $state<number | null>(null);

	export async function runRpcTest() {
		rpcLoading = true;
		const start = performance.now();
		try {
			const res = await client.api['rate-limited-test'].$get();
			const end = performance.now();
			rpcLatency = Math.round(end - start);
			rpcStatus = res.status;
			rpcResponse = (await res.json()) as RpcResponse;
			onLatencyUpdate?.(rpcLatency);
		} catch (err: unknown) {
			rpcStatus = 500;
			const msg = err instanceof Error ? err.message : 'Network request failed';
			rpcResponse = { error: msg };
		} finally {
			rpcLoading = false;
		}
	}

	onMount(() => {
		runRpcTest();
	});
</script>

<div class="grid gap-6 md:grid-cols-3">
	<div class="space-y-4 rounded-xl border border-border bg-card p-6">
		<div class="flex items-center gap-2 text-sm font-bold">
			<Zap class="size-4 text-amber-400" />
			<span>RPC Execution Test</span>
		</div>
		<p class="text-xs leading-relaxed text-muted-foreground">
			Calls <code class="font-mono text-primary">/api/rate-limited-test</code> via 0-codegen Hono RPC
			client. Tests Upstash Redis sliding-window rate limiting.
		</p>

		<button
			onclick={runRpcTest}
			disabled={rpcLoading}
			class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
		>
			{#if rpcLoading}
				<RefreshCw class="size-4 animate-spin" />
				<span>Executing RPC...</span>
			{:else}
				<Zap class="size-4" />
				<span>Trigger RPC Request</span>
			{/if}
		</button>

		{#if rpcResponse}
			<div class="space-y-2 border-t border-border/60 pt-2">
				<div class="flex items-center justify-between text-xs">
					<span class="text-muted-foreground">HTTP Status:</span>
					<span
						class="font-mono font-bold {rpcStatus === 200 ? 'text-emerald-500' : 'text-red-400'}"
					>
						{rpcStatus}
						{rpcStatus === 200 ? 'OK' : 'Rate Limited'}
					</span>
				</div>
				<div class="flex items-center justify-between text-xs">
					<span class="text-muted-foreground">Round-trip Latency:</span>
					<span class="font-mono font-bold text-amber-400">{rpcLatency} ms</span>
				</div>
				{#if rpcResponse.remaining !== undefined}
					<div class="flex items-center justify-between text-xs">
						<span class="text-muted-foreground">Remaining Window:</span>
						<span class="font-mono font-bold">{rpcResponse.remaining} / {rpcResponse.limit}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div
		class="flex flex-col justify-between rounded-xl border border-border bg-card p-6 md:col-span-2"
	>
		<div>
			<div class="flex items-center justify-between border-b border-border pb-3">
				<div class="flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground">
					<Terminal class="size-4 text-cyan-400" />
					<span>GET /api/rate-limited-test</span>
				</div>
				{#if rpcLatency}
					<span
						class="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-500"
					>
						⚡ {rpcLatency}ms Edge Response
					</span>
				{/if}
			</div>

			<pre
				class="mt-4 overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-xs leading-relaxed text-foreground">
{#if rpcLoading}
					<span class="animate-pulse text-muted-foreground">// Waiting for RPC response...</span>
				{:else if rpcResponse}
					{JSON.stringify(rpcResponse, null, 2)}
				{:else}
					<span class="text-muted-foreground">// Click "Trigger RPC Request" to execute</span>
				{/if}
			</pre>
		</div>
	</div>
</div>
