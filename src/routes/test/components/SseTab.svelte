<script lang="ts">
	import { Activity, Radio, Wifi } from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	let { onStateChange } = $props<{ onStateChange?: (connected: boolean) => void }>();

	let sseConnected = $state(false);
	let sseMessages = $state<Array<{ id: string; time: string; ping: number; userId: string }>>([]);
	let eventSource: EventSource | null = null;

	function toggleSSE() {
		if (sseConnected) {
			eventSource?.close();
			eventSource = null;
			sseConnected = false;
			onStateChange?.(false);
		} else {
			eventSource = new EventSource('/api/realtime');
			sseConnected = true;
			onStateChange?.(true);

			eventSource.addEventListener('heartbeat', (e: MessageEvent) => {
				const payload = JSON.parse(e.data);
				sseMessages = [
					{
						id: e.lastEventId,
						time: new Date().toLocaleTimeString(),
						ping: payload.count,
						userId: payload.userId
					},
					...sseMessages.slice(0, 9)
				];
			});

			eventSource.onerror = () => {
				sseConnected = false;
				eventSource?.close();
				onStateChange?.(false);
			};
		}
	}

	onDestroy(() => {
		if (eventSource) eventSource.close();
	});
</script>

<div class="grid gap-6 md:grid-cols-3">
	<div class="space-y-4 rounded-xl border border-border bg-card p-6">
		<div class="flex items-center gap-2 text-sm font-bold">
			<Radio class="size-4 text-cyan-400" />
			<span>Server-Sent Events</span>
		</div>
		<p class="text-xs leading-relaxed text-muted-foreground">
			Streams live heartbeat events from Hono’s <code class="font-mono text-primary">streamSSE</code
			> middleware over HTTP/2.
		</p>

		<button
			onclick={toggleSSE}
			class="inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition {sseConnected
				? 'bg-red-500 text-white hover:bg-red-600'
				: 'bg-primary text-primary-foreground hover:bg-primary/90'}"
		>
			<Wifi class="size-4" />
			<span>{sseConnected ? 'Disconnect Stream' : 'Connect SSE Stream'}</span>
		</button>

		<div class="space-y-2 border-t border-border/60 pt-2 text-xs">
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">Status:</span>
				<span
					class="flex items-center gap-1.5 font-bold {sseConnected
						? 'text-emerald-500'
						: 'text-muted-foreground'}"
				>
					<span
						class="size-2 rounded-full {sseConnected
							? 'animate-pulse bg-emerald-500'
							: 'bg-muted-foreground'}"
					></span>
					{sseConnected ? 'LIVE STREAMING' : 'Idle'}
				</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">Interval:</span>
				<span class="font-mono">3,000 ms</span>
			</div>
		</div>
	</div>

	<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
		<div class="flex items-center justify-between border-b border-border pb-3">
			<div class="flex items-center gap-2 text-xs font-bold">
				<Activity class="size-4 text-emerald-400" />
				<span>Live Event Log ({sseMessages.length})</span>
			</div>
			{#if sseConnected}
				<span class="animate-pulse font-mono text-[10px] font-semibold text-emerald-500"
					>● Listening to /api/realtime</span
				>
			{/if}
		</div>

		<div class="mt-4 space-y-2">
			{#if sseMessages.length === 0}
				<div class="py-12 text-center text-xs text-muted-foreground">
					{sseConnected
						? 'Waiting for first heartbeat tick...'
						: 'Click "Connect SSE Stream" to begin receiving live events.'}
				</div>
			{:else}
				{#each sseMessages as msg (msg.id + msg.time)}
					<div
						class="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-3 font-mono text-xs transition-all"
					>
						<div class="flex items-center gap-3">
							<span
								class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
								>Event #{msg.id}</span
							>
							<span class="text-foreground">Ping: {msg.ping}</span>
						</div>
						<div class="text-[11px] text-muted-foreground">{msg.time}</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
