<!-- src/routes/test/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { api } from '$lib/api-client';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { RealtimeStream } from '$lib/realtime.svelte';
	import { createUploadThing } from '$lib/uploadthing';
	import autoAnimate from '@formkit/auto-animate';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	// 1. Instantiate Realtime Stream Class Rune
	const realtime = new RealtimeStream();

	// 2. Superforms Setup
	// svelte-ignore state_referenced_locally
	const projectSuperForm = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Project saved to Neon Postgres!');
			} else {
				toast.error('Validation failed. Please check form inputs.');
			}
		}
	});

	const {
		form: projectFormData,
		errors: projectErrors,
		enhance: projectEnhance
	} = projectSuperForm;

	// 3. Client-Side Hono RPC Test
	let rpcLoading = $state(false);
	let liveRpcStatus = $state<string | null>(null);

	async function testHonoRpc() {
		rpcLoading = true;
		try {
			const res = await api.api.projects.$get();
			if (res.ok) {
				const json = await res.json();
				liveRpcStatus = `Success: Loaded ${json.projects.length} project(s) directly from RPC`;
				toast.success(liveRpcStatus);
			} else {
				toast.error(`RPC Error (${res.status}): ${res.statusText}`);
			}
		} catch (err: unknown) {
			toast.error(`RPC Failure: ${err instanceof Error ? err.message : 'Network error'}`);
		} finally {
			rpcLoading = false;
		}
	}

	// 4. UploadThing Client Setup
	let uploadedFileUrl = $state<string | null>(null);
	let isUploading = $state(false);

	const uploader = createUploadThing('imageUploader', {
		onClientUploadComplete: (res) => {
			isUploading = false;
			if (res && res[0]) {
				uploadedFileUrl = res[0].ufsUrl || res[0].url;
				toast.success('Image uploaded successfully!');
			}
		},
		onUploadError: (err: Error) => {
			isUploading = false;
			toast.error(`Upload failed: ${err.message}`);
		}
	});

	async function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			isUploading = true;
			await uploader.startUpload([input.files[0]]);
		}
	}

	// 5. Rate Limit Test
	let rateLimitMessage = $state<string | null>(null);

	async function testRateLimit() {
		try {
			const res = await api.api['rate-limited-test'].$get();
			const json = await res.json();
			rateLimitMessage = JSON.stringify(json, null, 2);

			if (json && typeof json === 'object') {
				if (res.ok && 'message' in json && typeof json.message === 'string') {
					toast.success(json.message);
				} else if ('error' in json && typeof json.error === 'string') {
					toast.error(json.error);
				} else {
					toast.info(`Request completed with status ${res.status}`);
				}
			} else {
				toast.error(`Invalid response format (${res.status})`);
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Request failed';
			toast.error(message);
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<!-- Header with Theme Toggle -->
	<div class="flex items-center justify-between border-b border-border pb-4">
		<div class="space-y-1">
			<h1 class="text-3xl font-bold tracking-tight">Stack Diagnostics Dashboard</h1>
			<p class="text-sm text-muted-foreground">
				Live operational test suite for Svelte 5, Better Auth, Drizzle, Superforms, Hono RPC, and UI
				Delighters.
			</p>
		</div>
		<ThemeToggle />
	</div>

	<!-- 1. AUTHENTICATION & SESSION STATUS -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<div class="flex items-center justify-between">
			<h2 class="flex items-center gap-2 text-lg font-semibold">
				<span class="size-2.5 rounded-full {data.user ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
				1. Auth Session Status (Better Auth)
			</h2>
			{#if data.user}
				<form method="POST" action="?/signOut" use:enhance>
					<Button variant="outline" size="sm" type="submit">Sign Out</Button>
				</form>
			{:else}
				<a href={resolve('/login')} class="text-xs text-primary underline">Go to Login Page</a>
			{/if}
		</div>

		{#if data.user}
			<div class="space-y-1 rounded-md border border-border bg-muted p-3 font-mono text-xs">
				<p><strong class="text-foreground">Email:</strong> {data.user.email}</p>
				<p><strong class="text-foreground">Name:</strong> {data.user.name}</p>
				<p><strong class="text-foreground">User ID:</strong> {data.user.id}</p>
			</div>
		{:else}
			<p class="text-xs text-muted-foreground">
				Currently browsing as <strong class="text-foreground">Guest</strong>. Log in to attach user
				IDs to created projects.
			</p>
		{/if}

		<!-- Dev Utility: Seed Button -->
		<div
			class="flex flex-col justify-between gap-3 border-t border-border pt-2 sm:flex-row sm:items-center"
		>
			<div>
				<p class="text-xs font-medium">Dev Utility</p>
				<p class="text-xs text-muted-foreground">
					Seed test account: test@example.com / password123
				</p>
			</div>
			<form
				method="POST"
				action="?/seed"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success' && result.data) {
							const msg = (result.data as { message: string }).message;
							toast.info(msg);
						}
					};
				}}
			>
				<Button size="sm" variant="secondary" type="submit">Create Test User</Button>
			</form>
		</div>
	</section>

	<!-- 2. DATABASE, SUPERFORMS & AUTO-ANIMATE TEST -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<h2 class="text-lg font-semibold">2. Server Action, Superforms & Drizzle DB</h2>

		<form
			method="POST"
			action="?/createProject"
			use:projectEnhance
			class="grid gap-4 sm:grid-cols-2"
		>
			<div class="space-y-1">
				<label for="name" class="text-xs font-medium">Project Name</label>
				<Input
					id="name"
					name="name"
					placeholder="My SaaS Project"
					bind:value={$projectFormData.name}
				/>
				{#if $projectErrors.name}
					<p class="text-xs font-medium text-destructive">{$projectErrors.name[0]}</p>
				{/if}
			</div>

			<div class="space-y-1">
				<label for="slug" class="text-xs font-medium">Project Slug</label>
				<Input
					id="slug"
					name="slug"
					placeholder="my-saas-project"
					bind:value={$projectFormData.slug}
				/>
				{#if $projectErrors.slug}
					<p class="text-xs font-medium text-destructive">{$projectErrors.slug[0]}</p>
				{/if}
			</div>

			<div class="flex justify-end sm:col-span-2">
				<Button type="submit">Create via Superforms</Button>
			</div>
		</form>

		<!-- Table of Records with Auto-Animate -->
		<div class="space-y-2 border-t border-border pt-2">
			<h3 class="text-xs font-semibold text-muted-foreground">
				Projects in Neon Postgres ({data.existingProjects.length}):
			</h3>
			{#if data.existingProjects.length === 0}
				<p class="text-xs text-muted-foreground italic">
					No projects found. Add one above to test write capabilities.
				</p>
			{:else}
				<ul use:autoAnimate class="space-y-2">
					{#each data.existingProjects as project (project.id)}
						<li
							class="flex items-center justify-between rounded-md border border-border bg-muted p-3 text-xs"
						>
							<div>
								<p class="font-semibold">{project.name}</p>
								<p class="font-mono text-muted-foreground">slug: {project.slug}</p>
							</div>
							<form
								method="POST"
								action="?/deleteProject"
								use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'success') {
											toast.error(`Deleted project "${project.name}"`);
										}
									};
								}}
							>
								<input type="hidden" name="id" value={project.id} />
								<Button
									variant="ghost"
									size="sm"
									class="text-destructive hover:text-destructive"
									type="submit"
								>
									Delete
								</Button>
							</form>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</section>

	<!-- 3. HONO RPC CLIENT TEST -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold">3. Client-Side Hono RPC Test</h2>
				<p class="text-xs text-muted-foreground">
					Preloaded status from <code>+page.ts</code>:
					<span class="font-mono text-primary">{data.rpcDiagnostics.status}</span>
				</p>
			</div>
			<Button variant="outline" size="sm" onclick={testHonoRpc} disabled={rpcLoading}>
				{rpcLoading ? 'Testing...' : 'Ping Hono API'}
			</Button>
		</div>
		{#if liveRpcStatus}
			<p class="font-mono text-xs text-emerald-500">{liveRpcStatus}</p>
		{/if}
	</section>

	<!-- 4. REALTIME SSE STREAM (POWERED BY CLASS RUNE) -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold">4. Realtime Event Stream</h3>
			<span
				class="rounded-full px-2 py-1 font-mono text-xs
        {realtime.status === 'connected'
					? 'border border-green-500/20 bg-green-500/10 text-green-500'
					: ''}
        {realtime.status === 'connecting'
					? 'border border-amber-500/20 bg-amber-500/10 text-amber-500'
					: ''}
        {realtime.status === 'disconnected'
					? 'border border-red-500/20 bg-red-500/10 text-red-500'
					: ''}"
			>
				● {realtime.status}
				{realtime.lastHeartbeat ? `(${realtime.lastHeartbeat})` : ''}
			</span>
		</div>

		{#if realtime.events.length === 0}
			<p class="text-xs text-muted-foreground italic">
				No events received yet. Create a project or upload a file to broadcast a message...
			</p>
		{:else}
			<div class="max-h-60 space-y-2 overflow-y-auto font-mono text-xs">
				{#each realtime.events as event, i (i)}
					<div class="flex flex-col gap-1 rounded border border-border bg-muted/50 p-2.5">
						<div class="flex justify-between font-bold text-primary">
							<span>{event.type}</span>
							<span class="font-normal text-muted-foreground">{event.timestamp}</span>
						</div>
						<pre class="overflow-x-auto text-[11px] text-muted-foreground">{JSON.stringify(
								event.payload,
								null,
								2
							)}</pre>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- 5. FILE UPLOADS (UPLOADTHING) -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<h2 class="text-lg font-semibold">5. File Uploads (UploadThing)</h2>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<input
				type="file"
				accept="image/*"
				onchange={handleFileInput}
				disabled={isUploading || !data.user}
				class="text-xs text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
			/>
			{#if isUploading}
				<span class="animate-pulse font-mono text-xs text-amber-500">Uploading file...</span>
			{/if}
		</div>

		{#if !data.user}
			<p class="text-xs text-amber-500">Log in to test file uploads (authenticated endpoint).</p>
		{/if}

		{#if uploadedFileUrl}
			<div class="space-y-2 rounded-md border border-border bg-muted p-3">
				<p class="text-xs font-semibold text-emerald-500">File Uploaded!</p>
				<img
					src={uploadedFileUrl}
					alt="Uploaded preview"
					class="h-32 w-auto rounded border border-border object-cover"
				/>
				<p class="font-mono text-xs break-all text-muted-foreground">{uploadedFileUrl}</p>
			</div>
		{/if}
	</section>

	<!-- 6. RATE LIMITING & REDIS (UPSTASH) -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold">6. Rate Limiting & Redis (Upstash)</h2>
				<p class="text-xs text-muted-foreground">
					Click multiple times quickly to test sliding-window rate limiting.
				</p>
			</div>
			<Button variant="outline" size="sm" onclick={testRateLimit}>Test Rate Limit API</Button>
		</div>

		{#if rateLimitMessage}
			<pre
				class="overflow-x-auto rounded-md border border-border bg-muted p-3 font-mono text-xs text-foreground">{rateLimitMessage}</pre>
		{/if}
	</section>
</div>
