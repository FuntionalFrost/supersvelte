# 🚀 Getting Started with SuperSvelte

Welcome to SuperSvelte! Follow this guide to take your project from zero to a fully deployed SaaS application in under 5 minutes.

---

## 🛠️ Prerequisites

Ensure you have the following installed locally:

- **Node.js**: `v24.0.0` or higher
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

Open `.env` and fill in your keys:

| Variable                          | Description                             | Where to Find                                  |
| --------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `DATABASE_URL`                    | Neon PostgreSQL Connection String       | [Neon Console](https://neon.tech)              |
| `BETTER_AUTH_SECRET`              | 32-byte secret for session tokens       | Run `openssl rand -hex 32`                     |
| `PUBLIC_PADDLE_ENV`               | `"sandbox"` or `"production"`           | Paddle Dashboard                               |
| `PUBLIC_PADDLE_CLIENT_TOKEN`      | Client token (`test_...` or `live_...`) | Developer tools → Authentication               |
| `PUBLIC_PADDLE_STANDARD_PRICE_ID` | Standard tier price ID (`pri_...`)      | Catalog → Prices                               |
| `PUBLIC_PADDLE_PRO_PRICE_ID`      | Pro tier price ID (`pri_...`)           | Catalog → Prices                               |
| `PADDLE_API_KEY`                  | Server API Key (`pdl_api_...`)          | Developer tools → API keys                     |
| `PADDLE_WEBHOOK_SECRET`           | Signing secret (`pdl_whsec_...`)        | Developer tools → Notifications                |
| `UPSTASH_REDIS_REST_URL`          | Redis URL for rate limiting & SSE       | [Upstash Console](https://upstash.com)         |
| `UPSTASH_REDIS_REST_TOKEN`        | Redis REST token                        | Upstash Console                                |
| `RESEND_API_KEY`                  | Transactional email key                 | [Resend Console](https://resend.com)           |
| `UPLOADTHING_TOKEN`               | S3 file storage secret token            | [UploadThing Console](https://uploadthing.com) |

---

### 3. Database Schema Push

Apply the Drizzle ORM schema to your Neon PostgreSQL database:

```bash
# Push schema directly to your Neon database
pnpm drizzle-kit push

# (Optional) Launch Drizzle Studio to inspect database UI
pnpm drizzle-kit studio

```

---

### 4. Run Development Server

```bash
pnpm dev

```

Open <http://localhost:5173> in your browser.

---

## 🚀 Production Deployment (Netlify)

1. **Push your code to GitHub.**
2. **Connect Repository to Netlify:**

- Import your repository on Netlify.
- **Build Command:** `pnpm build`
- **Publish Directory:** `.svelte-kit/netlify` (handled automatically by `@sveltejs/adapter-netlify`).

3. **Set Environment Variables:**

- Copy all key-value pairs from your local `.env` file into **Netlify Site Configuration → Environment Variables**.
- Add `SECRETS_SCAN_OMIT_KEYS = "PUBLIC_PADDLE_ENV, PUBLIC_PADDLE_CLIENT_TOKEN, PUBLIC_PADDLE_STANDARD_PRICE_ID, PUBLIC_PADDLE_PRO_PRICE_ID"` to avoid false-positive secret scanner build failures.

4. **Deploy!**

---

## 🧪 Built-in Diagnostic Suite

Navigate to `/test` in your local development environment to run real-time checks:

- **Hono RPC Client:** Verify zero-codegen API queries & Upstash rate limiter.
- **Drizzle DB & Redis:** Check Neon PostgreSQL query latency and Redis cache hits.
- **UploadThing:** Test cloud file uploads.
- **Realtime SSE:** Verify server-sent event heartbeats.
- **Better Auth:** Inspect live cookie session states.
