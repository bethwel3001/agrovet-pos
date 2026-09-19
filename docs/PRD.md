# AgroVet POS — Product Requirements Document
**Hackathon Track:** Everyday  
**Pitch:** "We turn WhatsApp into a legally-compliant point-of-sale for Kenya's agrovets — sell, invoice KRA automatically, and track stock, all in a chat."  
**Date:** 2026-09-19

---

## 1. Problem Statement

Single-branch agrovet shops in small/mid-size Kenyan towns are legally required to issue KRA eTIMS-compliant invoices but have no practical tool to do so. They have 1–3 staff, use receipt books or WhatsApp for records, and will not download an app or learn a dashboard. WhatsApp is already on their phone. This solution turns that existing habit into a fully compliant point-of-sale.

**Recurring job (Everyday track):** Every sale made at an agrovet shop — multiple times a day, every day. Owner would use this Monday morning when the first customer walks in.

---

## 2. Target User

| Attribute | Value |
|-----------|-------|
| Business type | Single-branch agrovet shop |
| Location | Small/mid-size Kenyan towns (not Nairobi CBD) |
| Staff count | 1–3 |
| Current invoicing | Receipt book, WhatsApp forward, or nothing |
| Tech comfort | Comfortable with WhatsApp; averse to new apps |
| Legal status | Required to comply with KRA eTIMS |

---

## 3. Core User Flow (Phase 1 — Build This First)

```
Owner sends:  sell 2 bags DAP fertilizer 3200
     ↓
Bot replies:  "Confirm: 2 × DAP Fertilizer @ KSh 1,600 each = KSh 3,200. Reply YES to issue invoice."
     ↓
Owner sends:  yes
     ↓
Bot calls KRA eTIMS API → gets control unit invoice number + QR code
     ↓
Bot generates receipt image (invoice number, items, total, QR code)
     ↓
Bot sends receipt image back to owner's WhatsApp
     ↓
Stock for "DAP Fertilizer" decrements by 2
Sale logged to ledger (timestamp, item, qty, price, invoice no.)
```

---

## 4. Secondary Commands (Phase 2)

```
stock in DAP fertilizer 50    → Restock: adds 50 units to inventory
report                        → Weekly summary: total sales, top 3 products, low-stock alerts
help                          → Lists available commands
```

---

## 5. Out of Scope (v1)

- Native mobile app
- Multi-branch support
- Hardware (printers, scanners, receipt paper)
- Double-entry accounting
- Free-text NLP (only structured commands: sell, stock in, report, help)
- Credit scoring or lending engine
- Bulk customer management
- Multi-currency

---

## 6. Full Technology Stack (Free & Open Source Only)

### 6.1 WhatsApp Gateway — OpenWA
**Repo:** https://github.com/rmyndharis/OpenWA  
**Why:** Self-hosted, zero vendor cost, REST API + webhook architecture, Docker-ready, React dashboard included.  
**Engine:** `whatsapp-web.js` (lower ban risk over Baileys)  
**How it fits:** OpenWA runs as a Docker container. Our bot backend registers a webhook URL with OpenWA. Every incoming WhatsApp message triggers a POST to our webhook. Our backend replies by calling OpenWA's REST API to send messages/images back.

> ⚠️ **Risk:** Unofficial WhatsApp automation. Use a dedicated business number (not personal). Warm up the number before demo. Keep message frequency reasonable.

### 6.2 Bot Backend
| Concern | Tool | License |
|---------|------|---------|
| Runtime | Node.js 20 LTS | MIT |
| Framework | Fastify | MIT |
| Language | TypeScript | Apache 2.0 |
| ORM | Prisma | Apache 2.0 |
| Job Queue | BullMQ + Redis | MIT |
| Validation | Zod | MIT |
| HTTP client | Got | MIT |

