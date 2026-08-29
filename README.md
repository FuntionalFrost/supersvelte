# 🚀 SuperSvelte

> **The Batteries-Included, Zero-Codegen Full-Stack Svelte 5 Framework.**
> Built with SvelteKit, Svelte 5 Runes, Runed, OpenAPI 3.1 Hono RPC, Better Auth, Polar Payments, Neon Postgres, Drizzle ORM, and Upstash Redis.

---

## 📌 Overview

**SuperSvelte** is an enterprise-grade full-stack boilerplate engineered for speed, type safety, and developer autonomy. It combines the reactivity of **Svelte 5 Runes** and **Runed** utilities with an **OpenAPI 3.1 & Hono RPC** backend, providing instant end-to-end type safety without build watchers or external codegen steps.

### ✨ Key Highlights

- **⚡ Svelte 5 Runes & Runed:** Fine-grained reactivity powered by `$state`, `$derived`, `$effect`, and snippets with 0 Virtual DOM overhead, enhanced by `runed` composables (`persistedState`, `Debounced`, `watch`, `useMediaQuery`).
- **🔥 0-Codegen OpenAPI RPC:** Backend routes written with `@hono/zod-openapi` automatically infer client types (`hc<AppType>`) while generating live OpenAPI 3.1 specs and interactive **Swagger UI** at `/api/docs`.
- **💳 Polar Billing & Automated Fulfillment:** Merchant of Record (MoR) checkout integration, automated GitHub repository invitations, customer license tracking, and signature-verified webhooks.
- **🔒 Declarative Feature Gating & RBAC:** Protect frontend UI with `<Gate required="pro">`, secure backend endpoints with `requirePlan('pro')` Hono middleware, and enforce role-based access control (Admin, Owner, Member).
- **🏢 Multi-Tenant Workspaces:** Organization switching, invitation management via `/accept-invitation/[id]`, and Better Auth session synchronization.
- **🐘 Serverless Database & Caching:** Neon Postgres paired with Drizzle ORM for type-safe database queries and Upstash Redis for sliding-window rate limiting, QStash background job queues, and SSE streaming.
- **📦 Svelte-Native Transactional Emails:** Dynamic email rendering using Svelte 5 components and `svelte/server` rendered via Resend.
- **🧪 Colocated Test Bench:** Modular diagnostic sandbox covering live RPC execution, Neon/Redis cache queries, UploadThing storage, and SSE heartbeats.

---

## 🛠️ Tech Stack

