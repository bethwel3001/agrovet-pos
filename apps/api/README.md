# Module B/C/D — Bot API Backend (apps/api)

**Owners:** Dev 2 (Bot/Parser), Dev 3 (KRA eTIMS), Dev 4 (Receipt)  
**Stack:** Node.js 20 + Fastify + TypeScript + BullMQ + Redis

---

## Responsibility

This is the core backend. It does three things:

1. **Receives WhatsApp messages** from OpenWA via webhook and routes them through the command parser
2. **Issues KRA eTIMS invoices** when a `sell` command is confirmed
3. **Generates receipt PNG images** and sends them back via OpenWA

It also exposes a REST API consumed by the React back office.

---

## Folder Structure

```
apps/api/src/
├── index.ts                ← Fastify server bootstrap, route registration

├── webhook/
│   └── openwa.webhook.ts   ← [MODULE B] POST /webhook/openwa handler

├── parser/
│   ├── command.parser.ts   ← [MODULE B] Parse raw WhatsApp text → intent
│   └── command.types.ts    ← [MODULE B] TypeScript types for all commands

├── session/
│   └── session.service.ts  ← [MODULE B] Redis-backed confirmation state (TTL 5min)

├── openwa/
│   └── openwa.client.ts    ← [MODULE B] REST client for OpenWA API (send text/image)

├── etims/
│   ├── etims.service.ts    ← [MODULE C] KRA eTIMS API calls via kra-etims-js-sdk
│   ├── etims.types.ts      ← [MODULE C] Request/response types
│   └── etims.queue.ts      ← [MODULE C] BullMQ worker for async invoice submission

├── receipt/
│   ├── receipt.generator.ts ← [MODULE D] node-canvas receipt PNG builder
│   └── receipt.types.ts    ← [MODULE D] Input types for receipt

└── routes/                 ← REST API (for back office)
    ├── auth.ts             ← POST /auth/login
    ├── sales.ts            ← GET /sales, GET /sales/:id
    ├── stock.ts            ← GET /stock, POST /stock/adjust
    ├── products.ts         ← GET/POST/PUT /products
    └── reports.ts          ← GET /reports/weekly
```

---

## Dev Setup

```bash
# Start infra first
docker compose -f docker-compose.dev.yml up -d

# From repo root
cp .env.example .env
pnpm install
pnpm db:migrate && pnpm db:seed

# Start API with hot reload
pnpm --filter @agrovet/api dev
# → http://localhost:3000
```

---

## Module B: WhatsApp Bot & Command Parser

### How OpenWA Webhook Works

OpenWA sends a `POST /webhook/openwa` on every incoming WhatsApp message:

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

The webhook handler:
1. Extracts `from` (phone) and `body` (message text)
2. Calls `parseCommand(body)` → structured intent
3. Looks up the shop by phone number
4. Routes to the correct handler (sell flow, stock in flow, report)

### Confirmation Flow (Redis Session)

```
User sends "sell ..."
  → Bot stores pending sale in Redis: session:{phoneNumber} with TTL=5min
  → Bot sends confirmation message

User sends "yes"
  → Bot reads pending sale from Redis
  → Calls eTIMS service → generates receipt → sends image
  → Clears Redis key

User sends anything else / TTL expires
  → Sale cancelled
```

### Command Format (exact patterns — no NLP)

```
sell <qty> [unit] <product name> <total_price>
stock in <product name> <qty>
report
help
```

---

## Module C: KRA eTIMS Integration

### SDK

Uses [`paybillke/kra-etims-js-sdk`](https://github.com/paybillke/kra-etims-js-sdk).

### Flow

```
SaleItem[] → buildEtimsPayload() → sdk.insertTrnsSalesOscu()
  → { resultCd: "000", data: { rcptNo, intrlData, rcptSign } }
  → Store invoiceNumber, controlCode, qrCodeData in DB
  → Trigger receipt generation
```

### Error Handling

- Non-`000` result code → mark `Sale.status = FAILED`, notify owner, do NOT decrement stock
- Network timeout → retry via BullMQ (max 3 attempts, exponential backoff)
- All attempts fail → FAILED + notify owner

### Environment Variables Needed

```env
KRA_BASE_URL=https://etims-api-sb.kra.go.ke   # sandbox
KRA_PIN=A000000000A
KRA_BRANCH_ID=00
KRA_TOKEN=your_bearer_token
```

---

## Module D: Receipt Image Generator

### Output

PNG image (~600×800px) sent as a WhatsApp image message via OpenWA.

### Input

```ts
{
  shopName: string
  kraPin: string
  invoiceNumber: string
  controlCode: string
  qrCodeData: string      // KRA rcptSign — encode this as QR
  items: Array<{ name: string; qty: number; unitPrice: number; subtotal: number }>
  subtotal: number
  vatAmount: number
  totalAmount: number
  createdAt: Date
}
```

### Libraries

- `canvas` (node-canvas, Cairo-based) — draws the image
- `qrcode` — generates QR PNG buffer, composited onto canvas
- Fonts: embed Roboto from `src/assets/fonts/` (download from Google Fonts)

### Visual Layout

See `PRD.md §11` for the full receipt wireframe.

---

## REST API Reference

All routes prefixed with `/` (nginx routes `/api/` → `/`).

```
POST  /auth/login              { email, password } → { token }

GET   /sales?from=&to=&page=&limit=
GET   /sales/:id

GET   /stock
POST  /stock/adjust            { productId, qty, type: "IN"|"OUT", note? }

GET   /products
POST  /products                { name, aliases, unit, defaultPrice, stockQty }
PUT   /products/:id

GET   /reports/weekly          { totalRevenue, invoiceCount, topProducts[], lowStock[] }

GET   /health
```
