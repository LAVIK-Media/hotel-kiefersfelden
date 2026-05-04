'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { Link as IntlLink } from '~/i18n/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import type { NavItem } from '~/lib/types'

type Props = {
  items: NavItem[]
  bookingUrl: string
  bookingLabel: string
  labels: { open: string; close: string }
}

export function MobileNav({ items, bookingUrl, bookingLabel, labels }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Beim Routenwechsel automatisch schließen (microtask vermeidet setState-sync-in-effect-Regel)
  useEffect(() => {
    queueMicrotask(() => setOpen(false))
  }, [pathname])

  // Body-Scroll sperren wenn Menü offen
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const drawer = (
    <div
      className={`fixed inset-0 z-[100] bg-[var(--color-paper)] transition-opacity duration-300 lg:hidden ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={labels.open}
    >
      <div
        className="flex h-full min-h-0 flex-col px-6 pb-[max(3rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))]"
      >
        <div className="flex shrink-0 items-center justify-end pb-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={labels.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line-soft)] text-[var(--color-ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-paper-warm)_55%,var(--color-paper))]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div aria-hidden="true" className="bavarian-ribbon -mx-6 mb-8 h-[7px] shrink-0 opacity-90" />
        <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto" aria-label="Mobile Hauptnavigation">
          {items.map((item) => (
            <IntlLink
              key={item.href}
              href={item.href}
              className="border-b border-[var(--color-line-soft)] py-2 font-serif text-3xl tracking-tight text-[var(--color-ink)]"
            >
              {item.label}
            </IntlLink>
          ))}
        </nav>

        <div className="mt-8 flex shrink-0 flex-col gap-6">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gasthof-btn-primary rounded-full px-6 py-4 text-center text-base font-medium tracking-wide text-[var(--color-paper)] shadow-[var(--shadow-soft)] ring-2 ring-[color-mix(in_srgb,var(--color-loewengold)_40%,transparent)]"
          >
            {bookingLabel}
          </a>
          <div className="flex justify-center">
            <LocaleSwitch />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-label={open ? labels.close : labels.open}
        className="relative inline-flex h-10 w-10 items-center justify-center lg:hidden"
      >
        <span
          aria-hidden="true"
          className="relative block h-[1px] w-6 bg-[var(--color-ink)] transition-all duration-300"
          style={{
            transform: open ? 'rotate(45deg) translateY(0)' : 'translateY(-4px)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute block h-[1px] w-6 bg-[var(--color-ink)] transition-all duration-300"
          style={{
            transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
            opacity: 1,
          }}
        />
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  )
}