| Domain                 | Technology                                                                                                           | Description                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Frontend**           | [SvelteKit](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)                                               | Runes reactivity, filesystem routing, and hybrid SSR                  |
| **Reactive Utilities** | [Runed](https://runed.dev/)                                                                                          | Svelte 5 composables (`persistedState`, `Debounced`, `watch`)         |
| **Styling & UI**       | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn-svelte](https://shadcn-svelte.com/)                            | Accessible UI primitives with Lucide icons & design tokens            |
| **API Layer**          | [Hono](https://hono.dev/) & [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Type-safe OpenAPI RPC engine + Swagger UI                             |
| **Payments & MoR**     | [Polar](https://polar.sh/)                                                                                           | Global tax compliance, hosted checkout, customer portal, and webhooks |
| **Authentication**     | [Better Auth](https://www.better-auth.com/)                                                                          | Sessions, OAuth, Organizations / Multi-tenancy, and Admin plugins     |
| **Database & ORM**     | [Neon Postgres](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)                                       | Serverless Postgres with strict TypeScript schemas & relations        |
| **Cache & Realtime**   | [Upstash Redis](https://upstash.com/) & QStash                                                                       | Sliding-window rate limiting, async worker queue, and SSE streaming   |
| **Storage & Mail**     | UploadThing & Resend                                                                                                 | Direct-to-cloud S3 storage and Svelte 5 component-rendered emails     |

---

## 📁 Project Structure

```text
supersvelte/
├── scripts/
│   └── scaffold-resource.ts            # CLI entity generator (pnpm make:resource)
│
├── src/
│   ├── app.d.ts                        # Better Auth session & App.Locals typing
│   ├── app.html
│   ├── hooks.server.ts                 # Better Auth handler, route guards & rate limiting
│   │
│   ├── lib/
│   │   ├── api-client.ts               # Type-safe Hono RPC client (hc<AppType>)
│   │   ├── auth-client.ts              # Better Auth browser client
│   │   ├── index.ts                    # Library root export
│   │   ├── realtime.svelte.ts          # SSE EventSource reactive rune store
│   │   ├── uploadthing.ts              # UploadThing client helpers
│   │   ├── utils.ts                    # Tailwind cn() helpers
│   │   │
│   │   ├── components/                 # UI primitives & interactive components
│   │   │   ├── CodeComparison.svelte
│   │   │   ├── Counter.svelte          # Reactive Svelte 5 demo counter
│   │   │   ├── Counter.test.ts         # Colocated component unit test
│   │   │   ├── Gate.svelte             # Declarative plan gating (<Gate required="pro">)
│   │   │   ├── PolarCheckout.svelte    # Polar hosted checkout launcher
│   │   │   ├── SuperSvelteVsOthers.svelte
│   │   │   ├── TeamSwitcher.svelte     # Multi-tenant organization dropdown
│   │   │   ├── ThemeToggle.svelte      # Dark/light mode switcher
│   │   │   └── ui/                     # shadcn-svelte UI primitives (Button, Field, Form, Input, Label, Separator)
│   │   │
│   │   ├── config/
│   │   │   ├── code-comparisons.ts     # Code preview matrices
│   │   │   ├── comparison.ts           # Marketing feature comparisons
│   │   │   ├── pricing.ts              # Pricing tiers & feature lists
│   │   │   └── seo.ts                  # Site metadata & OpenGraph config
│   │   │
│   │   ├── emails/                     # Transactional email templates
│   │   │   └── WelcomeEmail.svelte     # Svelte 5 SSR-rendered email
│   │   │
│   │   └── server/                     # Backend infrastructure & services
│   │       ├── email.ts                # Resend client & Svelte SSR renderer
│   │       ├── licences.ts             # GitHub API repository invite logic
│   │       ├── polar.ts                # Polar Server SDK instance
│   │       ├── ratelimit.ts            # Upstash sliding-window rate limiter
│   │       ├── uploadthing.ts          # UploadThing file router definition
│   │       ├── utapi.ts                # UploadThing Server API client
│   │       ├── utils.ts                # Server utility helpers
│   │       │
│   │       ├── api/                    # OpenAPI Hono Engine
│   │       │   └── index.ts            # OpenAPI routes, Zod schemas & RPC types
│   │       │
│   │       ├── auth/                   # Better-Auth configuration & middleware
│   │       │   ├── guards.ts           # requirePlan() Hono middleware
│   │       │   └── index.ts            # Better-Auth server instance & plugins
│   │       │
│   │       ├── db/                     # Neon Postgres & Drizzle ORM
│   │       │   ├── auth.schema.ts      # Better Auth generated tables
│   │       │   ├── index.ts            # Database client instance
│   │       │   ├── queries.ts          # Cached queries & Redis invalidation
│   │       │   └── schema.ts           # Application tables & relations
│   │       │
│   │       └── queue/                  # Upstash QStash async queue
│   │           └── index.ts            # Event dispatcher & payload types
│   │
│   └── routes/
│       ├── +layout.server.ts           # Root session & purchase loader
│       ├── +layout.svelte              # Root shell with global styles
│       ├── layout.css
│       ├── sitemap.xml/+server.ts      # Dynamic XML sitemap generator
│       │
│       ├── (app)/                      # Authenticated Application Shell
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte          # App sidebar & workspace layout
│       │   ├── dashboard/              # User Dashboard (/dashboard)
│       │   │   ├── billing/            # License & billing portal (/dashboard/billing)
│       │   │   │   ├── +page.server.ts
│       │   │   │   └── +page.svelte
│       │   │   ├── +page.server.ts
│       │   │   └── +page.svelte
│       │   └── settings/
│       │       └── team/               # Workspace & member management (/settings/team)
│       │           └── +page.svelte
│       │
│       ├── (auth)/                     # Authentication Flow Pages
│       │   ├── +layout.svelte
│       │   ├── login/                  # Sign In (/login)
│       │   │   ├── +page.server.ts
│       │   │   └── +page.svelte
│       │   └── signup/                 # Register (/signup)
│       │       ├── +page.server.ts
│       │       └── +page.svelte
│       │
│       ├── (marketing)/                # Public Landing & Marketing Pages
│       │   ├── +layout.svelte
│       │   ├── +page.svelte            # Landing page with checkout triggers (/)
│       │   ├── privacy/+page.svelte    # Privacy policy (/privacy)
│       │   ├── refunds/+page.svelte    # Refund policy (/refunds)
│       │   ├── terms/+page.svelte      # Terms of service (/terms)
│       │   ├── vs/+page.svelte         # Competitor comparison matrix (/vs)
│       │   └── welcome/                # Post-checkout onboarding (/welcome)
│       │       ├── +page.server.ts
│       │       └── +page.svelte
│       │
│       ├── accept-invitation/
│       │   └── [id]/                   # Workspace Invitation Acceptor (/accept-invitation/:id)
│       │       └── +page.svelte
│       │
│       ├── admin/                      # Protected Admin Dashboard (/admin)
│       │   ├── +layout.server.ts
│       │   ├── +page.server.ts
│       │   └── +page.svelte
│       │
│       ├── api/                        # Standalone Endpoints & Webhooks
│       │   ├── checkout/+server.ts     # Polar dynamic checkout session creator
│       │   ├── download/+server.ts     # Protected binary asset delivery
│       │   ├── portal/+server.ts       # Polar customer portal redirect
│       │   ├── queue/worker/+server.ts # QStash background worker receiver
│       │   ├── test-queue/+server.ts   # Dev-only queue event dispatcher
│       │   ├── uploadthing/+server.ts  # UploadThing file upload endpoint
│       │   ├── v1/verify-licence/      # External license verification API
│       │   │   └── +server.ts
│       │   ├── webhooks/polar/         # Polar HMAC-verified webhook receiver
│       │   │   └── +server.ts
│       │   └── [...paths]/+server.ts   # Catch-all Hono OpenAPI SvelteKit adapter
│       │
│       ├── test/                       # Diagnostic Bench & Infrastructure Suite (/test)
│       │   ├── components/             # Modular diagnostic subcomponents
│       │   │   ├── AuthTab.svelte
│       │   │   ├── DbTab.svelte
│       │   │   ├── PolarTab.svelte
│       │   │   ├── RpcTab.svelte
│       │   │   ├── SseTab.svelte
│       │   │   └── UploadTab.svelte
│       │   ├── +page.server.ts         # Dev & admin-protected server actions
│       │   ├── +page.svelte            # Tabbed diagnostic UI
│       │   └── +page.ts                # Hono RPC diagnostic client loader
│       │
│       └── test-gate/                  # Dev-only Feature Gating Diagnostic (/test-gate)
│           ├── +page.server.ts
│           └── +page.svelte
│
└── tests/
    └── setup.ts                        # Global Vitest configuration & runtime mocks

```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/FunctionalFrost/supersvelte.git
cd supersvelte
pnpm install

```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env

```

Ensure the following core variables are configured:

- `DATABASE_URL`: Connection string for Neon Postgres.
- `BETTER_AUTH_SECRET`: 32-byte secret key for session encryption (`openssl rand -hex 32`).
- `POLAR_ACCESS_TOKEN` & `POLAR_WEBHOOK_SECRET`: Polar API credentials.
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis cache and rate limiting.
- `RESEND_API_KEY`: Resend API key for transactional emails.
- `UPLOADTHING_TOKEN`: UploadThing credentials for direct file uploads.

### 3. Generate Database Schemas & Push Migrations

```bash
pnpm auth:schema
pnpm db:push

```

### 4. Start the Development Server

```bash
pnpm dev

```

- **Application:** `http://localhost:5173`
- **Diagnostic Workbench:** `http://localhost:5173/test`
- **Swagger UI Docs:** `http://localhost:5173/api/docs`
- **OpenAPI 3.1 Spec JSON:** `http://localhost:5173/api/doc`

---

## 🛠️ Developer Productivity Commands

```bash
# Generate a full CRUD entity slice (Drizzle Schema + OpenAPI Hono RPC Route)
pnpm make:resource invoice

# Run end-to-end type safety checks across Svelte 5 Runes and TypeScript
pnpm check

# Run automated tests with Vitest
pnpm test

# Format and lint codebase
pnpm format
pnpm lint

```
