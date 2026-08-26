# 🚀 SuperSvelte

> **The Batteries-Included, Zero-Codegen Full-Stack Svelte 5 Framework.**
> Built with SvelteKit, Svelte 5 Runes, OpenAPI 3.1 Hono RPC, Better Auth, Polar Payments, Neon Postgres, Drizzle ORM, and Upstash Redis.

---

## 📌 Overview

**SuperSvelte** is an enterprise-grade full-stack boilerplate engineered for speed, type safety, and developer autonomy. It combines the reactivity of **Svelte 5 Runes** with an **OpenAPI 3.1 & Hono RPC** backend, providing instant end-to-end type safety without build watchers or external codegen steps.

### ✨ Key Highlights

- **⚡ Svelte 5 Runes:** Fine-grained reactivity powered by `$state`, `$derived`, `$effect`, and snippets with 0 Virtual DOM overhead.
- **🔥 0-Codegen OpenAPI RPC:** Backend routes written with `@hono/zod-openapi` automatically infer client types (`hc<AppType>`) while generating live OpenAPI 3.1 specs and interactive **Swagger UI** at `/api/docs`.
- **💳 Polar Billing & Automated Fulfillment:** Merchant of Record (MoR) checkout integration, automated GitHub repository invitations, customer license tracking, and signature-verified webhooks.
- **🔒 Declarative Feature Gating:** Protect frontend UI with `<Gate required="pro">` and secure backend endpoints with `requirePlan('pro')` Hono middleware.
- **🏢 Multi-Tenant Workspaces & RBAC:** Pre-configured organization switching, team member invitations, and role-based permissions via Better Auth.
- **🛠️ Entity Scaffolder CLI:** Generate complete full-stack CRUD slices (Drizzle schemas, typed RPC routes, and Zod validators) with `pnpm make:resource <name>`.
- **🐘 Serverless Database:** Neon Postgres paired with Drizzle ORM for type-safe database queries and serverless connection pooling.
- **🔴 Caching & SSE:** Upstash Redis for REST-based rate limiting, background task queues (QStash), and Hono-native Server-Sent Events (`streamSSE`).
- **📦 File Uploads & Emails:** Pre-configured UploadThing cloud storage and Resend transactional email delivery.
- **🌐 Production Deployments:** Zero-configuration Netlify deployment with sub-10ms edge caching and serverless execution.

---

## 🛠️ Tech Stack