### 6.3 KRA eTIMS Integration
**Primary SDK:** [`paybillke/kra-etims-js-sdk`](https://github.com/paybillke/kra-etims-js-sdk)  
**Backup SDK:** [`ToshGitonga0/kra-etims`](https://github.com/ToshGitonga0/kra-etims) (TypeScript, VSCU-capable)  
**Mode for v1:** OSCU (Online — KRA-hosted, simpler for small shops)  
**Sandbox:** Sign up at KRA eTIMS sandbox portal with test KRA PIN — free access.

### 6.4 Receipt Image Generation
| Concern | Tool |
|---------|------|
| Image canvas | `node-canvas` (Cairo-backed) |
| QR code rendering | `qrcode` npm package |
| PDF alternative | `pdfkit` (fallback if image fails) |
| Fonts | Open-source (e.g., Roboto via Google Fonts, embedded) |

Receipt format: PNG image (WhatsApp renders inline) — business name, date/time, invoice no., line items, total, KRA QR code, legal disclaimer.

### 6.5 Database
**Engine:** PostgreSQL 16  
**ORM:** Prisma (migrations, type safety)  
**Why Postgres:** Transactional integrity for stock decrements + invoice logging; scales to multi-tenant later.

### 6.6 Web Back Office
| Concern | Tool |
|---------|------|
| Framework | React 18 + Vite |
| UI components | shadcn/ui (open source, Tailwind-based) |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Auth | JWT (stored httpOnly cookie) |
| Table/grid | TanStack Table |

**Back office features:**
- Login (shop owner / admin)
- Live sales ledger (paginated)
- Stock inventory view + manual adjust
- Invoice history with filter by date
- Weekly/monthly reports (charts)
- Product catalogue management (add/edit items + default prices)

### 6.7 Infrastructure & DevOps
| Concern | Tool |
|---------|------|
| Containerisation | Docker + Docker Compose |
| Reverse proxy | Nginx (routes /api → backend, / → front office) |
| Process manager | PM2 inside containers (optional) |
| Secrets | `.env` files (`.gitignore`d) |
| Local dev | `docker compose up` — single command |

---

## 7. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                           │
│                                                                 │
│  ┌──────────────┐    webhook POST    ┌───────────────────────┐  │
│  │              │ ──────────────────▶│                       │  │
│  │  OpenWA      │                   │   Bot Backend         │  │
│  │  Gateway     │ ◀──────────────── │   (Fastify/Node.js)   │  │
│  │  :2785       │   REST send msg   │   :3000               │  │
│  └──────────────┘                   └────────┬──────────────┘  │
│         ▲                                    │                  │
│         │ WhatsApp                           │                  │
│    (owner's phone)                  ┌────────▼──────────────┐  │
│                                     │  PostgreSQL :5432     │  │
│                                     │  + Prisma ORM         │  │
│                                     └───────────────────────┘  │
│                                            │                    │
│                                     ┌──────▼────────────────┐  │
│                                     │  Redis :6379          │  │
│                                     │  (BullMQ queues)      │  │
│                                     └───────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  KRA eTIMS OSCU API (external, sandbox/prod)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Nginx :80/:443                                          │  │
│  │  /api  → Bot Backend                                     │  │
│  │  /     → React Back Office (static)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Database Schema (Prisma)

```prisma
model Shop {
  id          String   @id @default(cuid())
  name        String
  kraPin      String   @unique
  phoneNumber String   @unique   // WhatsApp number in international format
  createdAt   DateTime @default(now())
  products    Product[]
  sales       Sale[]
  stockLogs   StockLog[]
}

model Product {
  id           String   @id @default(cuid())
  shopId       String
  name         String
  aliases      String[] // e.g. ["dap", "dap fertilizer", "diammonium phosphate"]
  unit         String   // "bag", "litre", "kg", "piece"
  defaultPrice Decimal
  stockQty     Int      @default(0)
  lowStockAlert Int     @default(5)
  shop         Shop     @relation(fields: [shopId], references: [id])
  saleItems    SaleItem[]
  stockLogs    StockLog[]
}

model Sale {
  id            String     @id @default(cuid())
  shopId        String
  invoiceNumber String     @unique  // from KRA eTIMS
  controlCode   String              // KRA control unit code
  qrCodeData    String              // QR payload string
  totalAmount   Decimal
  status        SaleStatus @default(PENDING)
  createdAt     DateTime   @default(now())
  shop          Shop       @relation(fields: [shopId], references: [id])
  items         SaleItem[]
}

model SaleItem {
  id        String  @id @default(cuid())
  saleId    String
  productId String
  qty       Int
  unitPrice Decimal
  subtotal  Decimal
  sale      Sale    @relation(fields: [saleId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model StockLog {
  id        String        @id @default(cuid())
  shopId    String
  productId String
  type      StockLogType  // IN | OUT
  qty       Int
  note      String?
  createdAt DateTime      @default(now())
  shop      Shop          @relation(fields: [shopId], references: [id])
  product   Product       @relation(fields: [productId], references: [id])
}

enum SaleStatus { PENDING INVOICED FAILED }
enum StockLogType { IN OUT }
```

---

## 9. Command Parser Specification

The parser is a **structured command parser** — no NLP, no fuzzy matching (v1). All commands are lowercase-normalised before parsing.

### 9.1 Command: `sell`
**Pattern:** `sell <qty> <unit?> <product_name> <price>`  
**Examples:**
```
sell 2 bags DAP fertilizer 3200
sell 1 litre round-up 450
sell 5 fencing staples 150
```
**Parse steps:**
1. Strip `sell ` prefix
2. Extract leading integer → `qty`
3. Check if next token is a known unit (bag, bags, litre, litres, kg, piece, pieces, pcs) → `unit` (optional)
4. Remaining tokens except last → `product_name_raw`
5. Last token (numeric) → `total_price` (interpreted as total, not unit price); derive `unit_price = total_price / qty`
6. Fuzzy-match `product_name_raw` against `Product.aliases` in DB (case-insensitive, `%LIKE%`)
7. If no match → reply "Product not found. Try: sell 2 bags [exact product name] 3200. Or reply ADD to add a new product."

### 9.2 Command: `stock in`
**Pattern:** `stock in <product_name> <qty>`  
**Example:** `stock in DAP fertilizer 50`

### 9.3 Command: `report`
**Pattern:** `report`  
Generates weekly summary: total revenue, count of invoices, top 3 products by qty sold, low-stock alerts.

### 9.4 Command: `help`
Returns formatted list of commands.

### 9.5 Confirmation flow
After `sell` parses successfully, bot sends confirmation. System holds state in Redis keyed by phone number (`session:{phoneNumber}`) with TTL of 5 minutes. If owner replies `yes` or `y` within TTL → proceed to invoice. Any other reply → cancel and prompt to re-send.

---

## 10. KRA eTIMS Integration Flow

```
1. Collect: shop KRA PIN, invoice items array, totals, VAT (16%)
2. Call: kra-etims-js-sdk → POST /insertTrnsSalesOscu
   Payload: { tin, bhfId, salesDate, custTin, itemList: [...], taxblAmt, taxAmt, totAmt }
3. Response: { resultCd: "000", resultMsg: "Successful", data: { rcptNo, intrlData, rcptSign } }
4. Store: invoiceNumber = rcptNo, controlCode = intrlData, qrData = rcptSign
5. Generate QR code image from qrData using `qrcode` package
6. Compose receipt image using node-canvas
7. Send image via OpenWA REST API
```

**Error handling:** If KRA API returns non-000 code → mark sale as FAILED, notify owner via WhatsApp, do NOT decrement stock.

---

## 11. Receipt Image Specification

```
┌─────────────────────────────────┐
│  [Shop Name]                    │
│  KRA PIN: A123456789X           │
│  eTIMS Invoice                  │
├─────────────────────────────────┤
│  Date: 19 Sep 2026  10:34 AM   │
│  Invoice #: INV-2026-00042     │
├─────────────────────────────────┤
│  ITEM          QTY  PRICE       │
│  DAP Fertilizer  2  KSh 1,600  │
│  ─────────────────────────────  │
│  Subtotal:         KSh 3,200   │
│  VAT (16%):        KSh  512   │
│  TOTAL:            KSh 3,712   │
├─────────────────────────────────┤
│  [QR CODE IMAGE — 120×120px]   │
│  Scan to verify invoice        │
├─────────────────────────────────┤
│  Powered by AgroVet POS        │
└─────────────────────────────────┘
```

Output: PNG, ~600×800px, sent as WhatsApp image message.

---

## 12. Work Division — Technical Modules

The project is split into 5 independent modules that can be built in parallel after the database schema and Docker Compose baseline are agreed on.

---

### Module A — Infrastructure & Database
**Owner:** 1 developer  
**Deliverables:**
- `docker-compose.yml` with services: `openwa`, `backend`, `postgres`, `redis`, `nginx`
- `.env.example` with all required vars
- Prisma schema (Section 8) + seed script (3 sample products)
- Nginx config routing `/api` → backend, `/` → React build
- `README-setup.md` with `docker compose up` instructions

**Dependencies:** None (start first)

**Key files:**
```
/infra/
  docker-compose.yml
  docker-compose.dev.yml
  nginx/nginx.conf
/prisma/
  schema.prisma
  seed.ts
.env.example
```

---

### Module B — WhatsApp Bot & Command Parser
**Owner:** 1 developer  
**Deliverables:**
- Fastify webhook endpoint `POST /webhook/openwa` — receives OpenWA events
- Command parser (Section 9): `sell`, `stock in`, `report`, `help`
- Session state manager using Redis (confirmation flow, TTL)
- OpenWA API client wrapper (send text, send image)
- Unit tests for parser edge cases

**Dependencies:** Module A (database + OpenWA running)

**Key files:**
```
/src/
  webhook/
    openwa.webhook.ts     ← Fastify route
  parser/
    command.parser.ts     ← parse raw text → structured intent
    command.types.ts
  session/
    session.service.ts    ← Redis TTL state
  openwa/
    openwa.client.ts      ← REST wrapper around OpenWA API
```

**Sample OpenWA webhook payload (incoming message):**
```json
{
  "event": "message",
  "session": "agrovet-bot",
  "payload": {
    "from": "254712345678@c.us",
    "body": "sell 2 bags DAP fertilizer 3200",
    "type": "chat"
  }
}
```

---

### Module C — KRA eTIMS Integration & Invoice Service
**Owner:** 1 developer  
**Deliverables:**
- KRA eTIMS service using `paybillke/kra-etims-js-sdk`
- Sandbox credentials setup + documented
- Invoice request builder (maps SaleItem[] → eTIMS payload)
- VAT calculator (16% standard rate for agri-inputs; confirm exemptions)
- Error handling + retry logic (BullMQ job for async invoice submission)
- Integration test against KRA sandbox

**Dependencies:** Module A (database)

**Key files:**
```
/src/
  etims/
    etims.service.ts      ← wraps SDK, builds payload, handles response
    etims.types.ts
    etims.queue.ts        ← BullMQ worker for async invoice jobs
```

**Environment variables needed:**
```env
KRA_BASE_URL=https://etims-api-sb.kra.go.ke   # sandbox
KRA_PIN=A123456789X
KRA_BRANCH_ID=00
KRA_TOKEN=...                                  # from eTIMS registration
```

---

### Module D — Receipt Image Generator
**Owner:** 1 developer  
**Deliverables:**
- Receipt generator using `node-canvas`
- QR code renderer using `qrcode` → embedded in canvas
- Accepts: `{ shopName, kraPin, invoiceNo, controlCode, items, totals, qrData }`
- Outputs: PNG `Buffer` ready to upload + send via OpenWA
- Font loading (embed open-source font)
- Visual test script: renders sample receipt to `receipt-test.png`

**Dependencies:** Module C (for QR data structure)

**Key files:**
```
/src/
  receipt/
    receipt.generator.ts  ← canvas drawing logic
    receipt.types.ts
  assets/
    fonts/Roboto-Regular.ttf
    fonts/Roboto-Bold.ttf
```

---

### Module E — Web Back Office (React Dashboard)
**Owner:** 1 developer  
**Deliverables:**
- Vite + React + Tailwind + shadcn/ui project
- JWT login screen (shop owner)
- Pages:
  - `/dashboard` — today's stats (sales count, revenue, invoices issued)
  - `/sales` — paginated ledger with date filter + CSV export
  - `/stock` — inventory table, low-stock highlights, manual adjust modal
  - `/products` — add/edit products (name, aliases, unit, default price)
  - `/reports` — weekly/monthly charts (Recharts)
- API client (Axios) hitting `/api/*` on the Fastify backend
- Responsive (works on 768px tablet — shop owner might open on phone browser)

**Dependencies:** Module A + Module B/C (APIs must exist, can mock with MSW during dev)

**Key files:**
```
/web/
  src/
    pages/
      Dashboard.tsx
      Sales.tsx
      Stock.tsx
      Products.tsx
      Reports.tsx
    components/
      Layout.tsx
      StatsCard.tsx
      SalesTable.tsx
      StockTable.tsx
    api/
      client.ts
    store/
      auth.store.ts       ← Zustand
```

---

## 13. API Contracts (Backend → Frontend)

```
GET    /api/sales?from=&to=&page=&limit=      → paginated sales
GET    /api/sales/:id                          → single sale + items
GET    /api/stock                              → all products with stock
POST   /api/stock/adjust                       → manual stock adjustment
GET    /api/products                           → product catalogue
POST   /api/products                           → create product
PUT    /api/products/:id                       → update product
GET    /api/reports/weekly                     → weekly summary JSON
POST   /api/auth/login                         → { token }
GET    /api/health                             → { status: "ok" }
```

Webhook (OpenWA → Backend):
```
POST   /webhook/openwa                         → handles all incoming WA events
```

---

## 14. Environment Variables Reference

```env
# App
NODE_ENV=development
PORT=3000
JWT_SECRET=change_me_in_prod

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/agrovet

# Redis
REDIS_URL=redis://redis:6379

# OpenWA
OPENWA_BASE_URL=http://openwa:2785
OPENWA_API_KEY=your_openwa_api_key
OPENWA_SESSION_NAME=agrovet-bot

# KRA eTIMS
KRA_BASE_URL=https://etims-api-sb.kra.go.ke
KRA_PIN=A123456789X
KRA_BRANCH_ID=00
KRA_TOKEN=your_etims_token
```

---

## 15. Demo Script (5 Minutes — Everyday Track)

```
0:00 — "Track: Everyday. This is AgroVet POS — a WhatsApp point-of-sale 
        for Kenyan agrovet shops that auto-issues KRA eTIMS invoices."

0:30 — [Show WhatsApp on phone]
        Send: "sell 2 bags DAP fertilizer 3200"
        Bot replies with confirmation message

1:00 — Send: "yes"
        Bot hits KRA sandbox → receipt image arrives with QR code
        "This is a legally-compliant eTIMS invoice. Owner forwards it to customer."

1:45 — [Switch to web back office on laptop]
        Show the sale just logged in the ledger. Stock has dropped by 2.

2:30 — Send: "stock in DAP fertilizer 50"
        Show stock updated live in dashboard.

3:00 — Send: "report"
        Bot sends weekly summary text.

3:30 — [Back to dashboard]
        Show charts, low-stock alerts, product catalogue.

4:00 — "The recurring job: every single sale, every day. 
        The shop owner already knows how to do this — it's just WhatsApp. 
        KRA compliance is invisible to them."

4:30 — Q&A buffer
```

---

## 16. Monetization (Post-Hackathon Reference)

| Tier | Price | Limits |
|------|-------|--------|
| Free | KSh 0 | 50 invoices/month |
| Paid | KSh 500–800/month | Unlimited + multi-staff + monthly P&L PDF |
| Partner | Revenue share | Referral to Branch, Kamoa, etc. using clean transaction data |

---

## 17. Open Questions for Validation (Before Full Build)

1. Do agrovet owners know eTIMS applies to their shop specifically?
2. How are they currently handling it (ignoring it, receipt book, accountant)?
3. Would they trust a WhatsApp bot with sales data?
4. Do they have a dedicated WhatsApp number for business or use personal?
5. What product names/aliases are most common? (feeds the alias dictionary)
6. Is VAT charged on fertilizer? (some agri-inputs are VAT-exempt in Kenya — needs legal verification)

---

## 18. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| WhatsApp bans the demo number | Medium | Use dedicated number, warm it up 48hrs before demo; have Baileys as engine fallback |
| KRA sandbox downtime | Low | Cache a sample eTIMS response for offline demo fallback |
| node-canvas native build fails | Low | Pre-build Docker image; have pdfkit as fallback |
| Command parser misparses product names | Medium | Seed aliases generously; add unrecognised-product flow |
| VAT exemption for agri-inputs | Unknown | Default to 16%, add flag per product; verify before production |

---

*End of PRD. Feed this document to the LLM along with the module you are building to get targeted, scoped code output.*
