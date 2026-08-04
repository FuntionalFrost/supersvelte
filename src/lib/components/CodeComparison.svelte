<!-- src/lib/components/CodeComparison.svelte -->
<script lang="ts">
	import { Check, CodeXml, Copy, FileCode, Layers, ShieldCheck, Zap } from '@lucide/svelte';

	type Competitor = 'nextjs' | 'nestjs';

	let activeCompetitor = $state<Competitor>('nextjs');
	let copiedSnippet = $state<string | null>(null);

	const codeExamples = {
		superSvelte: {
			title: '⚡ Super Svelte (@hono/zod-openapi)',
			subtitle: 'Single source of truth. 0-codegen RPC + auto-generated OpenAPI 3.1 & Swagger UI.',
			server: `// src/lib/server/api/index.ts
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

export const app = new OpenAPIHono()
  .basePath('/api')
  .openapi(
    createRoute({
      method: 'post',
      path: '/projects',
      summary: 'Create Project',
      request: {
        body: { content: { 'application/json': { schema: z.object({ name: z.string().min(1) }) } } }
      },
      responses: {
        200: { content: { 'application/json': { schema: ProjectSchema } }, description: 'Project Created' }
      }
    }),
    async (c) => {
      const { name } = c.req.valid('json');
      const [project] = await db.insert(projects).values({ name }).returning();
      return c.json({ success: true, project }, 200);
    }
  );`,
			client: `<!-- src/routes/app/+page.svelte -->
<script lang="ts">
  import { client } from '$lib/api-client';

  async function create() {
    // 🎯 100% Type-Safe RPC Call + Auto OpenAPI 3.1 Spec + Swagger UI!
    // ZERO CLI codegen, ZERO generated schema files.
    const res = await client.api.projects.$post({ json: { name: 'Acme' } });
    const { project } = await res.json();
  }
<\\/script>`
		},
		nextjs: {
			title: '⚠️ Next.js 15 (Server Actions + Manual Schemas)',
			subtitle: 'Requires useActionState hooks, manual error mapping & Zod duplication.',
			server: `// app/actions/projects.ts
'use server';
import { z } from 'zod';

const CreateProjectSchema = z.object({ name: z.string().min(1) });

export async function createProject(prevState: unknown, formData: FormData) {
  const validated = CreateProjectSchema.safeParse({ name: formData.get('name') });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }
  const project = await db.insert(projects).values(validated.data);
  return { success: true, project };
}`,
			client: `// app/projects/page.tsx
'use client';
import { useActionState } from 'react';
import { createProject } from '@/app/actions/projects';

export default function Page() {
  // Requires form state wiring, manual result type assertions,
  // and full React Client Component bundle overhead.
  const [state, formAction, isPending] = useActionState(createProject, null);
}`
		},
		nestjs: {
			title: '🏛️ NestJS (Controller + DTO + Service + Module)',
			subtitle: 'Requires class decorators, duplicated DTO classes & OpenAPI codegen tools.',
			server: `// create-project.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateProjectDto {
  @IsString() @IsNotEmpty() name: string;
}

// projects.controller.ts
@Controller('projects')
export class ProjectsController {
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }
}`,
			client: `// frontend/src/api.ts
// Manual type duplication OR required OpenAPI/Swagger codegen CLI step!
interface CreateProjectInput { name: string; }
interface CreateProjectResult { id: string; name: string; }

async function createProject(data: CreateProjectInput): Promise<CreateProjectResult> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}`
		}
	};

	let currentCompetitorCode = $derived(codeExamples[activeCompetitor]);

	function copyCode(key: string, text: string) {
		navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => (copiedSnippet = null), 2000);
	}
</script>

