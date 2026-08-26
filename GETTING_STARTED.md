# 🚀 Getting Started with SuperSvelte

Welcome to SuperSvelte! Follow this guide to take your project from zero to a fully deployed SaaS application in under 5 minutes.

---

## 🛠️ Prerequisites

Ensure you have the following installed locally:

- **Node.js**: `v20.0.0` or higher (tested with `v24+`)
- **Package Manager**: `pnpm` (recommended), `npm`, or `bun`
- **Git**

---

## ⚡ Local Setup

### 1. Clone the Repository & Install Dependencies

```bash
git clone https://github.com/FuntionalFrost/supersvelte.git
cd supersvelte
pnpm install

```

### 2. Environment Variables Configuration

Copy the template environment file:

```bash
cp .env.example .env

```

Open `.env` and configure your API keys:

| Variable                           | Description                                                                                                                     | Where to Find                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `ORIGIN`                           | App Base URL (`http://localhost:5173` locally, or `[https://supersvelte.netlify.app](https://supersvelte.netlify.app)` in prod) | Deployment domain                              |
| `DATABASE_URL`                     | Neon PostgreSQL connection string (pooled)                                                                                      | [Neon Console](https://neon.tech)              |
| `BETTER_AUTH_SECRET`               | 32-byte secret for session tokens                                                                                               | Run `openssl rand -hex 32`                     |
| `POLAR_ENVIRONMENT`                | `"sandbox"` or `"production"`                                                                                                   | Polar Dashboard                                |
| `POLAR_ACCESS_TOKEN`               | Polar Organization Access Token (`polar_at_...`)                                                                                | Polar Settings → Developers                    |
| `POLAR_WEBHOOK_SECRET`             | Signing secret for webhook validation (`polar_whsec_...`)                                                                       | Polar Webhooks → Endpoint Secret               |
| `PUBLIC_POLAR_STANDARD_PRODUCT_ID` | Standard tier product ID (`prod_...`)                                                                                           | Polar Products Catalog                         |
| `PUBLIC_POLAR_PRO_PRODUCT_ID`      | Pro tier product ID (`prod_...`)                                                                                                | Polar Products Catalog                         |
| `UPSTASH_REDIS_REST_URL`           | Redis URL for sliding-window rate limiting                                                                                      | [Upstash Console](https://upstash.com)         |
| `UPSTASH_REDIS_REST_TOKEN`         | Upstash Redis REST token                                                                                                        | Upstash Console                                |
| `QSTASH_TOKEN`                     | _(Optional)_ Upstash QStash token for async background jobs                                                                     | Upstash Console                                |
| `RESEND_API_KEY`                   | Transactional email delivery key                                                                                                | [Resend Console](https://resend.com)           |
| `UPLOADTHING_TOKEN`                | Direct S3 file storage secret token                                                                                             | [UploadThing Console](https://uploadthing.com) |
| `GITHUB_ADMIN_TOKEN`               | Personal Access Token with repo invite scope                                                                                    | GitHub Developer Settings                      |
| `GITHUB_REPO_OWNER`                | GitHub account or org name holding the template repo                                                                            | GitHub                                         |
| `GITHUB_REPO_NAME`                 | Private repository name to invite buyers to                                                                                     | GitHub                                         |

---

### 3. Database Schema Push

Apply the Drizzle ORM schema to your Neon PostgreSQL database:

```bash
# Push schema directly to your Neon database
pnpm db:push

# (Optional) Launch Drizzle Studio GUI
pnpm db:studio

```

---

### 4. Run Development Server

```bash
pnpm dev

```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Developer Productivity Commands

```bash
# Generate a full CRUD entity (Drizzle Schema + Hono RPC Route)
pnpm make:resource invoice

# Run end-to-end typechecks across Svelte 5 runes and TypeScript
pnpm check

# Format and lint codebase
pnpm format
pnpm lint

```

---

## 🚀 Production Deployment (Netlify)

1. **Push your code to GitHub.**
2. **Connect Repository to Netlify:**

- Import your repository on Netlify.
- **Build Command:** `pnpm build`
- **Publish Directory:** `.svelte-kit/netlify` (handled automatically by `@sveltejs/adapter-netlify`).

3. **Set Environment Variables:**

- Copy all key-value pairs from your `.env` into **Netlify Site Configuration → Environment Variables**.
- Ensure `SECRETS_SCAN_OMIT_KEYS = "ORIGIN, PUBLIC_POLAR_STANDARD_PRODUCT_ID, PUBLIC_POLAR_PRO_PRODUCT_ID"` is set in `netlify.toml` to prevent false-positive build blocks.

4. **Configure Polar Webhooks:**

- In your Polar Dashboard, add an endpoint pointing to:

```text
https://supersvelte.netlify.app/api/webhooks/polar

```

- Subscribe to `order.created`, `subscription.created`, `subscription.updated`, and `subscription.revoked`.

5. **Deploy!**

---

## 🧪 Built-in Diagnostic Suite

Navigate to `/test` in your local development environment to run real-time infrastructure tests:

- **Hono RPC Client:** Verify zero-codegen API queries & Upstash sliding-window rate limiting.
- **Drizzle DB & Redis:** Check Neon PostgreSQL query latency and Redis cache hits.
- **UploadThing:** Test cloud file uploads to S3 storage.
- **Realtime SSE:** Verify server-sent event heartbeats over HTTP/2.
- **Better Auth:** Inspect live cookie session states and organization membership.
- **Polar Billing:** Test hosted sandbox checkout flows and customer portal routing.
