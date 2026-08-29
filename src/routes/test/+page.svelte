<!-- src/routes/test/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		Cloud,
		CreditCard,
		Database,
		Radio,
		RefreshCw,
		ShieldCheck,
		Sparkles,
		Zap
	} from '@lucide/svelte';
	import type { PageData } from './$types';

	import AuthTab from './components/AuthTab.svelte';
	import DbTab from './components/DbTab.svelte';
	import PolarTab from './components/PolarTab.svelte';
	import RpcTab from './components/RpcTab.svelte';
	import SseTab from './components/SseTab.svelte';
	import UploadTab from './components/UploadTab.svelte';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'rpc' | 'db' | 'upload' | 'sse' | 'auth' | 'polar'>('rpc');
	let rpcLatency = $state<number | null>(null);
	let cacheSource = $state<string | null>(null);

	let rpcTabRef: { runRpcTest: () => Promise<void> } | undefined = $state();
	let dbTabRef: { fetchProjects: () => Promise<void> } | undefined = $state();
</script>

<div
	class="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
>
	<!-- Top Navigation Header -->
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
						>
							Sandbox v1.0
						</span>
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
		<!-- Diagnostic Banner -->
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

		<!-- Diagnostic Tab Navigation (Fixed Height + Tabular Layout) -->
		<div
			class="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-xs sm:grid-cols-3 lg:grid-cols-6"
		>
			<!-- Tab 1: RPC & Rate Limiter -->
			<button
				onclick={() => (activeTab = 'rpc')}
				class="flex h-9 items-center justify-between gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'rpc'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<div class="flex items-center gap-1.5 truncate">
					<Zap class="size-3.5 shrink-0" />
					<span class="truncate">1. RPC</span>
				</div>
				{#if rpcLatency !== null}
					<span
						class="inline-flex min-w-11 items-center justify-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums {activeTab ===
						'rpc'
							? 'bg-primary-foreground/20 text-primary-foreground'
							: 'bg-muted text-foreground'}"
					>
						{rpcLatency}ms
					</span>
				{/if}
			</button>

			<!-- Tab 2: Drizzle DB & Cache -->
			<button
				onclick={() => (activeTab = 'db')}
				class="flex h-9 items-center justify-between gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'db'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<div class="flex items-center gap-1.5 truncate">
					<Database class="size-3.5 shrink-0" />
					<span class="truncate">2. DB & Cache</span>
				</div>
				{#if cacheSource}
					<span
						class="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase {cacheSource ===
						'redis'
							? 'bg-emerald-500/20 text-emerald-500'
							: 'bg-muted text-muted-foreground'}"
					>
						{cacheSource}
					</span>
				{/if}
			</button>

			<!-- Tab 3: Cloud Uploads -->
			<button
				onclick={() => (activeTab = 'upload')}
				class="flex h-9 items-center gap-1.5 truncate rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'upload'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<Cloud class="size-3.5 shrink-0" />
				<span class="truncate">3. Uploads</span>
			</button>

			<!-- Tab 4: SSE Realtime -->
			<button
				onclick={() => (activeTab = 'sse')}
				class="flex h-9 items-center gap-1.5 truncate rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'sse'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<Radio class="size-3.5 shrink-0" />
				<span class="truncate">4. Realtime</span>
			</button>

			<!-- Tab 5: Better Auth -->
			<button
				onclick={() => (activeTab = 'auth')}
				class="flex h-9 items-center gap-1.5 truncate rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'auth'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<ShieldCheck class="size-3.5 shrink-0" />
				<span class="truncate">5. Auth</span>
			</button>

			<!-- Tab 6: Polar Billing -->
			<button
				onclick={() => (activeTab = 'polar')}
				class="flex h-9 items-center justify-between gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all {activeTab ===
				'polar'
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
			>
				<div class="flex items-center gap-1.5 truncate">
					<CreditCard class="size-3.5 shrink-0" />
					<span class="truncate">6. Polar</span>
				</div>
				<span
					class="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase {activeTab === 'polar'
						? 'bg-primary-foreground/20 text-primary-foreground'
						: 'bg-muted text-muted-foreground'}"
				>
					Active
				</span>
			</button>
		</div>

		<!-- Render Selected Tab Panel -->
		{#if activeTab === 'rpc'}
			<RpcTab
				bind:this={rpcTabRef}
				onLatencyUpdate={(ms) => {
					rpcLatency = ms;
				}}
			/>
		{:else if activeTab === 'db'}
			<DbTab
				bind:this={dbTabRef}
				initialProjects={data.existingProjects}
				onSourceUpdate={(src) => {
					cacheSource = src;
				}}
			/>
		{:else if activeTab === 'upload'}
			<UploadTab />
		{:else if activeTab === 'sse'}
			<SseTab />
		{:else if activeTab === 'auth'}
			<AuthTab initialUser={data.user} />
		{:else if activeTab === 'polar'}
			<PolarTab systemStatus={data.systemStatus} />
		{/if}
	</main>
</div>
