# Monetization Strategy

---

## Pricing Tiers

### Free Tier
- 50 invoices per month
- 1 WhatsApp number (single user)
- Basic stock tracking
- **Goal:** Get 100 shops on free tier within 3 months. Prove habit and retention.

### Pro Tier — KSh 500–800/month
- Unlimited invoices
- Multi-staff (up to 3 WhatsApp numbers per shop)
- Monthly P&L summary (PDF)
- Priority support
- **Target conversion:** 20–30% of active free users after 60 days

### Partner Revenue (Phase 2+)
- Agrovet owners with 6+ months of clean, KRA-compliant transaction data are attractive to lenders
- Referral fees from: Branch, Kamoa, Equity, KCB SME lending
- **AgroVet POS carries zero credit risk** — pure referral play
- Clean data is the moat: a shop using WhatsApp receipts has auditable, timestamped, KRA-verified transaction history

---

## Unit Economics (Illustrative)

| Metric | Value |
|--------|-------|
| Target towns (pilot) | 5 towns |
| Shops per town | 20–50 agrovets |
| Addressable (pilot) | ~150 shops |
| Free → Pro conversion | 25% |
| Pro ARPU | KSh 650/month |
| MRR at conversion | ~KSh 24,375 (~$190) |

Low bar for hackathon — focus is proving the habit, not the revenue.

---

## Cost Structure (Self-Hosted)

| Cost | Amount |
|------|--------|
| VPS (2 vCPU, 4GB RAM) | ~$20/month |
| Domain + SSL | ~$12/year |
| WhatsApp number SIM | KSh 50 + airtime |
| KRA eTIMS | Free (OSCU/VSCU) |
| All software | Open source (free) |

Break-even: ~3 Pro customers covers all infrastructure costs.

---

## Risks

| Risk | Mitigation |
|------|-----------|
| WhatsApp bans the number | Use dedicated number, warm-up period; OpenWA has anti-detection features |
| KRA changes eTIMS API | SDK-abstracted; update SDK layer only |
| Shops unwilling to pay | Free tier builds habit first; convert on value |
| Low eTIMS enforcement | Still useful as stock/ledger tool even if compliance angle weakens |
