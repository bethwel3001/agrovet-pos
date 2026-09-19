import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { site, whatsappConfigured } from '../site'
import { showToast } from '../toast'

/* ── Icons ────────────────────────────────────────────────────────────
   Hand-rolled so the whole site ships zero icon dependencies and every
   stroke matches the hairline rules used between sections.            */

export function ArrowRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WhatsAppMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.23 8.23 0 0 1 0 16.47Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.72.59.25 1.04.4 1.4.52.59.18 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  )
}

/* ── Buttons ─────────────────────────────────────────────────────── */

type ButtonProps = ComponentPropsWithoutRef<'a'> & {
  variant?: 'solid' | 'outline' | 'inverse'
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-150'

const buttonVariants = {
  solid: 'bg-green text-paper hover:bg-green-deep',
  outline: 'border border-line-strong text-ink hover:border-ink',
  inverse: 'bg-paper text-green hover:bg-green-soft',
} as const

export function Button({ variant = 'solid', className = '', children, ...props }: ButtonProps) {
  return (
    <a className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props}>
      {children}
    </a>
  )
}

/**
 * The primary conversion action. Used in the nav, hero, pricing and closer.
 * Until a real shop number is configured, clicking raises a toast instead of
 * opening a dead wa.me link.
 */
export function WhatsAppButton({
  label = 'Open WhatsApp',
  variant = 'solid',
  href,
  className = '',
}: {
  label?: string
  variant?: ButtonProps['variant']
  href: string
  className?: string
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (whatsappConfigured) return
    event.preventDefault()
    showToast(site.whatsappUnavailable)
  }

  return (
    <Button
      href={href}
      variant={variant}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-disabled={whatsappConfigured ? undefined : true}
      className={className}
    >
      <WhatsAppMark className="size-4" />
      {label}
    </Button>
  )
}

/* ── Layout ──────────────────────────────────────────────────────── */

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  bordered = true,
}: {
  id?: string
  eyebrow?: string
  title?: ReactNode
  lede?: ReactNode
  children?: ReactNode
  bordered?: boolean
}) {
  return (
    <section id={id} className={`${bordered ? 'border-t border-line' : ''} py-20 md:py-28`}>
      <div className="shell">
        {(eyebrow || title || lede) && (
          <header className="max-w-2xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-[2.75rem]">
                {title}
              </h2>
            )}
            {lede && <p className="mt-5 text-base text-muted md:text-lg">{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
