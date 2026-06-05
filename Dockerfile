FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# Força devDependencies (tailwind, typescript) mesmo se o Coolify injetar
# NODE_ENV=production no buildtime — npm ci pularia devDeps sem isso.
RUN NODE_ENV=development npm ci --include=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
# O barrel index.ts é versionado, mas o `prisma generate` recusa gerar numa
# pasta não-vazia. Tira o barrel, gera o client limpo, devolve o barrel.
RUN mv lib/generated/prisma/index.ts /tmp/prisma-barrel.ts \
  && npx prisma generate \
  && mv /tmp/prisma-barrel.ts lib/generated/prisma/index.ts
# Build otimizado de produção (devDeps já presentes do stage deps).
RUN NODE_ENV=production npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
