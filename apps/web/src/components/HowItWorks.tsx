import { Section } from './ui'

const STEPS = [
  {
    n: '01',
    title: 'Text the sale',
    body: 'Send "sell 2 bags DAP fertilizer 3200" to the shop number. Product aliases mean you can write it however you say it.',
  },
  {
    n: '02',
    title: 'Reply YES',
    body: 'The bot reads back the quantity, unit price and total. Nothing is filed until you confirm, so a typo costs you one word.',
  },
  {
    n: '03',
    title: 'The invoice is filed',
    body: 'We call the KRA eTIMS API, receive the control unit number and QR code, and render a receipt image you can forward to the customer.',
  },
  {
    n: '04',
    title: 'Your books update',
    body: 'Stock decrements, the sale lands in the ledger with a timestamp, and low-stock items surface in your weekly report.',
  },
]

export default function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Four steps. Two of them are yours."
      lede="Everything after the confirmation happens without you."
    >
      <ol className="mt-16 border-t border-line">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="group grid gap-3 border-b border-line py-8 md:grid-cols-[5rem_1fr_1.4fr] md:items-baseline md:gap-8 md:py-10"
          >
            <span className="font-display text-sm font-bold tracking-widest text-green">
              {step.n}
            </span>
            <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted md:text-base">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
