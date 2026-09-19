# Module A — Database (packages/db)

**Owner:** Dev 1  
**Stack:** PostgreSQL 16 + Prisma ORM

---

## Responsibility

This package owns the entire data layer:
- Prisma schema (source of truth for all models)
- Migrations
- Seed data for local development
- Exports a typed `PrismaClient` used by the API

---

## Schema Overview

```
Shop          ← agrovet business (1 per customer)
  └── User         ← back office login users
  └── Product      ← product catalogue with stock counts + aliases
  └── Sale         ← each invoice transaction
       └── SaleItem    ← line items within a sale
  └── StockLog     ← audit log of all stock movements (IN / OUT)
```

Full schema: `prisma/schema.prisma`

---

## Setup

```bash
# From repo root
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations (creates tables)
pnpm db:migrate

# Seed with demo data (shop, products, owner user)
pnpm db:seed
```

Demo credentials after seed:
- Email: `owner@kilimo.co.ke`
- Password: `password123`

---

## Key Design Decisions

- **`Product.aliases`** is a `String[]` — used by the command parser to match fuzzy product names like "dap" → "DAP Fertilizer"
- **`Sale.status`** tracks the full lifecycle: `PENDING → INVOICED` or `PENDING → FAILED/CANCELLED`
- **Stock is decremented only after** KRA invoice succeeds (`INVOICED`) — never on `PENDING`
- **`StockLog`** records every IN/OUT for audit purposes (regulators may ask for this)

---

## Adding a New Product (via seed or API)

```ts
await prisma.product.create({
  data: {
    shopId: 'shop-cuid',
    name: 'Round-Up Herbicide',
    aliases: ['roundup', 'round-up', 'glyphosate'],
    unit: 'litre',
    defaultPrice: 450,
    stockQty: 30,
    lowStockAlert: 5,
  }
})
```

---

## Files

```
packages/db/
├── prisma/
│   ├── schema.prisma    ← Edit models here
│   └── seed.ts          ← Demo data
└── src/
    └── index.ts         ← Re-exports PrismaClient + all types
```
