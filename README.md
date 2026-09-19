# AgroVet POS

> **Hackathon Track:** Everyday  
> **Pitch:** "We turn WhatsApp into a legally-compliant point-of-sale for Kenya's agrovets — sell, invoice KRA automatically, and track stock, all in a chat."

---

## What This Is

A WhatsApp bot that lets single-branch agrovet shops in Kenya issue KRA eTIMS-compliant invoices by texting a simple command, while automatically tracking stock and daily sales — no app download, no dashboard required.

```
Owner texts:  sell 2 bags DAP fertilizer 3200
Bot replies:  "Confirm: 2 × DAP Fertilizer @ KSh 1,600 each = KSh 3,200. Reply YES."
Owner texts:  yes
Bot:          → Calls KRA eTIMS API → sends back a receipt image with QR code
              → Decrements stock by 2 → logs sale to ledger
```

---

## Repository Structure

```
agrovet-pos/
├── README.md                        ← You are here
├── .gitignore                       ← (required at root by git)
├── package.json                     ← (required at root by pnpm workspaces)
├── pnpm-workspace.yaml              ← (required at root by pnpm)
├── tsconfig.base.json               ← (required at root by TypeScript)
│
├── docs-technical/
│   └── PRD.md                       ← Full PRD — feed this to the LLM
│
├── docs-business/
│   ├── pitch.md                     ← Hackathon pitch content
│   ├── monetization.md              ← Pricing tiers, unit economics
│   └── validation-interviews.md     ← Customer interview guide
│
├── apps/
│   ├── api/                         ← MODULE B/C/D: Bot backend
│   │   └── README.md
│   └── web/                         ← MODULE E: React dashboard
│       └── README.md
│
├── packages/
│   └── db/                          ← MODULE A: Prisma schema + seeds
│       └── README.md
│
└── infra/                           ← MODULE A: All infrastructure
    ├── docker-compose.yml           ← Production orchestration
    ├── docker-compose.dev.yml       ← Local dev (postgres+redis+openwa)
    ├── .env.example                 ← All environment variables
    ├── nginx/nginx.conf             ← Reverse proxy config
    └── README.md
```

---

## Tech Stack (100% Free & Open Source)

