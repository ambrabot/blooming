# BLOOMING — Claude Instructions

## What this is
BLOOMING (חַיִל) is a Christian therapeutic SaaS platform integrating:
- AI therapist "Rafa" (Claude Sonnet 4.6) with messianic Jewish-rooted, biblical counseling approach
- Endocrinology-aware (cycle tracking, hormonal context)
- Marriage counseling, family systems, emotional regulation (polyvagal)
- Assessment, journaling, teaching modules, progress tracking
- Per-module Stripe purchases

## Stack
- Next.js 16 App Router, TypeScript
- Prisma 7 + PostgreSQL
- Custom JWT auth (cookie: `BLOOMING_auth`, 30 days)
- Anthropic SDK (Sonnet 4.6 for therapy, Haiku for summaries/reflections)
- Stripe (per-module checkout)
- Tailwind CSS + shadcn/ui

## Key files
- `lib/ai/system-prompt.ts` — therapist identity, principles, module context builder
- `lib/ai/therapist.ts` — Claude API wrappers (stream, summary, reflection, assessment)
- `lib/auth/jwt.ts` — sign/verify/set/clear session cookie
- `lib/db/client.ts` — Prisma singleton
- `prisma/schema.prisma` — full data model
- `prisma/seed.ts` — 8 modules + assessment questions
- `app/api/ai/chat/route.ts` — streaming therapy chat (SSE)
- `app/api/assessment/route.ts` — submit + AI-analyze assessment
- `app/(auth)/onboarding/page.tsx` — initial assessment UX

## Modules (8)
1. **Fundamentos** — identity, honor culture (slug: `fundamentos`)
2. **Mulher** — endocrinology, cycle, feminine identity (slug: `mulher`)
3. **Cura Interior** — beliefs, dysfunctions, inner healing (slug: `cura-interior`)
4. **Regulação Emocional** — polyvagal, social brain (slug: `regulacao-emocional`)
5. **Casamento** — couples dynamics, covenant (slug: `casamento`)
6. **Família Funcional** — generational healing, family systems (slug: `familia-funcional`)
7. **Liderança** — honor culture, authority, influence (slug: `lideranca`)
8. **Tempo de Deus** — stewardship, kairos, seasons (slug: `tempo-de-deus`)

## Setup
```bash
# 1. Configure .env with DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, Stripe keys
# 2. Run migrations
npx prisma migrate dev --name init
# 3. Generate client
npx prisma generate
# 4. Seed modules
npm run db:seed
# 5. Dev
npm run dev
```

## Therapist identity
Rafa is a warm, direct Christian therapist rooted in messianic Jewish culture.
She integrates: Scripture, polyvagal theory, attachment, endocrinology, honor culture.
System prompt is built dynamically with user context (cycle phase, season, module).
See `lib/ai/system-prompt.ts` for full identity and principles.

## Assessment flow
1. User registers → redirected to `/onboarding`
2. 8-question assessment (scale, choice, multiselect, text)
3. AI analysis → personalized report + module recommendations
4. User lands on `/dashboard` with roadmap

## Pricing (BRL)
- Basic modules: R$ 97
- Advanced modules: R$ 127 or R$ 147
- No subscription — per-module lifetime access
