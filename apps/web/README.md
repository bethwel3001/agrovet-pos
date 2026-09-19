# Web (apps/web)

The public website for AgroVet POS. It explains what the product is and hands the
visitor off to WhatsApp — that button is the only conversion action on the page.

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS v4

---

## Run it

```bash
cd apps/web
pnpm install --ignore-workspace   # see "Why --ignore-workspace" below
pnpm dev                          # http://localhost:5173
```

```bash
pnpm build       # tsc -b && vite build  →  dist/
pnpm preview     # serve dist/ locally
pnpm typecheck
```

### Why `--ignore-workspace`

A plain `pnpm install` at the repo root currently fails: `apps/api` depends on
`kra-etims-js-sdk`, which is not published to npm (the PRD points at a GitHub repo).
Until that dependency is pinned to a resolvable source, install `apps/web` on its own.
It has its own lockfile and no workspace dependencies, so it also deploys standalone.

---

## Configuration

Copy `.env.example` to `.env.local`:

```env
VITE_WHATSAPP_NUMBER=254700000000
VITE_WHATSAPP_PREFILL=Hi, I run an agrovet and I want to try AgroVet POS.
```

`VITE_WHATSAPP_NUMBER` is the business number in international format with no `+`.
Every "Open WhatsApp" button builds a `https://wa.me/<number>?text=<prefill>` link from
these two values.

**Until a real number is set**, the buttons do not navigate. `site.ts` compares the env
value against the `254700000000` placeholder and exports `whatsappConfigured`; when that
is false, `WhatsAppButton` cancels the click and raises a toast — "WhatsApp is not
connected yet." That keeps visitors off a dead `wa.me` link while the bot is being wired
up. Set the real number and the buttons go live with no code change.

The toast itself lives in `src/toast.ts` (module-level pub/sub, no provider needed) and
`src/components/Toast.tsx` (one toast at a time, auto-dismisses after 4s). Raise one from
anywhere with `showToast('message')`.

---

## Design system

Defined once in `src/index.css` under `@theme`, then used through Tailwind utilities
(`bg-green`, `text-muted`, `border-line`, `font-display`).

| Token | Value | Used for |
|---|---|---|
| `paper` | `#ffffff` | Page background |
| `ink` | `#0b0b0b` | Body text, the dark "gap" section |
| `muted` | `#6a6a6a` | Secondary copy |
| `line` / `line-strong` | `#e7e7e7` / `#cfcfcf` | Hairline rules and grid gaps |
| `green` / `green-deep` / `green-soft` | `#12784f` / `#0d5c3c` / `#eff6f2` | Primary action, accents, closing band |
| `blue` / `blue-deep` / `blue-soft` | `#1f45c9` / `#16359e` / `#eef1fc` | Compliance band, links, "coming next" |

**Type:** Comfortaa (`font-display`) for headings and figures, Montserrat (`font-sans`)
for everything else. Both load from Google Fonts in `index.html`.

**Rules of the house**
- Four colours only: white, black, green, blue. No greys beyond the tokens above.
- No emojis anywhere in the UI. Icons are hand-rolled SVGs in `src/components/ui.tsx`.
- Sections are separated by a 1px `border-line` rule, not by shadows or cards.
- Grids get their dividers from `gap-px` over a `bg-line` parent, so every line is hairline.
- One container width: the `.shell` class. Everything lines up on the same left edge.

---

## Structure

```
src/
├── main.tsx              React root
├── App.tsx               Section order — the whole page is one scroll
├── index.css             Design tokens (@theme) + base styles
├── site.ts               WhatsApp URL + whatsappConfigured, nav items, contact
├── toast.ts              Tiny pub/sub behind showToast()
└── components/
    ├── ui.tsx            Button, WhatsAppButton, Section, SVG icons
    ├── Toast.tsx         Renders the active toast
    ├── Nav.tsx           Sticky header, borders in on scroll
    ├── Hero.tsx          Headline + primary CTA
    ├── Conversation.tsx  The sell → yes → receipt thread, revealed on scroll
    ├── Problem.tsx       Black section: the market gap, three figures
    ├── HowItWorks.tsx    Four numbered steps
    ├── Features.tsx      Six-cell capability grid
    ├── Compliance.tsx    Blue band: what makes the invoice legal
    ├── Pricing.tsx       Free / Pro / Partner
    ├── Faq.tsx           Native <details> accordion
    ├── Closer.tsx        Green band, final CTA
    └── Footer.tsx
```

To reorder or drop a section, edit `App.tsx` — sections are self-contained and read
their own copy from a const array at the top of the file.

---

## Not here yet

The back office dashboard (sales ledger, stock, products, reports) described in the PRD
as Module E. When it lands it should mount under `/app` behind auth, with this landing
page staying at `/`.
