# AgroVet POS — Business Pitch

**Hackathon Track:** Everyday  
**Date:** 2026-09-19

---

## The One-Line Pitch

> "We turn WhatsApp into a legally-compliant point-of-sale for Kenya's agrovets — sell, invoice KRA automatically, and track stock, all in a chat."

---

## The Problem

Kenya's ~30,000 agrovet shops are legally required to issue KRA eTIMS-compliant invoices.  
Most are using receipt books, WhatsApp, or nothing.  
They will not download a new app. They will not learn a dashboard.  
**But they are already on WhatsApp, all day.**

---

## The Solution

A WhatsApp bot. Owner texts a sale in plain language. Bot issues the KRA invoice automatically and sends back a receipt image to forward to the customer.

```
Owner: sell 2 bags DAP fertilizer 3200
Bot:   ✅ Confirm: 2 × DAP Fertilizer @ KSh 1,600 = KSh 3,200. Reply YES.
Owner: yes
Bot:   [receipt image with KRA QR code]
```

Stock auto-updates. Sale is logged. Done.

---

## Target Customer (v1)

- Single-branch agrovet, small/mid-size Kenyan town
- 1–3 staff
- Currently non-compliant with eTIMS (or struggling to comply)
- Already uses WhatsApp for business communication

---

## Why Everyday Track

The recurring job: **every sale, every day**.  
The user: the shop owner who opens at 7am and makes 20–50 sales before closing.  
Monday answer: **yes** — they would use this from the moment they open.

---

## Monetization

| Tier | Price | What You Get |
|------|-------|-------------|
| Free | KSh 0 | 50 invoices/month |
| Pro | KSh 500–800/month | Unlimited invoices, multi-staff, monthly P&L |
| Partner (later) | Revenue share | Referral to lending partners (Branch, Kamoa) using clean transaction data |

---

## Why Now

KRA is actively enforcing eTIMS compliance.  
Shops that ignore it face penalties.  
There is no accessible, affordable, no-app-required tool for this segment.

---

## Validation Questions (Pre-Build)

1. Do agrovet owners know eTIMS applies to them?
2. How are they currently handling invoicing?
3. Would they trust a WhatsApp bot with sales data?
4. What WhatsApp number do they use for business?

---

## Demo Flow (5 Minutes)

1. Send `sell 2 bags DAP fertilizer 3200` from phone
2. Confirm with `yes`
3. Receipt image arrives with KRA QR code
4. Switch to web dashboard — show sale logged, stock updated
5. Send `stock in DAP fertilizer 50` — stock updates live
6. Send `report` — weekly summary arrives

---

## The Ask

- Feedback on the compliance angle: is eTIMS enforcement real enough urgency for owners?
- Connections to agrovet owners for the 10-interview validation sprint
- Hosting/infra support to run the pilot for 3 real shops
