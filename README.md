# 🚀 Super Svelte

> **The Batteries-Included, Zero-Codegen Full-Stack Svelte 5 Framework.**
> Built with SvelteKit, Svelte 5 Runes, OpenAPI 3.1 Hono RPC, Better Auth, Neon Postgres, Drizzle ORM, and Upstash Redis.

---

## 📌 Overview

**Super Svelte** is an enterprise-grade full-stack boilerplate engineered for speed, type safety, and zero-vendor-lock-in. It combines the reactivity of **Svelte 5 Runes** with an **OpenAPI 3.1 & Hono RPC** engine, providing instant end-to-end type safety without build watchers or CLI codegen steps.

### ✨ Key Highlights

- **⚡ Svelte 5 Runes:** Powered by `$state`, `$derived`, and `$effect` for fine-grained reactivity with 0 Virtual DOM overhead.
- **🔥 0-Codegen OpenAPI RPC:** Backend routes written with `@hono/zod-openapi` automatically infer client types (`hc<AppType>`) while generating live OpenAPI 3.1 specs and interactive **Swagger UI** at `/api/docs`.
- **🔐 Better Auth:** Multi-tenant organization & team support, social OAuth, session cookies, and dynamic admin roles out of the box.
- **🐘 Serverless Database:** Neon Postgres paired with Drizzle ORM for type-safe database queries and lightweight serverless pooling.
- **🔴 Caching & SSE:** Upstash Redis for REST-based rate limiting and Hono-native Server-Sent Events (`streamSSE`).
- **📦 File Uploads & Emails:** Pre-configured UploadThing and Resend integration.
- **🌐 Native Deployment:** Optimized for Vercel Serverless (Node.js runtime) with sub-10ms cold starts.

---

## 🛠️ Tech Stack

| Domain               | Technology                                                                                                           | Description                                          |
| :------------------- | :------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| **Frontend**         | [SvelteKit](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)                                               | Runes reactivity, filesystem routing, and hybrid SSR |
| **Styling & UI**     | [Tailwind CSS](https://tailwindcss.com/) & [shadcn-svelte](https://shadcn-svelte.com/)                               | Accessible UI components with Lucide icons           |
| **API Layer**        | [Hono](https://hono.dev/) & [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) | Type-safe OpenAPI RPC engine + Swagger UI            |
| **Authentication**   | [Better Auth](https://www.better-auth.com/)                                                                          | Sessions, OAuth, Organizations, and DB hooks         |
| **Database & ORM**   | [Neon Postgres](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)                                       | Serverless Postgres with strict TypeScript schemas   |
| **Cache & Realtime** | [Upstash Redis](https://upstash.com/)                                                                                | Sliding-window rate limiting & SSE streaming         |
| **Storage & Mail**   | UploadThing & Resend                                                                                                 | S3 file storage and transactional email delivery     |

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
│   ├── components/                     # Reusable UI & comparison components
│   │   ├── CodeComparison.svelte
│   │   └── ui/                         # shadcn-svelte UI primitive components
│   │
│   ├── config/
│   │   └── comparison.ts               # Marketing comparison matrices
│   │
│   └── server/                         # Server-only backend modules
│       ├── auth.ts                     # Better Auth server instance
│       ├── email.ts                    # Resend email driver
│       ├── ratelimit.ts                # Upstash sliding-window rate limiter
│       ├── uploadthing.ts              # UploadThing router definition
│       ├── api/
│       │   └── index.ts                # OpenAPI Hono router & sub-routes
│       └── db/
│           ├── schema.ts               # Drizzle application database schema
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
    │   │   └── +page.svelte
    │   └── settings/                   # App Settings (/settings/team)
    │       └── team/
    │           └── +page.svelte
    │
    ├── (auth)/                         # Auth Flow Pages
    │   └── login/
    │       ├── +page.server.ts
    │       └── +page.svelte
    │
    ├── (marketing)/                    # Public Landing Page (/)
    │   └── +page.svelte
    │
    ├── accept-invitation/
    │   └── [id]/                       # Invitation token handler
    │       └── +page.svelte
    │
    ├── admin/                          # Admin Management Panel
    │   └── +page.svelte
    │
    ├── api/
    │   ├── uploadthing/
    │   │   └── +server.ts              # UploadThing SvelteKit endpoint
    │   └── [...paths]/
    │       └── +server.ts              # Catch-all Hono OpenAPI SvelteKit mount
    │
    └── test/                           # Interactive Sandbox & Diagnostic Suite
        ├── +page.server.ts
        └── +page.svelte
```
