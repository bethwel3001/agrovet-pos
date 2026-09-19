const FIGURES = [
  { value: '30,000', label: 'agrovet shops in Kenya required to file eTIMS invoices' },
  { value: '1–3', label: 'staff in a typical single-branch shop, all of them already on WhatsApp' },
  { value: '0', label: 'new apps they are willing to download to become compliant' },
]

export default function Problem() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper md:py-28">
      <div className="shell">
        <p className="eyebrow text-paper/50">The gap</p>
        <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-[2.75rem]">
          The compliance tools exist. They were just never built for a counter in Nakuru.
        </h2>
        <p className="mt-5 max-w-2xl text-base text-paper/60 md:text-lg">
          eTIMS software assumes a desktop, an accountant and a monthly licence. The shops that
          actually need it are running on a receipt book and one phone.
        </p>

        <dl className="mt-16 grid gap-px overflow-hidden border border-paper/15 bg-paper/15 sm:grid-cols-3">
          {FIGURES.map((figure) => (
            <div key={figure.value} className="bg-ink p-7 md:p-9">
              <dt className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {figure.value}
              </dt>
              <dd className="mt-4 text-sm leading-relaxed text-paper/60">{figure.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