| Layer | Tool | Why |
|-------|------|-----|
| WhatsApp | [OpenWA](https://github.com/rmyndharis/OpenWA) | Self-hosted gateway, REST API + webhooks |
| Bot Backend | Node.js 20 + Fastify + TypeScript | Fast, typed, lightweight |
| Database | PostgreSQL 16 + Prisma ORM | Transactional, typed schema, migrations |
| Cache / Queues | Redis + BullMQ | Confirmation state + async invoice jobs |
| KRA eTIMS | [kra-etims-js-sdk](https://github.com/paybillke/kra-etims-js-sdk) | Community Node.js SDK for OSCU/VSCU |
| Receipt Images | node-canvas + qrcode | Generate PNG receipts with embedded QR |
| Back Office | React 18 + Vite + Tailwind + shadcn/ui | Modern, zero-cost dashboard |
| Infrastructure | Docker + Docker Compose + Nginx | Single-command local + production deploy |

---

## Work Modules (Team Division)

| Module | Who Owns It | What They Build |
|--------|------------|-----------------|
| **A — Infra & DB** | Dev 1 | Docker Compose, Prisma schema, seed data, Nginx |
| **B — WhatsApp Bot** | Dev 2 | Webhook handler, command parser, session state, OpenWA client |
| **C — KRA eTIMS** | Dev 3 | eTIMS API integration, invoice builder, async queue |
| **D — Receipt Generator** | Dev 4 | node-canvas receipt PNG, QR code embed |
| **E — Web Back Office** | Dev 5 | React dashboard, sales ledger, stock UI, charts |

> See `PRD.md` §12 for detailed deliverables, file paths, and dependencies per module.

---

## Project Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | v20+ | https://nodejs.org |
| **pnpm** | v9+ | `npm install -g pnpm` |
| **Docker Desktop** | Latest | https://docker.com |
| **Git** | Latest | https://git-scm.com |

### One-Command Setup

Clone the repo and run the setup script — it handles everything:

```bash
git clone <repo-url> && cd agrovet-pos
bash infra/scripts/setup.sh
```

**The script will:**
1. Verify all prerequisites are installed and correct versions
2. Copy `infra/.env.example` → `.env` (if not already present)
3. Install all Node.js dependencies via pnpm
4. Start Docker services: PostgreSQL, Redis, OpenWA
5. Wait for PostgreSQL to be healthy
6. Run Prisma database migrations (create all tables)
7. Seed demo data (sample shop, products, owner user)

When complete you'll see:
```
  Services running:
    PostgreSQL   → localhost:5432
    Redis        → localhost:6379
    OpenWA       → http://localhost:2785

  Demo login:
    Email:    owner@kilimo.co.ke
    Password: password123
```

### After Setup — Start Your Module

**API developers (Module B/C/D):**
```bash
pnpm --filter @agrovet/api dev
# → http://localhost:3000
```

**Web developers (Module E):**
```bash
pnpm --filter @agrovet/web dev
# → http://localhost:5173
```

**Database developers (Module A):**
```bash
# Edit schema
code packages/db/prisma/schema.prisma

# Run migrations after changes
pnpm db:migrate

# Re-seed
pnpm db:seed

# Open Prisma Studio (visual DB browser)
pnpm --filter @agrovet/db db:studio
```

### Configure OpenWA (WhatsApp Bot)

After running setup, connect the WhatsApp number:

1. Open **http://localhost:2785** (OpenWA dashboard)
2. Create an **API key** → paste into `.env` as `OPENWA_API_KEY`
3. Create a session named **`agrovet-bot`** → scan QR code with your WhatsApp
4. Set webhook URL:
   - **Docker → host:** `http://host.docker.internal:3000/webhook/openwa`
   - **All in Docker:** `http://api:3000/webhook/openwa`
5. Test: send a WhatsApp message to the connected number — you should see it in the API logs

> Use a **dedicated phone number** for the bot (not your personal number).

### Manual Setup (Step-by-Step)

If you prefer to run each step manually instead of the script:

```bash
# 1. Clone
git clone <repo-url> && cd agrovet-pos

# 2. Environment
cp infra/.env.example .env

# 3. Dependencies
pnpm install

# 4. Start infra
docker compose -f infra/docker-compose.dev.yml up -d

# 5. Wait for postgres (check with)
docker exec agrovet-postgres-dev pg_isready -U postgres

# 6. Migrations
pnpm db:generate
pnpm db:migrate

# 7. Seed
pnpm db:seed

# 8. Start API
pnpm --filter @agrovet/api dev

# 9. Start web (in another terminal)
pnpm --filter @agrovet/web dev
```

### Tearing Down

```bash
# Stop all Docker services
docker compose -f infra/docker-compose.dev.yml down

# Stop and wipe all data (fresh start)
docker compose -f infra/docker-compose.dev.yml down -v
```

---

## KRA eTIMS Sandbox Setup

1. Go to [KRA eTIMS Sandbox](https://etims-sb.kra.go.ke)
2. Register with a test KRA PIN (`A000000000A` for dev)
3. Get your bearer token → paste into `.env` as `KRA_TOKEN`
4. SDK docs: https://github.com/paybillke/kra-etims-js-sdk

---

## API Endpoints (Backend)

```
POST  /webhook/openwa          ← OpenWA posts all incoming WhatsApp messages here

POST  /auth/login              ← { email, password } → { token }

GET   /sales                   ← Paginated sales ledger
GET   /sales/:id               ← Single sale with items

GET   /stock                   ← All products with current stock
POST  /stock/adjust            ← Manual stock adjustment

GET   /products                ← Product catalogue
POST  /products                ← Create product
PUT   /products/:id            ← Update product

GET   /reports/weekly          ← Weekly summary JSON

GET   /health                  ← { status: "ok" }
```

---

## WhatsApp Commands

| Command | Example | What it does |
|---------|---------|-------------|
| `sell <qty> [unit] <product> <total>` | `sell 2 bags DAP fertilizer 3200` | Creates sale, issues KRA invoice |
| `stock in <product> <qty>` | `stock in DAP fertilizer 50` | Restocks inventory |
| `report` | `report` | Weekly WhatsApp summary |
| `help` | `help` | Lists commands |

---

## Demo Script (5 Minutes)

See `PRD.md` §15 for the full timed demo script.

---

## Contributing

Each module has its own `README.md` with setup instructions, file structure, and implementation guide. Start there.

1. Pick your module
2. Create a branch: `git checkout -b feat/module-[a|b|c|d|e]-your-name`
3. Open a PR against `main` when ready for review
