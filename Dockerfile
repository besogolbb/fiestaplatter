# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────
# Fiesta Platter — production Docker image (Next.js standalone)
# Works out of the box with EasyPanel / Coolify / any Docker host.
# ─────────────────────────────────────────────────────────────

FROM node:22-alpine AS base
# libc6-compat helps some native deps (e.g. sharp) on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Install dependencies (cached layer) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time. Pass your live domain so
# canonical URLs, sitemap and OpenGraph tags are correct.
#   EasyPanel: add these as "Build arguments" on the service.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_FB_PIXEL_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_FB_PIXEL_ID=$NEXT_PUBLIC_FB_PIXEL_ID \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runtime ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output already contains a minimal node_modules + server.js.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
