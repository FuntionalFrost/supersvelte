# Stage 1: Build stage
FROM node:26-alpine AS builder

WORKDIR /app

# Install pnpm directly (avoids Corepack unbundling quirks)
RUN npm install -g pnpm@latest

# Cache dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Build with Node adapter for containerized self-hosting
ENV DEPLOY_TARGET=node
COPY . .
RUN pnpm build
RUN pnpm prune --prod

# Stage 2: Production runtime stage
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Run unprivileged
USER node

COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/build ./build

EXPOSE 3000
CMD ["node", "build/index.js"]
