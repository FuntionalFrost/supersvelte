<!-- src/routes/test/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { client } from '$lib/api-client';
	import { authClient } from '$lib/auth-client';
	import {
		Activity,
		ArrowLeft,
		CircleAlert,
		CircleCheck,
		CloudUpload,
		Database,
		FileText,
		Lock,
		Plus,
		Radio,
		RefreshCw,
		ShieldCheck,
		Sparkles,
		Terminal,
		Trash2,
		Upload,
		Wifi,
		Zap
	} from '@lucide/svelte';

	// 1. Reactive props from SvelteKit loaders
	let { data } = $props();

	type RpcResponse = {
		error?: string;
		remaining?: number;
		limit?: number;
		reset?: number;
		mode?: string;
		message?: string;
	};

	type ProjectItem = {
		id?: string | number;
		name: string;
		slug?: string;
	};

	type SessionData = {
		user: {
			id: string;
			email: string;
			name?: string | null;
		};
	};

	// Active Tab State ('rpc' | 'db' | 'upload' | 'sse' | 'auth')
	let activeTab = $state<'rpc' | 'db' | 'upload' | 'sse' | 'auth'>('rpc');

	// --- 1. HONO RPC & RATE LIMIT DIAGNOSTIC STATE ---
	let rpcLoading = $state(false);
	let rpcLatency = $state<number | null>(null);
	let rpcResponse = $state<RpcResponse | null>(null);
	let rpcStatus = $state<number | null>(null);

	async function runRpcTest() {
		rpcLoading = true;
		const start = performance.now();
		try {
			const res = await client.api['rate-limited-test'].$get();
			const end = performance.now();
			rpcLatency = Math.round(end - start);
			rpcStatus = res.status;
			rpcResponse = (await res.json()) as RpcResponse;
		} catch (err: unknown) {
			rpcStatus = 500;
			const errorMessage = err instanceof Error ? err.message : 'Network request failed';
			rpcResponse = { error: errorMessage };
		} finally {
			rpcLoading = false;
		}
	}

	// --- 2. DRIZZLE DB & REDIS CACHE DIAGNOSTIC STATE ---
	let dbLoading = $state(false);
	let dbLatency = $state<number | null>(null);
	let projectsList = $state<ProjectItem[]>([]);
	let cacheSource = $state<string | null>(null);
	let newProjectName = $state('');
	let isSubmitting = $state(false);

	// Sync projects from server load data safely
	$effect(() => {
		if (data.existingProjects) {
			projectsList = data.existingProjects as ProjectItem[];
		}
	});

	async function fetchProjects() {
		dbLoading = true;
		const start = performance.now();
		try {
			const res = await client.api.projects.$get();
			const end = performance.now();
			dbLatency = Math.round(end - start);
			if (res.ok) {
				const body = await res.json();
				projectsList = (body.projects as ProjectItem[]) || [];
				cacheSource = body.source || 'db';
			}
		} catch (err) {
			console.error('Failed to fetch projects:', err);
		} finally {
			dbLoading = false;
		}
	}

	async function createProject() {
		if (!newProjectName.trim()) return;
		isSubmitting = true;
		try {
			const res = await client.api.projects.$post({
				json: { name: newProjectName }
			});
			if (res.ok) {
				newProjectName = '';
				await fetchProjects();
			}
		} catch (err) {
			console.error('Failed to create project:', err);
		} finally {
			isSubmitting = false;
		}
	}

	let deletingId = $state<string | number | null>(null);

	async function deleteProject(id: string | number) {
		deletingId = id;
		try {
			const res = await client.api.projects[':id'].$delete({
				param: { id: String(id) }
			});

			if (res.ok) {
				await fetchProjects();
			}
		} catch (err) {
			console.error('Failed to delete project:', err);
		} finally {
			deletingId = null;
		}
	}

	// --- 3. UPLOADTHING CLOUD STORAGE STATE ---
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadedFiles = $state<Array<{ name: string; size: string; url: string; time: string }>>([]);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	async function handleFileUpload(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];

		isUploading = true;
		uploadProgress = 10;

		const progressInterval = setInterval(() => {
			uploadProgress = Math.min(uploadProgress + 20, 90);
		}, 150);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/uploadthing', {
				method: 'POST',
				body: formData
			});

			clearInterval(progressInterval);
			uploadProgress = 100;

			const responseData = res.ok ? await res.json() : null;
			const fileUrl = responseData?.url || URL.createObjectURL(file);

			uploadedFiles = [
				{
					name: file.name,
					size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
					url: fileUrl,
					time: new Date().toLocaleTimeString()
				},
				...uploadedFiles
			];
		} catch (err) {
			console.error('Upload failed:', err);
		} finally {
			setTimeout(() => {
				isUploading = false;
				uploadProgress = 0;
			}, 400);
		}
	}

	// --- 4. UPSTASH SSE STREAMING DIAGNOSTIC STATE ---
	let sseConnected = $state(false);
	let sseMessages = $state<Array<{ id: string; time: string; ping: number; userId: string }>>([]);
	let eventSource: EventSource | null = null;

	function toggleSSE() {
		if (sseConnected) {
			eventSource?.close();
			eventSource = null;
			sseConnected = false;
		} else {
			eventSource = new EventSource('/api/realtime');
			sseConnected = true;

			eventSource.addEventListener('heartbeat', (e: MessageEvent) => {
				const payload = JSON.parse(e.data);
				sseMessages = [
					{
						id: e.lastEventId,
						time: payload.timestamp,
						ping: payload.pingCount,
						userId: payload.userId
					},
					...sseMessages.slice(0, 9)
				];
			});

			eventSource.onerror = () => {
				sseConnected = false;
				eventSource?.close();
			};
		}
	}

	$effect(() => {
		return () => {
			if (eventSource) eventSource.close();
		};
	});

	// --- 5. BETTER AUTH DIAGNOSTIC STATE ---
	let session = $state<SessionData | null>(null);
	let authLoading = $state(true);

	// Sync session state from server load data and client SDK
	$effect(() => {
		if (data.user) {
			session = { user: data.user as SessionData['user'] };
			authLoading = false;
		}

		authClient.getSession().then((res) => {
			if (res.data) {
				session = res.data as SessionData;
			}
			authLoading = false;
		});
	});

	// Auto-run baseline RPC test on mount
	$effect(() => {
		runRpcTest();
	});
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
					title="Back to Landing Page"
				>
					<ArrowLeft class="size-4" />
				</a>
				<div>
					<div class="flex items-center gap-2">
						<span class="text-lg font-black">Super Svelte</span>
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
		<!-- Sandbox Banner -->
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
						UploadThing cloud file uploads, and stream real-time SSE heartbeats directly from Vercel
						Edge.
					</p>
				</div>

				<button
					onclick={() => {
						runRpcTest();
						fetchProjects();
					}}
					class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold shadow-xs transition hover:bg-accent"
				>
					<RefreshCw class="size-3.5 {rpcLoading || dbLoading ? 'animate-spin' : ''}" />
					<span>Run All Diagnostics</span>
				</button>
			</div>
		</div>

		<!-- 5 Diagnostic Tabs Navigation -->
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
					<span class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
						{rpcLatency}ms
					</span>
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
					>
						{cacheSource}
					</span>
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
				{#if uploadedFiles.length > 0}
					<span class="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 font-mono text-[10px]">
						{uploadedFiles.length}
					</span>
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
				<span>5. Better Auth Session</span>
			</button>
		</div>

		<!-- TAB 1: HONO RPC & RATE LIMITER -->
		{#if activeTab === 'rpc'}
			<div class="grid gap-6 md:grid-cols-3">
				<!-- Control Panel -->
				<div class="space-y-4 rounded-xl border border-border bg-card p-6">
					<div class="flex items-center gap-2 text-sm font-bold">
						<Zap class="size-4 text-amber-400" />
						<span>RPC Execution Test</span>
					</div>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Calls <code class="font-mono text-primary">/api/rate-limited-test</code> via 0-codegen Hono
						RPC client. Tests Upstash Redis rate limiting sliding-window middleware.
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
									class="font-mono font-bold {rpcStatus === 200
										? 'text-emerald-500'
										: 'text-red-400'}"
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
									<span class="font-mono font-bold"
										>{rpcResponse.remaining} / {rpcResponse.limit}</span
									>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Live Response Inspector -->
				<div
					class="flex flex-col justify-between rounded-xl border border-border bg-card p-6 md:col-span-2"
				>
					<div>
						<div class="flex items-center justify-between border-b border-border pb-3">
							<div
								class="flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground"
							>
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
								<span class="animate-pulse text-muted-foreground"
									>// Waiting for RPC response...</span
								>
							{:else if rpcResponse}
								{JSON.stringify(rpcResponse, null, 2)}
							{:else}
								<span class="text-muted-foreground">// Click "Trigger RPC Request" to execute</span>
							{/if}
						</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 2: DRIZZLE DB & REDIS CACHE -->
		{#if activeTab === 'db'}
			<div class="grid gap-6 md:grid-cols-3">
				<!-- Form & Actions -->
				<div class="space-y-4 rounded-xl border border-border bg-card p-6">
					<div class="flex items-center gap-2 text-sm font-bold">
						<Database class="size-4 text-emerald-400" />
						<span>Neon Postgres + Drizzle</span>
					</div>
					<p class="text-xs leading-relaxed text-muted-foreground">
						First fetch queries Neon Serverless DB and caches result in Upstash Redis. Mutations
						auto-invalidate cache.
					</p>

					<form
						onsubmit={(e) => {
							e.preventDefault();
							createProject();
						}}
						class="space-y-3"
					>
						<div class="space-y-1">
							<label for="pname" class="text-[11px] font-semibold text-muted-foreground"
								>New Project Name</label
							>
							<input
								id="pname"
								type="text"
								bind:value={newProjectName}
								placeholder="e.g. Acme Dashboard"
								class="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-hidden"
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting || !newProjectName.trim()}
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
						>
							{#if isSubmitting}
								<RefreshCw class="size-3.5 animate-spin" />
								<span>Inserting to DB...</span>
							{:else}
								<Plus class="size-3.5" />
								<span>Add Project to DB</span>
							{/if}
						</button>
					</form>

					<div class="border-t border-border/60 pt-2">
						<button
							onclick={fetchProjects}
							disabled={dbLoading}
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 py-2 text-xs font-semibold transition hover:bg-accent"
						>
							<RefreshCw class="size-3.5 {dbLoading ? 'animate-spin' : ''}" />
							<span>Re-fetch Query ({dbLatency ?? 0}ms)</span>
						</button>
					</div>
				</div>

				<!-- Live DB Projects List -->
				<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
					<div class="flex items-center justify-between border-b border-border pb-3">
						<div class="flex items-center gap-2">
							<span class="text-xs font-bold">Live DB Records ({projectsList.length})</span>
							{#if cacheSource === 'redis'}
								<span
									class="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400"
								>
									⚡ Redis Cache Hit
								</span>
							{:else if cacheSource === 'db'}
								<span
									class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
								>
									🐘 Neon DB Query Hit
								</span>
							{/if}
						</div>

						<span class="font-mono text-xs text-muted-foreground">
							{dbLatency !== null ? `${dbLatency}ms` : ''}
						</span>
					</div>

					<div class="mt-4 space-y-2">
						{#if dbLoading && projectsList.length === 0}
							<div class="animate-pulse py-8 text-center text-xs text-muted-foreground">
								Loading projects from Neon DB...
							</div>
						{:else if projectsList.length === 0}
							<div class="py-8 text-center text-xs text-muted-foreground">
								No projects found in database. Create one using the form!
							</div>
						{:else}
							{#each projectsList as p (p.id ?? p.name)}
								<div
									class="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3 text-xs"
								>
									<div class="space-y-0.5">
										<div class="font-semibold">{p.name}</div>
										<div class="font-mono text-[10px] text-muted-foreground">
											{p.slug || 'no-slug'}
										</div>
									</div>
									<span
										class="rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-muted-foreground"
									>
										ID: {String(p.id).slice(0, 8)}...
									</span>

									{#if p.id}
										<button
											onclick={() => deleteProject(p.id!)}
											disabled={deletingId === p.id}
											class="rounded-md border border-border bg-card p-1.5 text-muted-foreground transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
											title="Delete Project"
										>
											{#if deletingId === p.id}
												<RefreshCw class="size-3.5 animate-spin" />
											{:else}
												<Trash2 class="size-3.5" />
											{/if}
										</button>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 3: UPLOADTHING CLOUD FILE UPLOADS -->
		{#if activeTab === 'upload'}
			<div class="grid gap-6 md:grid-cols-3">
				<!-- Dropzone & Upload Action -->
				<div class="space-y-4 rounded-xl border border-border bg-card p-6">
					<div class="flex items-center gap-2 text-sm font-bold">
						<CloudUpload class="size-4 text-pink-400" />
						<span>UploadThing & UTAPI</span>
					</div>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Direct-to-cloud file uploads with S3 storage, pre-wired route handlers, and type-safe
						server responses.
					</p>

					<!-- Drag & Drop Target Box -->
					<div
						onclick={() => fileInputRef?.click()}
						onkeydown={(e) => e.key === 'Enter' && fileInputRef?.click()}
						role="button"
						tabindex="0"
						class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition hover:border-primary/50 hover:bg-primary/5"
					>
						<Upload class="size-8 text-muted-foreground" />
						<div class="text-xs font-semibold">Click or drag file to upload</div>
						<div class="text-[10px] text-muted-foreground">
							Images, PDFs, or Documents up to 16MB
						</div>
					</div>

					<input
						type="file"
						bind:this={fileInputRef}
						onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
						class="hidden"
					/>

					{#if isUploading}
						<div class="space-y-1.5">
							<div class="flex justify-between text-[11px] font-semibold">
								<span>Uploading to cloud...</span>
								<span class="font-mono">{uploadProgress}%</span>
							</div>
							<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div
									class="h-full bg-primary transition-all duration-200"
									style="width: {uploadProgress}%;"
								></div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Uploaded Files List -->
				<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
					<div class="flex items-center justify-between border-b border-border pb-3">
						<div class="flex items-center gap-2 text-xs font-bold">
							<FileText class="size-4 text-pink-400" />
							<span>Cloud Upload Log ({uploadedFiles.length})</span>
						</div>
						<span class="font-mono text-[11px] text-muted-foreground">S3 Storage Ready</span>
					</div>

					<div class="mt-4 space-y-2">
						{#if uploadedFiles.length === 0}
							<div class="py-12 text-center text-xs text-muted-foreground">
								No files uploaded yet. Click the dropzone to test UploadThing!
							</div>
						{:else}
							{#each uploadedFiles as f (f.name + f.time)}
								<div
									class="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-3 text-xs"
								>
									<div class="flex items-center gap-3">
										<FileText class="size-4 shrink-0 text-primary" />
										<div class="space-y-0.5">
											<div class="font-semibold text-foreground">{f.name}</div>
											<div class="font-mono text-[10px] text-muted-foreground">
												{f.size} • {f.time}
											</div>
										</div>
									</div>

									<a
										href={f.url}
										target="_blank"
										rel="external"
										class="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] font-semibold text-primary hover:bg-accent"
									>
										View File
									</a>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 4: UPSTASH SSE STREAMING -->
		{#if activeTab === 'sse'}
			<div class="grid gap-6 md:grid-cols-3">
				<!-- Stream Controls -->
				<div class="space-y-4 rounded-xl border border-border bg-card p-6">
					<div class="flex items-center gap-2 text-sm font-bold">
						<Radio class="size-4 text-cyan-400" />
						<span>Server-Sent Events</span>
					</div>
					<p class="text-xs leading-relaxed text-muted-foreground">
						Streams live heartbeat events from Hono’s <code class="font-mono text-primary"
							>streamSSE</code
						> middleware over HTTP/2 without WebSockets overhead.
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

				<!-- Live SSE Event Terminal -->
				<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
					<div class="flex items-center justify-between border-b border-border pb-3">
						<div class="flex items-center gap-2 text-xs font-bold">
							<Activity class="size-4 text-emerald-400" />
							<span>Live Event Log ({sseMessages.length})</span>
						</div>
						{#if sseConnected}
							<span class="animate-pulse font-mono text-[10px] font-semibold text-emerald-500">
								● Listening to /api/realtime
							</span>
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
										>
											Event #{msg.id}
										</span>
										<span class="text-foreground">Ping: {msg.ping}</span>
									</div>
									<div class="text-[11px] text-muted-foreground">
										{msg.time}
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 5: BETTER AUTH SESSION -->
		{#if activeTab === 'auth'}
			<div class="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
				<div class="flex items-center justify-between border-b border-border pb-4">
					<div class="flex items-center gap-2">
						<ShieldCheck class="size-5 text-indigo-400" />
						<div>
							<h3 class="text-sm font-bold">Better Auth Session Diagnostics</h3>
							<p class="text-xs text-muted-foreground">
								Inspect active session token state & cookie context
							</p>
						</div>
					</div>

					<div class="flex items-center gap-1.5">
						{#if session}
							<span
								class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500"
							>
								<CircleCheck class="size-3" />
								Authenticated
							</span>
						{:else}
							<span
								class="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500"
							>
								<CircleAlert class="size-3" />
								Guest Mode
							</span>
						{/if}
					</div>
				</div>

				{#if authLoading}
					<div class="animate-pulse py-8 text-center text-xs text-muted-foreground">
						Reading session state from cookies...
					</div>
				{:else if session}
					<div class="space-y-4">
						<div class="space-y-2 rounded-lg bg-muted/50 p-4 font-mono text-xs">
							<div class="flex justify-between">
								<span class="text-muted-foreground">User ID:</span>
								<span class="font-semibold text-foreground">{session.user.id}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Email:</span>
								<span class="font-semibold text-foreground">{session.user.email}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Name:</span>
								<span class="font-semibold text-foreground">{session.user.name || 'N/A'}</span>
							</div>
						</div>

						<a
							href={resolve('/dashboard')}
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
						>
							<span>Enter Protected App Area</span>
						</a>
					</div>
				{:else}
					<div class="space-y-4 py-4 text-center">
						<p class="mx-auto max-w-sm text-xs text-muted-foreground">
							No active authentication session detected. Sign in on the login route to test
							protected database queries and SSE streams.
						</p>

						<a
							href={resolve('/login')}
							class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
						>
							<Lock class="size-3.5" />
							<span>Go to Auth Login Route</span>
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>
