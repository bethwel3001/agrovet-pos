const POINTS = [
  ['Filed in real time', 'Every confirmed sale posts to the KRA eTIMS API before the receipt is drawn.'],
  ['Control unit number', 'Returned by KRA and printed on the receipt, exactly as an officer expects to see it.'],
  ['Verifiable QR code', 'Anyone holding the receipt can scan it and check the invoice against KRA records.'],
]

export default function Compliance() {
  return (
    <section className="bg-blue py-20 text-paper md:py-24">
      <div className="shell grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-20">
        <div>
          <p className="eyebrow text-paper/55">Compliance</p>
          <h2 className="mt-5 font-display text-2xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
            The paperwork is the whole point.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-paper/70 md:text-base">
            Stock tracking is convenient. Being able to hand over a compliant invoice is the reason
            a shop signs up.
          </p>
        </div>

        <dl className="grid gap-8 sm:grid-cols-3 md:gap-6">
          {POINTS.map(([term, detail]) => (
            <div key={term} className="border-t border-paper/25 pt-5">
              <dt className="font-display text-base font-semibold tracking-tight">{term}</dt>
              <dd className="mt-2.5 text-sm leading-relaxed text-paper/65">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
