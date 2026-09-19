import { useEffect, useRef, useState } from 'react'

type Message =
  | { from: 'owner' | 'bot'; text: string }
  | { from: 'bot'; receipt: true }

const THREAD: Message[] = [
  { from: 'owner', text: 'sell 2 bags DAP fertilizer 3200' },
  { from: 'bot', text: 'Confirm: 2 × DAP Fertilizer @ KSh 1,600 each = KSh 3,200.\nReply YES to issue the invoice.' },
  { from: 'owner', text: 'yes' },
  { from: 'bot', receipt: true },
  { from: 'bot', text: 'Invoice sent. Stock for DAP Fertilizer is now 48 bags.' },
]

/** Reveals the thread one message at a time, once, when it scrolls into view. */
function useStaggeredReveal(count: number, stepMs = 550) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(count)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        let i = 0
        const tick = () => {
          i += 1
          setShown(i)
          if (i < count) window.setTimeout(tick, stepMs)
        }
        tick()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [count, stepMs])

  return { ref, shown }
}

function Bubble({ message, visible }: { message: Message; visible: boolean }) {
  const mine = message.from === 'owner'

  return (
    <div
      className={`flex transition-all duration-500 ease-out ${mine ? 'justify-end' : 'justify-start'} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {'receipt' in message ? (
        <Receipt />
      ) : (
        <p
          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line sm:max-w-[75%] ${
            mine
              ? 'rounded-br-sm bg-green text-paper'
              : 'rounded-bl-sm border border-line bg-paper text-ink'
          }`}
        >
          {'text' in message ? message.text : null}
        </p>
      )}
    </div>
  )
}

/** The receipt image the bot sends back, drawn as markup rather than a screenshot. */
function Receipt() {
  return (
    <figure className="w-[16.5rem] rounded-2xl rounded-bl-sm border border-line bg-paper p-4">
      <div className="border border-line-strong border-dashed p-4 font-sans">
        <p className="font-display text-sm font-bold tracking-tight">MAJI MAZURI AGROVET</p>
        <p className="mt-0.5 text-[0.65rem] text-muted">PIN P051234567X · Nakuru</p>

        <div className="mt-3 border-t border-line pt-3 text-[0.7rem]">
          <div className="flex justify-between gap-3">
            <span>DAP Fertilizer × 2</span>
            <span className="tabular-nums">3,200.00</span>
          </div>
          <div className="mt-1 flex justify-between gap-3 text-muted">
            <span>VAT 16%</span>
            <span className="tabular-nums">441.38</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-semibold">
          <span>Total</span>
          <span className="tabular-nums">KSh 3,200</span>
        </div>

        <div className="mt-4 flex items-end gap-3 border-t border-line pt-4">
          <QrGlyph />
          <div className="text-[0.6rem] leading-snug text-muted">
            <p className="font-semibold text-ink">KRA eTIMS</p>
            <p className="mt-0.5 break-all">CU: 0100053923000001</p>
            <p>Scan to verify</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.65rem] text-muted">
        receipt.png · forward it to the customer
      </figcaption>
    </figure>
  )
}

/** A stylised QR mark. Deterministic so it renders identically every load. */
function QrGlyph() {
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + ((i % 5) * 3)) % 4 !== 0)
  return (
    <div aria-hidden className="grid size-14 shrink-0 grid-cols-7 gap-px bg-paper">
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-ink' : 'bg-paper'} />
      ))}
    </div>
  )
}

export default function Conversation() {
  const { ref, shown } = useStaggeredReveal(THREAD.length)

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="shell grid gap-14 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-20">
        <div className="md:sticky md:top-32">
          <p className="eyebrow">One sale, start to finish</p>
          <h2 className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-[2.75rem]">
            This is the entire product.
          </h2>
          <p className="mt-5 text-base text-muted md:text-lg">
            No forms, no menus, no training. Whoever is behind the counter types the sale the way
            they already talk about it, and the compliance happens quietly in the background.
          </p>

          <dl className="mt-10 space-y-4 border-t border-line pt-8 text-sm">
            {[
              ['Time per sale', 'Under 30 seconds'],
              ['Typed by the owner', '2 messages'],
              ['Apps installed', 'None'],
            ].map(([term, value]) => (
              <div key={term} className="flex items-baseline justify-between gap-6">
                <dt className="text-muted">{term}</dt>
                <dd className="font-display font-semibold tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          ref={ref}
          className="flex flex-col gap-3 rounded-3xl border border-line bg-green-soft p-5 sm:p-7"
        >
          <p className="pb-2 text-center text-[0.7rem] tracking-wide text-muted uppercase">
            Today
          </p>
          {THREAD.map((message, i) => (
            <Bubble key={i} message={message} visible={i < shown} />
          ))}
        </div>
      </div>
    </section>
  )
}
