import { useEffect, useState } from 'react'
import { dismissToast, getToast, subscribeToast, type Toast as ToastType } from '../toast'

const VISIBLE_MS = 4000

export default function Toast() {
  const [toast, setToast] = useState<ToastType | null>(getToast)

  useEffect(() => subscribeToast(setToast), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismissToast, VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-6 sm:justify-end sm:px-6 sm:pb-8"
    >
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink py-4 pr-3 pl-5 text-paper shadow-lg motion-safe:animate-[toast-in_220ms_ease-out]"
        >
          <span aria-hidden className="mt-1 h-4 w-0.5 shrink-0 rounded-full bg-blue" />
          <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss"
            className="-mr-1 shrink-0 rounded-full p-2 text-paper/50 transition-colors hover:text-paper"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
