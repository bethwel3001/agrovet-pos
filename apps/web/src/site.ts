/**
 * Single source of truth for copy that changes between environments or
 * gets tweaked before a demo. Keep marketing prose in the sections themselves.
 */

/** Ships as the default so the repo has no real number in it. */
const PLACEHOLDER_NUMBER = '254700000000'

const rawNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').trim()
const prefill = import.meta.env.VITE_WHATSAPP_PREFILL ?? 'Hi, I run an agrovet and I want to try AgroVet POS.'

/** False until VITE_WHATSAPP_NUMBER holds a real number — the CTAs toast instead of navigating. */
export const whatsappConfigured = rawNumber !== '' && rawNumber !== PLACEHOLDER_NUMBER

export const site = {
  name: 'AgroVet POS',
  tagline: 'A WhatsApp point-of-sale for Kenyan agrovets.',
  whatsappUrl: `https://wa.me/${rawNumber || PLACEHOLDER_NUMBER}?text=${encodeURIComponent(prefill)}`,
  whatsappUnavailable: 'WhatsApp is not connected yet. The shop number goes live with the bot.',
  email: 'hello@agrovetpos.co.ke',
  nav: [
    { label: 'How it works', href: '#how' },
    { label: 'What it does', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Questions', href: '#faq' },
  ],
} as const
