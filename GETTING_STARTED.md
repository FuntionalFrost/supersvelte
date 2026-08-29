# 🚀 Getting Started with SuperSvelte

Welcome to SuperSvelte. Follow this guide to take your project from zero to a fully deployed full-stack SaaS application in under 5 minutes.

---

## 🛠️ Prerequisites

Ensure you have the following installed locally:

- **Node.js:** `v20.0.0` or higher (tested on `v22+` & `v24+`)
- **Package Manager:** `pnpm` (recommended), `npm`, or `bun`
- **Git**

---

## ⚡ Local Setup

### 1. Clone the Repository & Install Dependencies

```bash
git clone https://github.com/FunctionalFrost/supersvelte.git
cd supersvelte
pnpm install

```

---

### 2. Configure Environment Variables

Create your local `.env` configuration:

```bash
cp .env.example .env

```

Configure the following variables in `.env`:

| Variable                           | Description                                                            | Source / How to Obtain                         |
| ---------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `ORIGIN`                           | Base URL (`http://localhost:5173` locally, production domain deployed) | Localhost or deployment domain                 |
| `DATABASE_URL`                     | Neon Postgres pooled connection string                                 | [Neon Console](https://neon.tech)              |
| `BETTER_AUTH_SECRET`               | 32-byte secret key for cookie session encryption                       | Run `openssl rand -hex 32`                     |
| `POLAR_ENVIRONMENT`                | `"sandbox"` (for testing) or `"production"`                            | Polar Dashboard                                |
| `POLAR_ACCESS_TOKEN`               | Polar Organization Access Token (`polar_at_...`)                       | Polar Settings → Developers                    |
| `POLAR_WEBHOOK_SECRET`             | Webhook signing secret (`polar_whsec_...`)                             | Polar Webhooks → Endpoint Secret               |
| `PUBLIC_POLAR_STANDARD_PRODUCT_ID` | Standard tier product ID (`prod_...`)                                  | Polar Products Catalog                         |
| `PUBLIC_POLAR_PRO_PRODUCT_ID`      | Pro tier product ID (`prod_...`)                                       | Polar Products Catalog                         |
| `UPSTASH_REDIS_REST_URL`           | Upstash Redis REST endpoint for rate limiting & cache                  | [Upstash Console](https://upstash.com)         |
| `UPSTASH_REDIS_REST_TOKEN`         | Upstash Redis REST authentication token                                | Upstash Console                                |
| `QSTASH_TOKEN`                     | _(Optional)_ Upstash QStash token for async background jobs            | Upstash Console                                |
| `RESEND_API_KEY`                   | Resend API key for transactional email delivery                        | [Resend Console](https://resend.com)           |
| `EMAIL_FROM`                       | Verified sender address (e.g. `App <support@yourdomain.com>`)          | Resend Domains                                 |
| `UPLOADTHING_TOKEN`                | Direct S3 file storage token                                           | [UploadThing Console](https://uploadthing.com) |
| `GITHUB_ADMIN_TOKEN`               | GitHub Personal Access Token with repository invite scope              | GitHub Developer Settings                      |
| `GITHUB_REPO_OWNER`                | GitHub username or organization holding your private template          | GitHub                                         |
| `GITHUB_REPO_NAME`                 | Private repository name to grant buyer access to                       | GitHub                                         |

---

### 3. Generate Auth Schemas & Sync Database

Generate Better-Auth table definitions and push all Drizzle schemas to your Neon Postgres database:

```bash
# 1. Generate Better-Auth Drizzle schemas (src/lib/server/db/auth.schema.ts)
pnpm auth:schema

# 2. Push application and auth schemas to Neon Postgres
pnpm db:push

# 3. (Optional) Seed the database with a test user and demo records
pnpm db:seed

# 4. (Optional) Open the visual Drizzle Studio schema browser
pnpm db:studio

```

---

### 4. Start the Development Server

```bash
pnpm dev

```

- **Application:** [http://localhost:5173](http://localhost:5173)
- **Diagnostic Workbench:** [http://localhost:5173/test](http://localhost:5173/test)
- **Interactive OpenAPI Swagger Docs:** [http://localhost:5173/api/docs](http://localhost:5173/api/docs)
- **OpenAPI 3.1 Spec JSON:** [http://localhost:5173/api/doc](http://localhost:5173/api/doc)

---

## 🛠️ Developer Productivity Commands

```bash
# Generate full-stack CRUD slice (Drizzle Schema + OpenAPI Hono Route)
pnpm make:resource invoice

# Run end-to-end type safety checks (Svelte 5 Runes + TypeScript)
pnpm check

# Run automated tests with Vitest
pnpm test

# Format and lint codebase
pnpm format
pnpm lint

```

---

## 🚀 Production Deployment (Netlify)

1. **Push your code to GitHub.**
2. **Connect Repository to Netlify:**

- Import your repository on the Netlify dashboard.
- **Build Command:** `pnpm build`
- **Publish Directory:** `.svelte-kit/netlify` (handled automatically via `@sveltejs/adapter-netlify`).

3. **Configure Environment Variables:**

- Copy all key-value pairs from your production `.env` into **Netlify Site Configuration → Environment Variables**.
- Set `SECRETS_SCAN_OMIT_KEYS = "ORIGIN, PUBLIC_POLAR_STANDARD_PRODUCT_ID, PUBLIC_POLAR_PRO_PRODUCT_ID"` in `netlify.toml` to prevent false-positive build flags.

4. **Configure Polar Webhooks:**

- Add a webhook endpoint in your Polar Dashboard pointing to:

```text
https://your-domain.netlify.app/api/webhooks/polar

```

- Subscribe to events: `order.created`, `subscription.created`, `subscription.updated`, and `subscription.revoked`.

5. **Deploy Site.**

---

## 🧪 Built-in Diagnostic Suite

Navigate to `/test` in your local development environment to run real-time infrastructure tests:

- **1. Hono RPC Client:** Verify 0-codegen client queries and Upstash sliding-window rate limiting.
- **2. Drizzle DB & Redis:** Measure query round-trip latency to Neon and verify Redis cache hits/invalidation.
- **3. UploadThing Storage:** Test direct-to-cloud file uploads to S3 storage.
- **4. Realtime SSE:** Verify server-sent event heartbeats streamed over HTTP/2.
- **5. Better Auth:** Inspect live cookie session states, organization context, and role-based permissions.
- **6. Polar Billing:** Test hosted sandbox checkout triggers, custom metadata passing, and customer portal redirection.
