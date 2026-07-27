<!-- src/routes/test/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { api } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	// 👈 1. Import superForm

	let { data } = $props();

	// 👈 2. Initialize superForm for the project form
	// svelte-ignore state_referenced_locally
	const projectSuperForm = superForm(data.form);
	const {
		form: projectFormData,
		errors: projectErrors,
		enhance: projectEnhance
	} = projectSuperForm;

	// Reactive state using Svelte 5 Runes
	let seedStatus = $state<string | null>(null);
	let rpcStatus = $state<string | null>(null);
	let rpcLoading = $state(false);

	// Client-side Hono RPC Test Call
	async function testHonoRpc() {
		rpcLoading = true;
		rpcStatus = null;
		try {
			const res = await api.api.projects.$get();
			if (res.ok) {
				const json = await res.json();
				rpcStatus = `RPC Success (200 OK): Loaded ${json.projects.length} project(s) directly from Hono endpoint.`;
			} else {
				rpcStatus = `RPC Error (${res.status}): ${res.statusText}`;
			}
		} catch (err: unknown) {
			rpcStatus = `RPC Failure: ${err instanceof Error ? err.message : 'Network error'}`;
		} finally {
			rpcLoading = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<!-- Header -->
	<div class="space-y-1">
		<h1 class="text-3xl font-bold tracking-tight">Stack Diagnostics Dashboard</h1>
		<p class="text-sm text-muted-foreground">
			Live operational test suite for Svelte 5, Better Auth, Drizzle + Neon, Superforms, and Hono
			RPC.
		</p>
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
							seedStatus = (result.data as { message: string }).message;
						}
					};
				}}
			>
				<Button size="sm" variant="secondary" type="submit">Create Test User</Button>
			</form>
		</div>

		{#if seedStatus}
			<p class="font-mono text-xs text-emerald-500">{seedStatus}</p>
		{/if}
	</section>

	<!-- 2. DATABASE & SUPERFORMS TEST -->
	<section class="space-y-4 rounded-xl border border-border bg-card p-5">
		<h2 class="text-lg font-semibold">2. Server Action, Superforms & Drizzle DB</h2>

		<!-- Form: Uses projectEnhance and binds to projectFormData -->
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
				<!-- 👈 Render Name Error -->
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
				<!-- 👈 Render Slug Error -->
				{#if $projectErrors.slug}
					<p class="text-xs font-medium text-destructive">{$projectErrors.slug[0]}</p>
				{/if}
			</div>

			<div class="flex justify-end sm:col-span-2">
				<Button type="submit">Create via Superforms</Button>
			</div>
		</form>

		<!-- Table of Records in Neon Postgres -->
		<div class="space-y-2 border-t border-border pt-2">
			<h3 class="text-xs font-semibold text-muted-foreground">
				Projects in Neon Postgres ({data.existingProjects.length}):
			</h3>
			{#if data.existingProjects.length === 0}
				<p class="text-xs text-muted-foreground italic">
					No projects found. Add one above to test write capabilities.
				</p>
			{:else}
				<ul class="space-y-2">
					{#each data.existingProjects as project (project.id)}
						<li
							class="flex items-center justify-between rounded-md border border-border bg-muted p-3 text-xs"
						>
							<div>
								<p class="font-semibold">{project.name}</p>
								<p class="font-mono text-muted-foreground">slug: {project.slug}</p>
							</div>
							<form method="POST" action="?/deleteProject" use:enhance>
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
					Tests end-to-end client fetch via <code>hc&lt;AppType&gt;()</code>
				</p>
			</div>
			<Button variant="outline" size="sm" onclick={testHonoRpc} disabled={rpcLoading}>
				{rpcLoading ? 'Testing...' : 'Ping Hono API'}
			</Button>
		</div>

		{#if rpcStatus}
			<p class="rounded-md border border-border bg-muted p-3 font-mono text-xs text-emerald-500">
				{rpcStatus}
			</p>
		{/if}
	</section>
</div>
