// src/lib/docs/index.ts

export interface DocSection {
	heading: string;
	id: string;
	body: string;
	code?: {
		lang: string;
		code: string;
		filename?: string;
	};
}

export interface DocItem {
	slug: string;
	title: string;
	description: string;
	category: string;
	badge?: string;
	sections: DocSection[];
}

export const docsRegistry: DocItem[] = [
	{
		slug: 'getting-started/introduction',
		title: 'Introduction to SuperSvelte',
		description:
			'The production-grade full-stack boilerplate built for Svelte 5, Hono RPC, and Neon Postgres.',
		category: 'Getting Started',
		badge: 'Overview',
		sections: [
			{
				heading: 'Why SuperSvelte?',
				id: 'why-supersvelte',
				body: 'SuperSvelte is designed to solve the fatigue of assembling 15 different npm packages just to build a SaaS. It ships with battle-tested authentication, multi-tenant teams, payments, background queues, and type-safe RPC pre-wired and running with sub-10ms edge cold starts.'
			},
			{
				heading: 'Core Technology Stack',
				id: 'core-stack',
				body: 'Every library was chosen for strict type-safety, minimal bundle footprint, and maximum developer velocity.',
				code: {
					lang: 'typescript',
					filename: 'tech-stack.ts',
					code: `export const stack = {
  frontend: 'Svelte 5 (Runes) + Tailwind CSS v4 + yaxa-svelte',
  api: 'Hono Zod OpenAPI 3.1 (Zero-Codegen RPC)',
  auth: 'Better-Auth (Credentials + GitHub OAuth + Orgs)',
  database: 'Neon Serverless Postgres + Drizzle ORM',
  payments: 'Polar.sh (Merchant of Record & License Keys)',
  cache: 'Upstash Redis & Sliding Window Rate Limiting',
  queue: 'Upstash QStash (HMAC-Verified Background Workers)',
  storage: 'UploadThing (Direct-to-S3 Cloud Storage)',
  email: 'Resend Transactional Email Delivery'
};`
				}
			},
			{
				heading: 'Edge-First Architecture',
				id: 'edge-first',
				body: 'By using the Neon serverless HTTP driver, Upstash REST endpoints, and Hono, the entire application can run on serverless platforms (Netlify, Vercel, Cloudflare) without running into database connection pool limits or slow cold-starts.'
			}
		]
	},
	{
		slug: 'getting-started/quickstart',
		title: 'Quickstart & Installation',
		description:
			'Take your project from a fresh clone to a running local instance in under 3 minutes.',
		category: 'Getting Started',
		badge: 'Setup',
		sections: [
			{
				heading: '1. Clone & Install Dependencies',
				id: 'clone-install',
				body: 'Clone the repository and install dependencies using pnpm (recommended):',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `git clone https://github.com/FunctionalFrost/supersvelte.git
cd supersvelte
pnpm install`
				}
			},
			{
				heading: '2. Environment Variables',
				id: 'env-setup',
				body: 'Copy the sample environment file and configure your database and authentication secrets:',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `cp .env.example .env

# Generate your Better Auth encryption secret:
openssl rand -hex 32`
				}
			},
			{
				heading: '3. Database Setup & Seeding',
				id: 'db-setup',
				body: 'Push the Drizzle schema to your Neon Postgres database and run the initial test seed:',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `pnpm db:push
pnpm db:seed`
				}
			},
			{
				heading: '4. Start the Dev Server',
				id: 'start-dev',
				body: 'Start the Vite development server with Svelte 5 Runes support:',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `pnpm dev
# Open http://localhost:5173 in your browser`
				}
			}
		]
	},
	{
		slug: 'architecture/authentication',
		title: 'Authentication & Teams',
		description:
			'Complete guide to session management, Better-Auth configuration, and multi-tenant teams.',
		category: 'Architecture',
		badge: 'Security',
		sections: [
			{
				heading: 'Better-Auth Configuration',
				id: 'better-auth-config',
				body: 'Authentication is powered by Better-Auth with the Drizzle adapter, supporting email/password authentication, GitHub OAuth, and role-based permissions (admin vs user).',
				code: {
					lang: 'typescript',
					filename: 'src/lib/server/auth/index.ts',
					code: `export const auth = betterAuth({
  baseURL: dev ? 'http://localhost:5173' : env.ORIGIN,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  plugins: [
    admin({ defaultRole: 'user', adminRole: 'admin' }),
    organization({ allowUserToCreateOrganization: true }),
    sveltekitCookies(getRequestEvent)
  ]
});`
				}
			},
			{
				heading: 'Multi-Tenant Organizations',
				id: 'multi-tenant-orgs',
				body: 'Users can create workspaces, invite team members with specific roles (owner, admin, member), and switch active organizations seamlessly with instant session state synchronization.'
			}
		]
	},
	{
		slug: 'architecture/database',
		title: 'Database & Drizzle ORM',
		description:
			'Working with Neon Serverless Postgres, relational schemas, migrations, and Drizzle queries.',
		category: 'Architecture',
		badge: 'Data Layer',
		sections: [
			{
				heading: 'Schema Definition',
				id: 'schema-definition',
				body: 'Schemas are defined using Drizzle ORM with full relational exports, indexes, and automatic timestamp updates:',
				code: {
					lang: 'typescript',
					filename: 'src/lib/server/db/schema.ts',
					code: `export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  transactionId: text('transaction_id').notNull().unique(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  licenseKey: text('license_key').notNull().unique(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});`
				}
			},
			{
				heading: 'Database CLI Commands',
				id: 'db-cli-commands',
				body: 'Manage migrations, push schema changes, or launch Drizzle Studio with pre-configured scripts:',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `pnpm db:push     # Synchronize schema directly with Neon Postgres
pnpm db:studio   # Launch local visual database GUI
pnpm db:generate # Generate migration SQL files
pnpm db:migrate  # Run migration bundle in production`
				}
			}
		]
	},
	{
		slug: 'architecture/billing',
		title: 'Billing & License Fulfillment',
		description:
			'Polar.sh Merchant of Record integration, checkout sessions, and webhook automation.',
		category: 'Architecture',
		badge: 'Monetization',
		sections: [
			{
				heading: 'Polar Checkout Flow',
				id: 'polar-checkout',
				body: 'Checkouts are handled by Polar.sh, acting as the Merchant of Record for EU VAT calculation, invoicing, and global compliance.',
				code: {
					lang: 'typescript',
					filename: 'src/routes/api/checkout/+server.ts',
					code: `const checkout = await polar.checkouts.create({
  products: [productId],
  success_url: \`\${origin}/welcome?checkout_id={CHECKOUT_ID}\`,
  customer_email: locals.user?.email,
  metadata: { userId: locals.user?.id }
});`
				}
			},
			{
				heading: 'Cryptographic Webhook Fulfillment',
				id: 'webhook-fulfillment',
				body: 'The webhook handler verifies incoming Polar signatures via HMAC, upserts the customer and purchase records, generates a unique license key, and triggers transactional fulfillment emails.'
			}
		]
	},
	{
		slug: 'architecture/hono-rpc',
		title: 'Type-Safe Hono RPC',
		description:
			'End-to-end type safety between client and server without code generation using Hono & Zod.',
		category: 'Architecture',
		badge: 'API',
		sections: [
			{
				heading: '0-Codegen Type Safety',
				id: 'zero-codegen',
				body: 'The Hono RPC router exports its TypeScript app type directly. Frontend components import `apiClient` and enjoy full autocompletion for routes, query parameters, request bodies, and responses.',
				code: {
					lang: 'typescript',
					filename: 'src/routes/dashboard/+page.svelte',
					code: `import { client } from '#lib/api-client.js';

// Fully typed call with autocompletion and compile-time error checking:
const res = await client.api.projects.$get();
const data = await res.json();`
				}
			}
		]
	},
	{
		slug: 'features/admin-crud',
		title: 'Auto-Introspecting Admin CRUD',
		description:
			'Instant relational database CRUD dashboard with search, sorting, pagination, and record inspector.',
		category: 'Features',
		badge: 'Admin Panel',
		sections: [
			{
				heading: 'Instant Drizzle Model Management',
				id: 'admin-overview',
				body: 'The /admin console auto-introspects your Drizzle tables (users, organizations, purchases, projects, files), generating searchable data tables and inline record editing modals.'
			},
			{
				heading: 'Scaffolding New Resources',
				id: 'scaffold-resources',
				body: 'Generate full CRUD slices (Drizzle schema + Hono RPC API routes) with a single command:',
				code: {
					lang: 'bash',
					filename: 'terminal',
					code: `pnpm make:resource invoice`
				}
			}
		]
	},
	{
		slug: 'features/storage-and-email',
		title: 'Dual Storage & Dev Email',
		description:
			'Cloudflare R2 / S3 Presigned Uploads, UploadThing, and Zero-Config Dev Email Dispatcher.',
		category: 'Features',
		badge: 'Cloud & DX',
		sections: [
			{
				heading: 'Zero-Egress S3 & Cloudflare R2',
				id: 's3-storage',
				body: 'Direct browser-to-bucket presigned PUT uploads using `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` with real-time percentage progress tracking.'
			},
			{
				heading: 'Zero-Config Local Email Fallback',
				id: 'dev-email',
				body: 'If no RESEND_API_KEY is provided on localhost, emails are automatically logged to the terminal as formatted ASCII boxes and rendered live in the /test?tab=email sandbox.'
			}
		]
	}
];

export function getDocBySlug(slug: string): DocItem | undefined {
	return docsRegistry.find((d) => d.slug === slug);
}

export function getAllCategories(): Record<string, DocItem[]> {
	const categories: Record<string, DocItem[]> = {};
	for (const doc of docsRegistry) {
		if (!categories[doc.category]) {
			categories[doc.category] = [];
		}
		categories[doc.category].push(doc);
	}
	return categories;
}
