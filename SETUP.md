# BLOOMING — Guia de Setup

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ (local ou hospedado)
- Conta Anthropic (API key)
- Conta Stripe (chaves de teste para dev)
- Git

---

## 1. Clonar e instalar

```bash
git clone <repo>
cd BLOOMING
npm install
```

---

## 2. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

### Banco de dados

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/BLOOMING"
```

**Opções de banco:**

| Opção | Custo | Como criar |
|---|---|---|
| Local (dev) | Grátis | `createdb BLOOMING` (postgres instalado) |
| Neon | Grátis (tier) | neon.tech → New project → copiar connection string |
| Supabase | Grátis (tier) | supabase.com → New project → Settings → Database |
| Railway | $5/mês | railway.app → New → PostgreSQL |
| Lightsail (prod) | $7-15/mês | AWS Lightsail Managed Databases |

> **Atenção:** No Neon e Supabase, a connection string já vem no formato `postgresql://`. Copie ela diretamente.

### Auth

```env
JWT_SECRET="string-aleatoria-longa-minimo-32-chars"
```

Gere com:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Anthropic

```env
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Copie a chave (só aparece uma vez)

### Stripe

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Como obter as chaves Stripe:
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. `STRIPE_SECRET_KEY` = Secret key (sk_test_...)
3. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Publishable key (pk_test_...)
4. Para `STRIPE_WEBHOOK_SECRET`: veja seção Stripe abaixo

---

## 3. Banco de dados

### Criar as tabelas (primeira vez)

```bash
npx prisma migrate dev --name init
```

Isso cria todas as tabelas automaticamente a partir do schema.

### Gerar o client Prisma

```bash
npx prisma generate
```

> Se você já rodou `migrate dev`, o generate é feito automaticamente.

### Popular com dados iniciais (módulos + perguntas)

```bash
npm run db:seed
```

Isso insere os 8 módulos com conteúdo completo e as 8 perguntas do assessment inicial.

### Criar usuário admin

```bash
node -e "
const { PrismaClient } = require('./lib/generated/prisma');
const bcrypt = require('bcryptjs');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('suasenha123', 12);
  const user = await db.user.create({
    data: {
      name: 'Admin',
      email: 'admin@BLOOMING.com.br',
      password: hash,
      role: 'ADMIN',
      profile: { create: {} },
    },
  });
  console.log('Admin criado:', user.email);
  await db.\$disconnect();
}

main().catch(console.error);
" 
```

Ou via script:
```bash
npm run db:create-admin
```

---

## 4. Stripe (desenvolvimento local)

### Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
# Baixar em: https://github.com/stripe/stripe-cli/releases
```

### Fazer login

```bash
stripe login
```

### Ouvir webhooks localmente

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

A CLI vai exibir o `STRIPE_WEBHOOK_SECRET` (começa com `whsec_`). Copie para o `.env`.

### Testar uma compra

1. Use o cartão de teste: `4242 4242 4242 4242`
2. Qualquer data futura, qualquer CVV
3. Qualquer CEP

---

## 5. Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

### Fluxo de teste completo

1. `localhost:3000` → landing page
2. Clique em "Fazer meu assessment"
3. Crie uma conta
4. Conclua o assessment (8 perguntas)
5. Veja o relatório da Rafa e os módulos recomendados
6. Navegue até `/modulos` e tente comprar um
7. Use o cartão de teste `4242...`
8. Após compra, acesse as lições e inicie uma sessão com a Rafa

---

## 6. Primeiro acesso ao Admin

1. Crie o usuário admin (passo 3 acima)
2. Faça login em `localhost:3000/login`
3. Acesse `localhost:3000/admin`

No admin você pode:
- Editar os módulos (título, preço, conteúdo da IA)
- Criar e editar lições
- Gerenciar perguntas dos assessments
- Ver usuários e estatísticas

---

## 7. Deploy (produção)

### Opção recomendada: Vercel + Neon

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar env vars no painel Vercel
# Settings → Environment Variables → adicionar todas do .env

# 4. Rodar migrations em produção
DATABASE_URL="sua-url-prod" npx prisma migrate deploy
DATABASE_URL="sua-url-prod" npm run db:seed
```

### Configurar webhook Stripe em produção

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → Webhooks
2. Add endpoint → `https://seudominio.com/api/stripe/webhook`
3. Eventos: `checkout.session.completed`
4. Copiar o signing secret → `STRIPE_WEBHOOK_SECRET` no Vercel

### Variáveis de produção

```env
NODE_ENV=production
DATABASE_URL=postgresql://...  # banco de produção
JWT_SECRET=...                  # mesmo do .env local
ANTHROPIC_API_KEY=sk-ant-...   # mesma chave
STRIPE_SECRET_KEY=sk_live_...  # chave LIVE (não test)
STRIPE_WEBHOOK_SECRET=whsec_... # webhook de produção
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://seudominio.com
```

---

## 8. Estrutura de arquivos (referência)

```
BLOOMING/
├── app/
│   ├── page.tsx                    # Landing page (público)
│   ├── (auth)/                     # Login, register, onboarding
│   ├── (dashboard)/                # Área logada
│   │   ├── dashboard/              # Home
│   │   ├── sessao/nova/            # Chat com Rafa
│   │   ├── modulos/                # Lista e detalhe de módulos
│   │   ├── diario/                 # Diário
│   │   └── check-in/               # Check-in mensal
│   ├── (admin)/admin/              # Área admin
│   └── api/                        # API routes
│       ├── auth/                   # Login, register, logout
│       ├── ai/                     # Chat, reflexão
│       ├── assessment/             # Assessment inicial
│       ├── check-in/               # Check-in mensal
│       ├── journal/                # CRUD diário
│       ├── progress/               # Progresso de lições
│       ├── stripe/                 # Checkout + webhook
│       └── admin/                  # Admin APIs
├── components/
│   ├── landing/                    # Seções da landing page
│   ├── layout/                     # Sidebar do dashboard
│   ├── admin/                      # Formulários admin
│   ├── modules/                    # Checkout e lição buttons
│   └── ui/                         # shadcn components
├── lib/
│   ├── ai/                         # System prompt + therapist API
│   ├── auth/                       # JWT helpers
│   ├── db/                         # Prisma client
│   └── generated/prisma/           # Gerado pelo prisma generate
└── prisma/
    ├── schema.prisma               # Modelo de dados
    └── seed.ts                     # Dados iniciais
```

---

## 9. Comandos úteis

```bash
npm run dev              # Dev server
npm run build            # Build produção
npm run db:generate      # Gerar Prisma client
npm run db:migrate       # Criar/aplicar migrations
npm run db:seed          # Popular dados iniciais
npm run db:studio        # Visualizar banco no browser
npx prisma migrate reset # ⚠️ Apaga e recria tudo (só dev)
```

---

## 10. Custos estimados (produção)

| Serviço | Plano | Custo/mês |
|---|---|---|
| Vercel | Hobby (pessoal) ou Pro | $0–20 |
| Neon / Supabase | Free tier | $0 (até certo volume) |
| Anthropic API | Pay-per-use | ~$5–50 (depende do uso) |
| Stripe | 2.9% + R$0.30 por transação | Variável |
| **Total estimado (MVP)** | | **$5–70/mês** |

---

## Suporte

Dúvidas ou problemas? Abra o arquivo `CLAUDE.md` na raiz do projeto para o contexto técnico completo ou inicie uma sessão no Claude Code.
