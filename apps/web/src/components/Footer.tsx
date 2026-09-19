import { site } from '../site'

export default function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <div className="shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-lg font-bold tracking-tight">
            AgroVet<span className="text-green">POS</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Footer">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-muted transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-blue transition-colors hover:text-blue-deep"
          >
            {site.email}
          </a>
        </nav>
      </div>

      <div className="shell mt-12 flex flex-col gap-2 border-t border-line pt-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Built in Kenya. Open source, self-hosted.</p>
        <p>Not affiliated with WhatsApp or the Kenya Revenue Authority.</p>
      </div>
    </footer>
  )
}
