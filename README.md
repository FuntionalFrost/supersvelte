# 🚀 SuperSvelte

> **The Batteries-Included, Zero-Codegen Full-Stack Svelte 5 Framework.**
> Built with SvelteKit, Svelte 5 Runes, OpenAPI 3.1 Hono RPC, Better Auth, Paddle Payments, Neon Postgres, Drizzle ORM, and Upstash Redis.

---

## 📌 Overview

**SuperSvelte** is an enterprise-grade full-stack boilerplate engineered for speed, type safety, and zero-vendor-lock-in. It combines the reactivity of **Svelte 5 Runes** with an **OpenAPI 3.1 & Hono RPC** engine, providing instant end-to-end type safety without build watchers or CLI codegen steps.

### ✨ Key Highlights

- **⚡ Svelte 5 Runes:** Powered by `$state`, `$derived`, and `$effect` for fine-grained reactivity with 0 Virtual DOM overhead.
- **🔥 0-Codegen OpenAPI RPC:** Backend routes written with `@hono/zod-openapi` automatically infer client types (`hc<AppType>`) while generating live OpenAPI 3.1 specs and interactive **Swagger UI** at `/api/docs`.
- **💳 Paddle Billing & Automated Fulfillment:** Merchant of Record (MoR) checkout integration, automated GitHub repository invitations, customer license tracking, and signature-verified webhooks with IP filtering.
- **🔐 Better Auth:** Multi-tenant organization & team support, social OAuth, session cookies, and dynamic admin roles out of the box.
- **🐘 Serverless Database:** Neon Postgres paired with Drizzle ORM for type-safe database queries and lightweight serverless pooling.
- **🔴 Caching & SSE:** Upstash Redis for REST-based rate limiting and Hono-native Server-Sent Events (`streamSSE`).
- **📦 File Uploads & Emails:** Pre-configured UploadThing cloud storage and Resend transactional email delivery.
- **🌐 Production Deployments:** Optimized for Netlify and Vercel Serverless edge setups with sub-10ms cold starts.

---

## 🛠️ Tech Stack

| Domain               | Technology                                                                                                           | Description                                                      |
| :------------------- | :------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **Frontend**         | [SvelteKit](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)                                               | Runes reactivity, filesystem routing, and hybrid SSR             |
| **Styling & UI**     | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn-svelte](https://shadcn-svelte.com/)                            | Accessible UI components with Lucide icons & OKLCH palette       |
| **API Layer**        | [Hono](https://hono.dev/) & [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Type-safe OpenAPI RPC engine + Swagger UI                        |
| **Payments & MoR**   | [Paddle](https://www.paddle.com/)                                                                                    | Global tax compliance, checkout overlay, and webhook fulfillment |
| **Authentication**   | [Better Auth](https://www.better-auth.com/)                                                                          | Sessions, OAuth, Organizations, and DB hooks                     |
| **Database & ORM**   | [Neon Postgres](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)                                       | Serverless Postgres with strict TypeScript schemas               |
| **Cache & Realtime** | [Upstash Redis](https://upstash.com/)                                                                                | Sliding-window rate limiting & SSE streaming                     |
| **Storage & Mail**   | UploadThing & Resend                                                                                                 | S3 file storage and transactional email delivery                 |

---

## 🚀 Quickstart

For step-by-step instructions on setting up environment variables, running database migrations, and deploying to Netlify, see the **[Getting Started Guide](./GETTING_STARTED.md)**.

---

## 📁 Project Structure

```text
src/
├── app.d.ts
├── app.html
├── hooks.server.ts                     # Better Auth session & global server hooks
│
├── lib/
│   ├── api-client.ts                   # Type-safe Hono RPC client (hc<AppType>)
│   ├── auth-client.ts                  # Better Auth browser client
│   ├── realtime.svelte.ts              # SSE Event Source reactive rune store
│   ├── uploadthing.ts                  # Client upload utilities
│   ├── utils.ts                        # Tailwind cn() helpers
│   │
│   ├── components/                     # Reusable UI & checkout components
│   │   ├── PaddleCheckout.svelte       # Paddle.js overlay checkout component
│   │   ├── CodeComparison.svelte
│   │   └── ui/                         # shadcn-svelte UI primitive components
│   │
│   ├── config/
│   │   └── comparison.ts               # Marketing comparison matrices
│   │
│   └── server/                         # Server-only backend modules
│       ├── auth.ts                     # Better Auth server instance
│       ├── email.ts                    # Resend email driver
│       ├── licences.ts                 # Paddle purchase & license verification logic
│       ├── paddle.ts                   # Paddle Server SDK & GitHub API invite helper
│       ├── paddle-ip-check.ts          # Paddle webhook IP allowlist validator
│       ├── ratelimit.ts                # Upstash sliding-window rate limiter
│       ├── uploadthing.ts              # UploadThing router definition
│       ├── api/
│       │   └── index.ts                # OpenAPI Hono router & sub-routes
│       └── db/
│           ├── schema.ts               # Drizzle application & purchases schema
│           ├── auth.schema.ts          # Better Auth tables
│           ├── queries.ts              # Database query abstractions
│           └── index.ts                # Neon / Drizzle client instance
│
└── routes/
    ├── +layout.server.ts               # Global session loader
    ├── +layout.svelte
    ├── layout.css
    │
    ├── (app)/                          # Authenticated Application Shell
    │   ├── +layout.server.ts
    │   ├── +layout.svelte
    │   ├── dashboard/                  # Main App Dashboard (/dashboard)
    │   │   ├── +page.server.ts
    │   │   └── +page.svelte
    │   └── settings/                   # App Settings (/settings/team)
    │       └── team/
    │           └── +page.svelte
    │
    ├── (auth)/                         # Auth Flow Pages
    │   ├── +layout.svelte
    │   └── login/
    │       ├── +page.server.ts
    │       └── +page.svelte
    │
    ├── (marketing)/                    # Public Landing & Compliance Pages
    │   ├── +layout.svelte              # Marketing Layout with Legal Footer
    │   ├── +page.svelte                # Landing Page (/)
    │   ├── privacy/                    # Privacy Policy (/privacy)
    │   │   └── +page.svelte
    │   ├── refunds/                    # Refund Policy (/refunds)
    │   │   └── +page.svelte
    │   ├── terms/                      # Terms of Service (/terms)
    │   │   └── +page.svelte
    │   └── welcome/                    # Post-Purchase Onboarding (/welcome)
    │       └── +page.svelte
    │
    ├── accept-invitation/
    │   └── [id]/                       # Organization invitation token handler
    │       └── +page.svelte
    │
    ├── admin/                          # Admin Management Panel
    │   └── +page.svelte
    │
    ├── api/
    │   ├── portal/                     # Paddle customer portal endpoint
    │   │   └── +server.ts
    │   ├── uploadthing/
    │   │   └── +server.ts              # UploadThing SvelteKit endpoint
    │   ├── webhooks/
    │   │   └── paddle/                 # Paddle HMAC & IP verified webhook handler
    │   │       └── +server.ts
    │   └── [...paths]/
    │       └── +server.ts              # Catch-all Hono OpenAPI SvelteKit mount
    │
    └── test/                           # Interactive Sandbox & Diagnostic Suite
        ├── +page.server.ts
        ├── +page.ts
        └── +page.svelte
```
