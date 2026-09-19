import { useEffect, useState } from 'react'
import { site } from '../site'
import { WhatsAppButton } from './ui'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/85 backdrop-blur-sm transition-colors duration-200 ${
        scrolled ? 'border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          AgroVet<span className="text-green">POS</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <WhatsAppButton href={site.whatsappUrl} label="Open WhatsApp" className="px-5 py-2.5" />
      </div>
    </header>
  )
}
