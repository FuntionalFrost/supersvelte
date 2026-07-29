// src/lib/config/comparison.ts

export type Mode = 'ts-batteries' | 'monoliths';

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
	// PRIMARY CATEGORY: Batteries-Included TypeScript Frameworks & Starters
	'ts-batteries': {
		columns: [
			{ key: 'feature', label: 'Architectural Dimension' },
			{ key: 'superSvelte', label: '🚀 Super Svelte', isPrimary: true, minWidth: 'min-w-[210px]' },
			{ key: 'adonis', label: 'AdonisJS', minWidth: 'min-w-[150px]' },
			{ key: 'redwood', label: 'RedwoodJS', minWidth: 'min-w-[150px]' },
			{ key: 'wasp', label: 'Wasp', minWidth: 'min-w-[150px]' },
			{ key: 'epicstack', label: 'Epic Stack (Remix)', minWidth: 'min-w-[160px]' }
		],
		rows: [
			{
				feature: 'Reactivity & UI Layer',
				superSvelte: 'Native Svelte 5 Runes ($state, 0 VDOM)',
				adonis: 'Inertia.js Glue or Decoupled SPA',
				redwood: 'React 18/19 Virtual DOM',
				wasp: 'React Virtual DOM',
				epicstack: 'React 19 Virtual DOM'
			},
			{
				feature: 'Boilerplate & Codegen',
				superSvelte: '0 Codegen (Pure TypeScript & Hono RPC)',
				adonis: 'Heavy CLI scaffolding & Controllers',
				redwood: 'GraphQL Codegen & CLI Wrappers',
				wasp: 'Requires custom .wasp DSL compiler',
				epicstack: 'Massive starter template boilerplate'
			},
			{
				feature: 'Edge & Cold Start Latency',
				superSvelte: '<10ms Edge Cold Start (Vercel/Cloudflare)',
				adonis: 'Slow (Requires Node.js VPS / Docker)',
				redwood: 'Moderate (AWS Lambda / Node)',
				wasp: 'Slow (Requires Docker / VPS container)',
				epicstack: 'Requires Fly.io VPS container deployment'
			},
			{
				feature: 'Database & ORM Paradigm',
				superSvelte: 'Drizzle ORM + Serverless Neon Postgres',
				adonis: 'Lucid ORM (ActiveRecord pattern)',
				redwood: 'Prisma ORM',
				wasp: 'Prisma ORM (DSL Generated)',
				epicstack: 'Prisma ORM + SQLite / Postgres'
			},
			{
				feature: 'Auth & Session Lifecycle',
				superSvelte: 'Better Auth (Session + Social + DB Hooks)',
				adonis: 'Adonis Auth (@adonisjs/auth)',
				redwood: 'Redwood Auth Engine',
				wasp: 'Built-in Wasp Auth',
				epicstack: 'Custom cookie auth implementation'
			},
			{
				feature: 'Background Queues & Realtime',
				superSvelte: 'Upstash SSE Event Queue + QStash',
				adonis: 'Adonis Queue (BullMQ / Redis)',
				redwood: 'Third-party integration required',
				wasp: 'PgBoss / Postgres Workers',
				epicstack: 'Third-party / Custom worker'
			}
		]
	},

	// SECONDARY CATEGORY: Classic Full-Stack Monoliths
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
