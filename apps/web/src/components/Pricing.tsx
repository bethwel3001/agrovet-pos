import { site } from '../site'
import { Section, WhatsAppButton } from './ui'

const TIERS = [
  {
    name: 'Free',
    price: 'KSh 0',
    cadence: 'forever',
    summary: 'Enough to run a small counter and prove the habit.',
    items: ['50 invoices per month', 'One WhatsApp number', 'Stock tracking', 'Weekly report'],
    featured: false,
  },
  {
    name: 'Pro',
    price: 'KSh 650',
    cadence: 'per month',
    summary: 'For shops selling all day, with more than one person at the counter.',
    items: [
      'Unlimited invoices',
      'Up to 3 staff numbers',
      'Monthly P&L summary',
      'Browser back office',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Partner',
    price: 'Revenue share',
    cadence: 'phase two',
    summary: 'Six months of clean, KRA-verified history opens doors with lenders.',
    items: ['Everything in Pro', 'Lender referrals', 'Exportable transaction history'],
    featured: false,
  },
]

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-1.5 size-3 shrink-0">
      <path d="M3 8.5 6.25 12 13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Start free. Pay when it is making you money."
      lede="Self-hosted and open source underneath, so the price reflects support rather than licences."
    >
      <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`flex flex-col p-8 md:p-10 ${tier.featured ? 'bg-green-soft' : 'bg-paper'}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-lg font-semibold tracking-tight">{tier.name}</h3>
              {tier.featured && (
                <span className="rounded-full bg-green px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-paper uppercase">
                  Most shops
                </span>
              )}
            </div>

            {/* Fixed height so the summaries below line up even when a price wraps. */}
            <div className="mt-7 flex h-24 flex-col justify-end">
              <p className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
                {tier.price}
              </p>
              <p className="mt-1 text-sm text-muted">{tier.cadence}</p>
            </div>

            <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-muted">
              {tier.summary}
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {tier.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-green">
                    <Tick />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <WhatsAppButton href={site.whatsappUrl} label="Start on the free tier" className="px-7 py-3.5" />
        <p className="text-sm text-muted">No card. The first message sets up your shop.</p>
      </div>
    </Section>
  )
}
