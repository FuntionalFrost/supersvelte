// src/lib/config/comparison.ts

export type Mode = 'saas-starters' | 'ts-frameworks' | 'monoliths';

export type ColumnSpec = {
	key: string;
	label: string;
	isPrimary?: boolean;
	minWidth?: string;
};

export type MatrixRow = {
	feature: string;
	[key: string]: string;
};

export type MatrixConfig = {
	columns: ColumnSpec[];
	rows: MatrixRow[];
};

export const matrices: Record<Mode, MatrixConfig> = {
	// CATEGORY 1: Commercial & Open-Source SaaS Boilerplates
	'saas-starters': {
		columns: [
			{ key: 'feature', label: 'Architectural Dimension' },
			{ key: 'superSvelte', label: '🚀 Super Svelte', isPrimary: true, minWidth: 'min-w-[210px]' },
			{ key: 'supastarter', label: 'Supastarter', minWidth: 'min-w-[150px]' },
			{ key: 'makerkit', label: 'Makerkit', minWidth: 'min-w-[150px]' },
			{ key: 'epicstack', label: 'Epic Stack (Remix)', minWidth: 'min-w-[160px]' }
		],
		rows: [
			{
				feature: 'License & Pricing Model',
				superSvelte: '$99 - $199 One-Time (Lifetime)',
				supastarter: '$199 - $299 Single/Multi License',
				makerkit: '$299 - $799 Enterprise License',
				epicstack: '100% Free & Open-Source'
			},
			{
				feature: 'Reactivity & UI Engine',
				superSvelte: 'Native Svelte 5 Runes ($state, 0 VDOM)',
				supastarter: 'SvelteKit / Next.js (React/Svelte)',
				makerkit: 'Next.js / Remix (React 19 VDOM)',
				epicstack: 'Remix (React 19 Virtual DOM)'
			},
			{
				feature: 'API Layer & OpenAPI Docs',
				superSvelte: '0-Codegen Hono Zod RPC + Swagger UI',
				supastarter: 'Standard SvelteKit / Next API Routes',
				makerkit: 'Next.js Server Actions / Supabase SDK',
				epicstack: 'Remix Loaders & Form Actions'
			},
			{
				feature: 'Auth & Multi-Tenancy',
				superSvelte: 'Better Auth (Native Org/Teams & Admin)',
				supastarter: 'Supabase Auth / Lucia Auth',
				makerkit: 'Supabase / Firebase Auth (Tightly coupled)',
				epicstack: 'Custom cookie & session implementation'
			},
			{
				feature: 'Database & ORM Paradigm',
				superSvelte: 'Drizzle ORM + Serverless Neon Postgres',
				supastarter: 'Prisma ORM + Supabase Postgres',
				makerkit: 'Supabase Client / Postgres (RLS)',
				epicstack: 'Prisma ORM + SQLite / Postgres'
			},
			{
				feature: 'Infrastructure & Lock-in',
				superSvelte: 'Zero Lock-in (Vercel, Cloudflare, VPS)',
				supastarter: 'Moderate (Supabase / Provider dependent)',
				makerkit: 'High Vendor Lock-in (Supabase/Firebase)',
				epicstack: 'Fly.io Docker container deployment'
			}
		]
	},

	// CATEGORY 2: TypeScript Full-Stack Frameworks & Toolkits
	'ts-frameworks': {
		columns: [
			{ key: 'feature', label: 'Architectural Dimension' },
			{ key: 'superSvelte', label: '🚀 Super Svelte', isPrimary: true, minWidth: 'min-w-[210px]' },
			{ key: 'adonis', label: 'AdonisJS', minWidth: 'min-w-[150px]' },
			{ key: 'redwood', label: 'RedwoodJS', minWidth: 'min-w-[150px]' },
			{ key: 'wasp', label: 'Wasp', minWidth: 'min-w-[150px]' }
		],
		rows: [
			{
				feature: 'Reactivity & UI Layer',
				superSvelte: 'Native Svelte 5 Runes ($state, 0 VDOM)',
				adonis: 'Inertia.js Glue or Decoupled SPA',
				redwood: 'React 18/19 Virtual DOM',
				wasp: 'React Virtual DOM'
			},
			{
				feature: 'Type Safety & API Protocol',
				superSvelte: '0-Codegen Hono RPC + Auto OpenAPI 3.1',
				adonis: 'Controller REST Endpoints',
				redwood: 'GraphQL Schema & CLI Codegen',
				wasp: 'DSL Generated Actions & Queries'
			},
			{
				feature: 'Deployment Target & Latency',
				superSvelte: '<10ms Edge Cold Start (Vercel/Cloudflare)',
				adonis: 'Slow (Requires Node.js VPS / Docker)',
				redwood: 'Moderate (AWS Lambda / Node Server)',
				wasp: 'Slow (Requires Docker / VPS container)'
			},
			{
				feature: 'Database & ORM Paradigm',
				superSvelte: 'Drizzle ORM + Serverless Neon Postgres',
				adonis: 'Lucid ORM (ActiveRecord pattern)',
				redwood: 'Prisma ORM',
				wasp: 'Prisma ORM (DSL Generated)'
			},
			{
				feature: 'Auth & Session Lifecycle',
				superSvelte: 'Better Auth (Session + Social + DB Hooks)',
				adonis: 'Adonis Auth (@adonisjs/auth)',
				redwood: 'Redwood Auth Engine',
				wasp: 'Built-in Wasp Auth'
			},
			{
				feature: 'Background Queues & Realtime',
				superSvelte: 'Upstash SSE Event Queue + QStash',
				adonis: 'Adonis Queue (BullMQ / Redis)',
				redwood: 'Third-party integration required',
				wasp: 'PgBoss / Postgres Workers'
			}
		]
	},

	// CATEGORY 3: Classic Full-Stack Backend Monoliths
	monoliths: {
		columns: [
			{ key: 'feature', label: 'Architectural Dimension' },
			{ key: 'superSvelte', label: '🚀 Super Svelte', isPrimary: true, minWidth: 'min-w-[210px]' },
			{ key: 'laravel', label: 'Laravel (PHP)', minWidth: 'min-w-[140px]' },
			{ key: 'rails', label: 'Ruby on Rails', minWidth: 'min-w-[140px]' },
			{ key: 'django', label: 'Django (Python)', minWidth: 'min-w-[140px]' },
			{ key: 'dotnet', label: 'ASP.NET Core (C#)', minWidth: 'min-w-[140px]' }
		],
		rows: [
			{
				feature: 'Language & Type System',
				superSvelte: '100% Unified End-to-End TypeScript',
				laravel: 'PHP 8.x',
				rails: 'Ruby',
				django: 'Python',
				dotnet: 'C#'
			},
			{
				feature: 'Frontend Interactivity',
				superSvelte: 'Native Svelte 5 (Zero Virtual DOM overhead)',
				laravel: 'Blade / Inertia.js + Vue',
				rails: 'Hotwire / Turbo Streams',
				django: 'Django Templates / HTMX',
				dotnet: 'Razor Pages / Blazor'
			},
			{
				feature: 'API Protocol',
				superSvelte: 'Hono RPC (Auto-typed client API)',
				laravel: 'Laravel API Routes / Orion',
				rails: 'Rails REST Controllers',
				django: 'Django REST Framework / Ninja',
				dotnet: 'ASP.NET Core Web API'
			},
			{
				feature: 'Deployment Target',
				superSvelte: 'Native Edge Serverless (Vercel/Cloudflare)',
				laravel: 'Requires VPS or Laravel Vapor (AWS)',
				rails: 'Requires VPS (Kamal / Fly.io)',
				django: 'Requires VPS / Docker container',
				dotnet: 'Requires Docker / Azure App Service'
			},
			{
				feature: 'Realtime Architecture',
				superSvelte: 'Zero-config Upstash SSE Queue',
				laravel: 'Laravel Reverb / WebSockets',
				rails: 'ActionCable + Redis',
				django: 'Django Channels + Redis ASGI',
				dotnet: 'SignalR Hubs'
			}
		]
	}
};
