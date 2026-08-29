<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		CloudUpload,
		CreditCard,
		Database,
		Radio,
		RefreshCw,
		ShieldCheck,
		Sparkles,
		Zap
	} from '@lucide/svelte';

	import AuthTab from './components/AuthTab.svelte';
	import DbTab from './components/DbTab.svelte';
	import PolarTab from './components/PolarTab.svelte';
	import RpcTab from './components/RpcTab.svelte';
	import SseTab from './components/SseTab.svelte';
	import UploadTab from './components/UploadTab.svelte';

	let { data } = $props();

	let activeTab = $state<'rpc' | 'db' | 'upload' | 'sse' | 'auth' | 'polar'>('rpc');
	let rpcLatency = $state<number | null>(null);
	let cacheSource = $state<string | null>(null);
	let fileCount = $state<number>(0);
	let sseConnected = $state<boolean>(false);

	let rpcTabRef: { runRpcTest: () => Promise<void> } | undefined = $state();
	let dbTabRef: { fetchProjects: () => Promise<void> } | undefined = $state();
</script>

<div
	class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<header class="sticky top-0 z-40 border-b border-border bg-card/60 backdrop-blur-md">
		<div class="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
			<div class="flex items-center gap-3">
				<a
					href={resolve('/')}
					class="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
				>
					<ArrowLeft class="size-4" />
				</a>
				<div>
					<div class="flex items-center gap-2">
						<span class="text-lg font-black">SuperSvelte</span>
						<span
							class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
							>Sandbox v1.0</span
						>
					</div>
					<p class="text-xs text-muted-foreground">Live Infrastructure & Edge Diagnostics</p>
				</div>
			</div>
			<a
				href={resolve('/dashboard')}
				class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
			>
				<span>Go to Dashboard</span>
			</a>
		</div>
	</header>

	<main class="container mx-auto max-w-6xl px-4 py-10">
		<div
			class="mb-8 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-emerald-500/5 to-cyan-500/10 p-6 shadow-xs"
		>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="space-y-1">
					<div class="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
						<Sparkles class="size-4" />
						<span>Interactive Diagnostic Bench</span>
					</div>
					<h1 class="text-2xl font-bold tracking-tight">System Health & Latency Test</h1>
					<p class="max-w-xl text-xs text-muted-foreground">
						Execute live RPC queries, test rate limits, measure Drizzle/Neon query times, test
						UploadThing, stream SSE heartbeats, and test Polar billing.
					</p>
				</div>
				<button
					onclick={() => {
						rpcTabRef?.runRpcTest();
						dbTabRef?.fetchProjects();
					}}
					class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold shadow-xs transition hover:bg-accent"
				>
					<RefreshCw class="size-3.5" />
					<span>Run All Diagnostics</span>
				</button>
			</div>
		</div>

		<!-- Diagnostic Tab Navigation -->
		<div class="mb-8 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs">
			<button
				onclick={() => (activeTab = 'rpc')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'rpc'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Zap class="size-4" />
				<span>1. RPC & Rate Limiter</span>
				{#if rpcLatency !== null}
					<span class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px]"
						>{rpcLatency}ms</span
					>
				{/if}
			</button>

			<button
				onclick={() => (activeTab = 'db')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'db'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Database class="size-4" />
				<span>2. Drizzle DB & Cache</span>
				{#if cacheSource}
					<span
						class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px] uppercase"
						>{cacheSource}</span
					>
				{/if}
			</button>

			<button
				onclick={() => (activeTab = 'upload')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'upload'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<CloudUpload class="size-4" />
				<span>3. Cloud Uploads</span>
				{#if fileCount > 0}
					<span class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px]"
						>{fileCount}</span
					>
				{/if}
			</button>

			<button
				onclick={() => (activeTab = 'sse')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'sse'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Radio class="size-4" />
				<span>4. SSE Realtime</span>
				{#if sseConnected}
					<span class="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
				{/if}
			</button>

			<button
				onclick={() => (activeTab = 'auth')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'auth'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<ShieldCheck class="size-4" />
				<span>5. Better Auth</span>
			</button>

			<button
				onclick={() => (activeTab = 'polar')}
				class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all {activeTab ===
				'polar'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<CreditCard class="size-4" />
				<span>6. Polar Billing</span>
				<span
					class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px] uppercase"
				>
					{data.systemStatus?.polarToken ? 'Active' : 'Unset'}
				</span>
			</button>
		</div>

		<!-- Render Selected Tab -->
		{#if activeTab === 'rpc'}
			<RpcTab bind:this={rpcTabRef} onLatencyUpdate={(ms) => (rpcLatency = ms)} />
		{:else if activeTab === 'db'}
			<DbTab
				bind:this={dbTabRef}
				initialProjects={data.existingProjects}
				onSourceUpdate={(src) => (cacheSource = src)}
			/>
		{:else if activeTab === 'upload'}
			<UploadTab onFileCountUpdate={(cnt) => (fileCount = cnt)} />
		{:else if activeTab === 'sse'}
			<SseTab onStateChange={(connected) => (sseConnected = connected)} />
		{:else if activeTab === 'auth'}
			<AuthTab initialUser={data.user} />
		{:else if activeTab === 'polar'}
			<PolarTab systemStatus={data.systemStatus} />
		{/if}
	</main>
</div>
