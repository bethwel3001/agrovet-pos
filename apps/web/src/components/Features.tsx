import { Section } from './ui'

const FEATURES = [
  {
    title: 'KRA eTIMS invoicing',
    body: 'Every confirmed sale is filed through the eTIMS API and comes back with a control unit number and verification QR code.',
  },
  {
    title: 'Stock that keeps itself',
    body: 'Selling decrements. "stock in DAP fertilizer 50" adds. You never open a spreadsheet to find out what is on the shelf.',
  },
  {
    title: 'A ledger you can hand over',
    body: 'Timestamped, itemised, invoice-numbered. The record an auditor or a lender asks for already exists.',
  },
  {
    title: 'Receipts customers accept',
    body: 'A clean PNG with your shop name, the line items and the KRA QR code. Forward it in the same chat window.',
  },
  {
    title: 'Weekly summary',
    body: 'Text "report" and get total sales, your top three products and anything running low, in one message.',
  },
  {
    title: 'Plain-language commands',
    body: 'Products carry aliases, so "dap", "DAP fertilizer" and "diammonium phosphate" all resolve to the same item.',
  },
]

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="What it does"
      title="A point-of-sale, minus the point of sale."
      lede="No terminal, no printer, no paper roll. The features are the same; the surface is a chat thread."
    >
      <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="bg-paper p-7 md:p-9">
            <span aria-hidden className="block h-px w-8 bg-green" />
            <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{feature.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-8 text-sm">
        <span className="font-semibold text-blue">Coming next</span>
        <span className="text-muted">
          A browser back office for the owner who does want a screen — sales ledger, stock table,
          product catalogue and charts.
        </span>
      </div>
    </Section>
  )
}