<section class="border-y border-border/50 bg-background py-20 text-foreground">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Section Header -->
		<div class="mb-12 space-y-4 text-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
			>
				<CodeXml class="size-3.5" />
				<span>Zero-Codegen Developer Experience</span>
			</div>
			<h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">See the DX Difference</h2>
			<p class="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
				Compare Super Svelte’s OpenAPI 3.1 & Hono RPC engine against traditional TypeScript backend
				patterns.
			</p>
		</div>

		<!-- Competitor Switcher Tabs -->
		<div class="mb-8 flex justify-center">
			<div class="inline-flex rounded-xl border border-border bg-card p-1.5 shadow-xs">
				<button
					onclick={() => (activeCompetitor = 'nextjs')}
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all {activeCompetitor ===
					'nextjs'
						? 'bg-primary text-primary-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					<Layers class="size-3.5" />
					<span>vs Next.js Server Actions</span>
				</button>
				<button
					onclick={() => (activeCompetitor = 'nestjs')}
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all {activeCompetitor ===
					'nestjs'
						? 'bg-primary text-primary-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					<FileCode class="size-3.5" />
					<span>vs NestJS Controllers & DTOs</span>
				</button>
			</div>
		</div>

		<!-- Side-by-Side Code Grid -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- LEFT COLUMN: SUPER SVELTE -->
			<div
				class="flex flex-col overflow-hidden rounded-2xl border border-emerald-500/30 bg-card shadow-xs"
			>
				<!-- Header -->
				<div
					class="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-5 py-4"
				>
					<div>
						<h3 class="flex items-center gap-2 text-sm font-bold text-emerald-400">
							<Zap class="size-4" />
							{codeExamples.superSvelte.title}
						</h3>
						<p class="mt-0.5 text-[11px] text-muted-foreground">
							{codeExamples.superSvelte.subtitle}
						</p>
					</div>
					<button
						onclick={() =>
							copyCode(
								'superSvelte',
								codeExamples.superSvelte.server + '\n\n' + codeExamples.superSvelte.client
							)}
						class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400 transition hover:bg-emerald-500/20"
						title="Copy Super Svelte Snippet"
					>
						{#if copiedSnippet === 'superSvelte'}
							<Check class="size-3.5 text-emerald-400" />
						{:else}
							<Copy class="size-3.5" />
						{/if}
					</button>
				</div>

				<!-- Code Blocks -->
				<div class="flex flex-1 flex-col justify-between space-y-4 bg-muted/30 p-5">
					<div class="space-y-2">
						<div
							class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400/90"
						>
							<span class="size-1.5 rounded-full bg-emerald-400"></span>
							1. OpenAPI Route Definition
						</div>
						<pre
							class="overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-4 font-mono text-xs leading-relaxed text-foreground"><code
								>{codeExamples.superSvelte.server}</code
							></pre>
					</div>

					<div class="space-y-2">
						<div
							class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400/90"
						>
							<span class="size-1.5 rounded-full bg-emerald-400"></span>
							2. Client RPC Call
						</div>
						<pre
							class="overflow-x-auto rounded-xl border border-border/80 bg-background/90 p-4 font-mono text-xs leading-relaxed text-foreground"><code
								>{codeExamples.superSvelte.client}</code
							></pre>
					</div>
				</div>

				<!-- Feature Badges -->
				<div class="flex flex-wrap gap-2 border-t border-border bg-card px-5 py-3 text-[11px]">
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> 0 Build Steps
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> Auto OpenAPI 3.1
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> Interactive Swagger UI
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-emerald-400">
						<Check class="size-3" /> Web Standard Fetch
					</span>
				</div>
			</div>

			<!-- RIGHT COLUMN: COMPETITOR -->
			<div class="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-border bg-muted/60 px-5 py-4">
					<div>
						<h3 class="flex items-center gap-2 text-sm font-bold text-foreground">
							<FileCode class="size-4 text-muted-foreground" />
							{currentCompetitorCode.title}
						</h3>
						<p class="mt-0.5 text-[11px] text-muted-foreground">
							{currentCompetitorCode.subtitle}
						</p>
					</div>
					<button
						onclick={() =>
							copyCode(
								activeCompetitor,
								currentCompetitorCode.server + '\n\n' + currentCompetitorCode.client
							)}
						class="rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
						title="Copy Competitor Snippet"
					>
						{#if copiedSnippet === activeCompetitor}
							<Check class="size-3.5 text-emerald-400" />
						{:else}
							<Copy class="size-3.5" />
						{/if}
					</button>
				</div>

				<!-- Code Blocks -->
				<div class="flex flex-1 flex-col justify-between space-y-4 bg-muted/20 p-5">
					<div class="space-y-2">
						<div
							class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-muted-foreground"
						>
							<span class="size-1.5 rounded-full bg-muted-foreground"></span>
							Server Implementation
						</div>
						<pre
							class="overflow-x-auto rounded-xl border border-border/60 bg-background/80 p-4 font-mono text-xs leading-relaxed text-muted-foreground"><code
								>{currentCompetitorCode.server}</code
							></pre>
					</div>

					<div class="space-y-2">
						<div
							class="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-muted-foreground"
						>
							<span class="size-1.5 rounded-full bg-muted-foreground"></span>
							Client Consumption
						</div>
						<pre
							class="overflow-x-auto rounded-xl border border-border/60 bg-background/80 p-4 font-mono text-xs leading-relaxed text-muted-foreground"><code
								>{currentCompetitorCode.client}</code
							></pre>
					</div>
				</div>

				<!-- Drawback Badges -->
				<div
					class="flex flex-wrap gap-2 border-t border-border bg-card px-5 py-3 text-[11px] text-muted-foreground"
				>
					<span class="inline-flex items-center gap-1 font-medium text-amber-500">
						⚠️ Manual Type Mapping
					</span>
					<span class="inline-flex items-center gap-1 font-medium text-amber-500">
						⚠️ Extra Boilerplate Files
					</span>
				</div>
			</div>
		</div>

		<!-- Summary Callout Banner -->
		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row"
		>
			<div class="flex items-center gap-3">
				<ShieldCheck class="size-8 shrink-0 text-primary" />
				<div class="space-y-0.5">
					<h4 class="text-sm font-bold">Why OpenAPI Hono RPC Beats Codegen Toolchains</h4>
					<p class="text-xs text-muted-foreground">
						TypeScript infers backend route contracts at edit time, while generating standard
						OpenAPI 3.1 JSON schemas & Swagger UI docs at <code>/api/docs</code>. Zero build steps,
						zero codegen binaries.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
