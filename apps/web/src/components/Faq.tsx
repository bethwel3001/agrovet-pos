import { Section } from './ui'

const QUESTIONS = [
  {
    q: 'Do I need to install anything?',
    a: 'No. You save our number and text it. Everything happens inside the WhatsApp you already use all day.',
  },
  {
    q: 'Is this actually KRA compliant?',
    a: 'Yes. Invoices are filed through the official KRA eTIMS API in OSCU mode. Each receipt carries the control unit invoice number and a QR code a customer or an officer can verify.',
  },
  {
    q: 'What if I type the sale wrong?',
    a: 'Nothing is filed until you reply YES. The bot reads back the item, quantity, unit price and total first, so a mistake costs you one message.',
  },
  {
    q: 'What happens when the network drops?',
    a: 'Invoices are queued and retried. Your message is acknowledged immediately and the receipt arrives once eTIMS responds.',
  },
  {
    q: 'Can more than one person sell?',
    a: 'On the Pro tier, up to three WhatsApp numbers can post sales to the same shop. Every sale is logged against the number that sent it.',
  },
  {
    q: 'Who can see my sales data?',
    a: 'The deployment is self-hosted on infrastructure you control, and the stack is open source end to end. Nothing is shared with a lender or anyone else unless you ask us to.',
  },
]

export default function Faq() {
  return (
    <Section id="faq" eyebrow="Questions" title="The ones owners actually ask.">
      <div className="mt-16 border-t border-line">
        {QUESTIONS.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex items-start justify-between gap-6 py-6 md:py-7">
              <h3 className="font-display text-base font-semibold tracking-tight md:text-lg">
                {item.q}
              </h3>
              <span
                aria-hidden
                className="relative mt-2 size-3 shrink-0 text-green transition-transform duration-200 group-open:rotate-45"
              >
                <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
              </span>
            </summary>
            <p className="max-w-2xl pb-7 text-sm leading-relaxed text-muted md:text-base">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  )
}
