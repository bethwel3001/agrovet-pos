# Module E — Web Back Office (apps/web)

**Owner:** Dev 5  
**Stack:** React 18 + Vite + Tailwind CSS + shadcn/ui

---

## Responsibility

The back office web dashboard for shop owners/staff. Accessed via browser (not WhatsApp). Lets admins:
- View live sales ledger
- Manage stock inventory
- Manage product catalogue (names, aliases, default prices)
- View weekly/monthly reports and charts

---

## Setup

```bash
# From repo root
pnpm install
pnpm --filter @agrovet/web dev
# → http://localhost:5173
```

API base URL defaults to `http://localhost:3000`. Configure in `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Folder Structure

```
apps/web/src/
├── main.tsx                ← React root
├── App.tsx                 ← Router setup (React Router v6)
│
├── pages/
│   ├── Login.tsx           ← JWT login form
│   ├── Dashboard.tsx       ← Today's stats (sales count, revenue, invoices)
│   ├── Sales.tsx           ← Paginated ledger, date filter, CSV export
│   ├── Stock.tsx           ← Inventory table, low-stock highlights, adjust modal
│   ├── Products.tsx        ← Add/edit product catalogue + alias management
│   └── Reports.tsx         ← Weekly/monthly bar + line charts (Recharts)
│
├── components/
│   ├── Layout.tsx          ← Sidebar nav + header wrapper
│   ├── StatsCard.tsx       ← Metric card (revenue, invoices count, etc.)
│   ├── SalesTable.tsx      ← Paginated table with TanStack Table
│   ├── StockTable.tsx      ← Stock with low-stock badge highlight
│   ├── ProductForm.tsx     ← Create/edit product modal
│   └── AdjustStockModal.tsx
│
├── api/
│   └── client.ts           ← Axios instance with JWT auth header
│
└── store/
    └── auth.store.ts       ← Zustand: token, user, login/logout
```

---

## Dependencies

```bash
# Core
react react-dom react-router-dom axios zustand

# UI
tailwindcss @tailwindcss/forms
shadcn/ui (via CLI: npx shadcn@latest init)

# Tables
@tanstack/react-table

# Charts
recharts

# Icons
lucide-react
```

Install via:
```bash
pnpm --filter @agrovet/web add react react-dom react-router-dom axios zustand recharts @tanstack/react-table lucide-react
```

---

## Pages Detail

### Dashboard
- Stats cards: Total Sales Today, Revenue Today, Invoices Issued, Low Stock Alerts
- Recent sales table (last 10)
- Auto-refreshes every 30s

### Sales Ledger (`/sales`)
- Date range filter
- Columns: Date, Invoice #, Items, Total, Status (INVOICED / FAILED)
- Click row → expand line items
- CSV export button

### Stock (`/stock`)
- All products, current qty, unit, low-stock threshold
- Red highlight when `stockQty <= lowStockAlert`
- "Adjust" button → modal to add/remove stock with note
- Sort by name or stock level

### Products (`/products`)
- Table of all products
- "Add Product" button → modal form (name, aliases CSV, unit, default price, low stock alert)
- Edit/deactivate existing products
- **Aliases are critical** — they power the WhatsApp parser. Example: `"dap, dap fertilizer, diammonium phosphate"`

### Reports (`/reports`)
- Weekly bar chart: daily revenue for last 7 days
- Top 5 products by qty sold (pie or horizontal bar)
- Low-stock alert list

---

## Auth Flow

1. `POST /auth/login` with email + password
2. Store JWT token in Zustand + localStorage
3. Axios interceptor adds `Authorization: Bearer <token>` to all requests
4. On 401 → clear store → redirect to `/login`

---

## Mocking During Dev

If the API isn't ready yet, use [MSW (Mock Service Worker)](https://mswjs.io/):
```bash
pnpm --filter @agrovet/web add -D msw
```
Create handlers in `src/mocks/handlers.ts` matching the API contract in `apps/api/README.md`.