| Domain               | Technology                                                                                                           | Description                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Frontend**         | [SvelteKit](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)                                               | Runes reactivity, filesystem routing, and hybrid SSR                  |
| **Styling & UI**     | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn-svelte](https://shadcn-svelte.com/)                            | Accessible UI components with Lucide icons & design tokens            |
| **API Layer**        | [Hono](https://hono.dev/) & [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Type-safe OpenAPI RPC engine + Swagger UI                             |
| **Payments & MoR**   | [Polar](https://polar.sh/)                                                                                           | Global tax compliance, hosted checkout, customer portal, and webhooks |
| **Authentication**   | [Better Auth](https://www.better-auth.com/)                                                                          | Sessions, OAuth, Organizations / Multi-tenancy, and DB hooks          |
| **Database & ORM**   | [Neon Postgres](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)                                       | Serverless Postgres with strict TypeScript schemas                    |
| **Cache & Realtime** | [Upstash Redis](https://upstash.com/) & QStash                                                                       | Sliding-window rate limiting, async queue, and SSE streaming          |
| **Storage & Mail**   | UploadThing & Resend                                                                                                 | S3 file storage and transactional email delivery                      |

---

## 📁 Project Structure

```text
supersvelte/
├── scripts/
│   └── scaffold-resource.ts            # CLI entity generator (pnpm make:resource)
│
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── hooks.server.ts                 # Better Auth session & global server hooks
│   │
│   ├── lib/
│   │   ├── api-client.ts               # Type-safe Hono RPC client (hc<AppType>)
│   │   ├── auth-client.ts              # Better Auth browser client
│   │   ├── realtime.svelte.ts          # SSE Event Source reactive rune store
│   │   ├── uploadthing.ts              # Client upload utilities
│   │   ├── utils.ts                    # Tailwind cn() helpers
│   │   │
│   │   ├── components/                 # Reusable UI & checkout components
│   │   │   ├── Gate.svelte             # Declarative plan gating component
│   │   │   ├── PolarCheckout.svelte    # Polar hosted checkout launcher
│   │   │   ├── TeamSwitcher.svelte     # Multi-tenant organization dropdown
│   │   │   ├── CodeComparison.svelte
│   │   │   └── ui/                     # shadcn-svelte UI primitives
│   │   │
│   │   ├── config/
│   │   │   ├── pricing.ts              # Pricing plans & feature tiers
│   │   │   ├── seo.ts                  # Site metadata & OpenGraph config
│   │   │   └── comparison.ts           # Marketing comparison matrices
│   │   │
│   │   └── server/                     # Server-only backend modules
│   │       ├── auth/
│   │       │   ├── index.ts            # Better Auth server instance & plugins
│   │       │   └── guards.ts           # requirePlan() Hono middleware
│   │       ├── db/
│   │       │   ├── index.ts            # Neon / Drizzle client instance
│   │       │   ├── schema.ts           # Drizzle application & purchases schema
│   │       │   └── auth.schema.ts      # Better Auth tables
│   │       ├── queue/
│   │       │   └── index.ts            # Upstash QStash async event dispatcher
│   │       ├── polar.ts                # Polar Server SDK instance
│   │       ├── licences.ts             # GitHub API collaborator invite logic
│   │       ├── email.ts                # Resend email driver
│   │       ├── ratelimit.ts            # Upstash sliding-window rate limiter
│   │       ├── uploadthing.ts          # UploadThing router definition
│   │       └── api/
│   │           └── index.ts            # OpenAPI Hono router & sub-routes
│   │
│   └── routes/
│       ├── +layout.server.ts           # Global session & purchase loader
│       ├── +layout.svelte              # Root shell with dynamic favicon sync
│       ├── layout.css
│       │
│       ├── (app)/                      # Authenticated Application Shell
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte          # Responsive app layout with TeamSwitcher
│       │   ├── dashboard/              # Main App Dashboard (/dashboard)
│       │   │   ├── billing/            # License & billing management (/dashboard/billing)
│       │   │   │   ├── +page.server.ts
│       │   │   │   └── +page.svelte
│       │   │   ├── +page.server.ts
│       │   │   └── +page.svelte
│       │   └── settings/               # App Settings (/settings/team)
│       │       └── team/
│       │           └── +page.svelte
│       │
│       ├── (auth)/                     # Authentication Flow Pages
│       │   ├── +layout.svelte
│       │   └── login/
│       │       ├── +page.server.ts
│       │       └── +page.svelte
│       │
│       ├── (marketing)/                # Public Landing & Compliance Pages
│       │   ├── +layout.svelte          # Marketing layout with SEO tags & footer
│       │   ├── +page.svelte            # Landing page with Polar checkouts (/)
│       │   ├── privacy/                # Privacy policy (/privacy)
│       │   ├── refunds/                # Refund policy (/refunds)
│       │   ├── terms/                  # Terms of service (/terms)
│       │   └── welcome/                # Post-checkout onboarding (/welcome)
│       │
│       ├── api/
│       │   ├── checkout/               # Dynamic Polar checkout session endpoint
│       │   │   └── +server.ts
│       │   ├── portal/                 # Polar customer portal redirect endpoint
│       │   │   └── +server.ts
│       │   ├── queue/
│       │   │   └── worker/             # Async background job worker
│       │   │       └── +server.ts
│       │   ├── uploadthing/            # UploadThing file upload endpoint
│       │   │   └── +server.ts
│       │   ├── webhooks/
│       │   │   └── polar/              # Polar HMAC-verified webhook handler
│       │   │       └── +server.ts
│       │   └── [...paths]/             # Catch-all Hono OpenAPI SvelteKit mount
│       │       └── +server.ts
│       │
│       └── test/                       # Interactive Sandbox & Diagnostic Suite
│           ├── +page.server.ts
│           └── +page.svelte

```
