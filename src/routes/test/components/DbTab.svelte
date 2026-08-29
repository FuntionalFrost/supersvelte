<script lang="ts">
	import { client } from '$lib/api-client';
	import { Database, Plus, RefreshCw, Trash2 } from '@lucide/svelte';

	type ProjectItem = { id?: string | number; name: string; slug?: string };

	let { initialProjects = [], onSourceUpdate } = $props<{
		initialProjects?: ProjectItem[];
		onSourceUpdate?: (source: string | null) => void;
	}>();

	let dbLoading = $state(false);
	let dbLatency = $state<number | null>(null);
	// Initialize with empty array literal to avoid capturing prop references locally
	let projectsList = $state<ProjectItem[]>([]);
	let cacheSource = $state<string | null>(null);
	let newProjectName = $state('');
	let isSubmitting = $state(false);
	let deletingId = $state<string | number | null>(null);

	// Synchronize when server loader props resolve
	$effect(() => {
		if (initialProjects && initialProjects.length > 0) {
			projectsList = initialProjects;
		}
	});

	export async function fetchProjects() {
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
				onSourceUpdate?.(cacheSource);
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
			const res = await client.api.projects.$post({ json: { name: newProjectName } });
			if (res.ok) {
				newProjectName = '';
				await fetchProjects();
			}
		} finally {
			isSubmitting = false;
		}
	}

	async function deleteProject(id: string | number) {
		deletingId = id;
		try {
			const res = await client.api.projects[':id'].$delete({ param: { id: String(id) } });
			if (res.ok) await fetchProjects();
		} finally {
			deletingId = null;
		}
	}
</script>

<div class="grid gap-6 md:grid-cols-3">
	<div class="space-y-4 rounded-xl border border-border bg-card p-6">
		<div class="flex items-center gap-2 text-sm font-bold">
			<Database class="size-4 text-emerald-400" />
			<span>Neon Postgres + Drizzle</span>
		</div>
		<p class="text-xs leading-relaxed text-muted-foreground">
			Queries Neon Serverless DB and caches result in Upstash Redis. Mutations auto-invalidate
			cache.
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

	<div class="rounded-xl border border-border bg-card p-6 md:col-span-2">
		<div class="flex items-center justify-between border-b border-border pb-3">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold">Live DB Records ({projectsList.length})</span>
				{#if cacheSource === 'redis'}
					<span
						class="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400"
						>⚡ Redis Cache Hit</span
					>
				{:else if cacheSource === 'db'}
					<span
						class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
						>🐘 Neon DB Query Hit</span
					>
				{/if}
			</div>
			<span class="font-mono text-xs text-muted-foreground"
				>{dbLatency !== null ? `${dbLatency}ms` : ''}</span
			>
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
							<div class="font-mono text-[10px] text-muted-foreground">{p.slug || 'no-slug'}</div>
						</div>
						<div class="flex items-center gap-2">
							<span
								class="rounded-md border border-border bg-card px-2 py-1 font-mono text-[10px] text-muted-foreground"
								>ID: {String(p.id).slice(0, 8)}...</span
							>
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
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
