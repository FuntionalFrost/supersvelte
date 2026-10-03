// src/lib/config/code-comparisons.ts

export interface CodeSnippet {
	title: string;
	subtitle: string;
	server: string;
	client: string;
}

export type CompetitorKey = 'nextjs' | 'nestjs';

export interface CompetitorSnippet extends CodeSnippet {
	label: string;
}

export const superSvelteExample: CodeSnippet = {
	title: '⚡ Super Svelte (@hono/zod-openapi)',
	subtitle: '0-codegen RPC + auto-generated OpenAPI 3.1 & Swagger UI.',
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
  import { client } from '#lib/api-client.js';

  async function create() {
    // 🎯 100% Type-Safe RPC Call + Auto OpenAPI 3.1 Spec + Swagger UI!
    const res = await client.api.projects.$post({ json: { name: 'Acme' } });
    const { project } = await res.json();
  }
</script>`
};

export const competitorExamples: Record<CompetitorKey, CompetitorSnippet> = {
	nextjs: {
		label: 'vs Next.js Server Actions',
		title: '⚠️ Next.js 15 (Server Actions)',
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
  const [state, formAction, isPending] = useActionState(createProject, null);
}`
	},
	nestjs: {
		label: 'vs NestJS Controllers & DTOs',
		title: '🏛️ NestJS (Controller + DTO)',
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
