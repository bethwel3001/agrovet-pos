import { site } from '../site'
import { WhatsAppButton } from './ui'

export default function Closer() {
  return (
    <section className="bg-green py-24 text-paper md:py-32">
      <div className="shell text-center">
        <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
          The next customer through the door can leave with a legal receipt.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-paper/75 md:text-lg">
          Send one message to set up your shop. It takes about as long as writing a receipt by hand.
        </p>

        <div className="mt-11 flex justify-center">
          <WhatsAppButton
            href={site.whatsappUrl}
            label="Open WhatsApp"
            variant="inverse"
            className="px-8 py-4 text-base"
          />
        </div>
      </div>
    </section>
  )
}
