/**
 * A one-at-a-time toast. Module-level rather than a context so any component —
 * or a plain event handler — can raise one without being wrapped in a provider.
 */

export type Toast = { id: number; message: string }

type Listener = (toast: Toast | null) => void

const listeners = new Set<Listener>()
let current: Toast | null = null
let nextId = 1

export function showToast(message: string) {
  current = { id: nextId++, message }
  listeners.forEach((listener) => listener(current))
}

export function dismissToast() {
  current = null
  listeners.forEach((listener) => listener(null))
}

export function subscribeToast(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToast() {
  return current
}
