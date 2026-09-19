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
├── README.md                     ← You are here
├── .gitignore
├── .env.example                  ← All required environment variables
├── docker-compose.yml            ← Production orchestration
├── docker-compose.dev.yml        ← Local dev (postgres + redis + openwa only)
├── package.json                  ← pnpm workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
│
├── docs-technical/
│   └── PRD.md                    ← Full Product Requirements Document (read this first)
│
├── docs-business/
│   ├── pitch.md                  ← Hackathon pitch deck content
│   ├── monetization.md           ← Pricing tiers, unit economics, risks
│   └── validation-interviews.md  ← Pre-build customer interview guide
│
├── apps/
│   ├── api/                      ← MODULE B/C/D: Bot backend (Fastify + Node.js)
│   │   └── README.md             ← Setup + implementation guide
│   └── web/                      ← MODULE E: React back office dashboard
│       └── README.md             ← Setup + implementation guide
│
├── packages/
│   └── db/                       ← MODULE A: Database schema (Prisma + PostgreSQL)
│       ├── prisma/schema.prisma  ← Source of truth for all data models
│       └── README.md
│
└── infra/                        ← MODULE A: Infrastructure (Nginx, Docker)
    ├── nginx/nginx.conf
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

## Quick Start (Local Dev)

### Prerequisites
- Docker Desktop
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 1. Clone & configure
```bash
git clone <repo-url> && cd agrovet-pos
cp .env.example .env
# Edit .env with your KRA sandbox credentials and JWT secret
```

### 2. Start infrastructure
```bash
docker compose -f docker-compose.dev.yml up -d
# Starts: PostgreSQL, Redis, OpenWA
```

### 3. Set up database
```bash
pnpm install
pnpm db:migrate
pnpm db:seed
```

### 4. Start API (hot reload)
```bash
pnpm --filter @agrovet/api dev
```

### 5. Start web dashboard
```bash
pnpm --filter @agrovet/web dev
```

### 6. Configure OpenWA webhook
1. Open http://localhost:2785 (OpenWA dashboard)
2. Create an API key → paste into `.env` as `OPENWA_API_KEY`
3. Create a session named `agrovet-bot` → scan QR on WhatsApp
4. Set webhook URL to `http://host.docker.internal:3000/webhook/openwa`

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
