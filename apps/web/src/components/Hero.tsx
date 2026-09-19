import { site } from '../site'
import { ArrowRight, Button, WhatsAppButton } from './ui'

export default function Hero() {
  return (
    <section id="top" className="pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="shell">
        <h1 className="max-w-4xl font-display text-[2.75rem] leading-[1.06] font-bold tracking-[-0.035em] text-balance sm:text-6xl md:text-display">
          Your shop already runs on WhatsApp.
          <br />
          <span className="text-green">Now it issues legal receipts.</span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          Text a sale the way you'd text a customer. A KRA eTIMS-compliant receipt comes back in
          seconds. Stock and your sales ledger update themselves.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <WhatsAppButton href={site.whatsappUrl} label="Start on WhatsApp" className="px-7 py-3.5" />
          <Button href="#how" variant="outline" className="px-7 py-3.5">
            See how it works
            <ArrowRight />
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted">
          No app to download. No dashboard to learn. Free for your first 50 invoices a month.
        </p>
      </div>
    </section>
  )
}
