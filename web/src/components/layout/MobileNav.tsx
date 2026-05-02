'use client'

import { useEffect, useState } from 'react'
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
  const pathname = usePathname()

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

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-paper)] transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 pb-12 pt-24">
          <div aria-hidden="true" className="bavarian-ribbon -mx-6 -mt-24 mb-10 h-[7px] opacity-90" />
          <nav className="flex flex-col gap-2" aria-label="Mobile Hauptnavigation">
            {items.map((item) => (
              <IntlLink
                key={item.href}
                href={item.href}
                className="font-serif text-3xl tracking-tight text-[var(--color-ink)] py-2 border-b border-[var(--color-line-soft)]"
              >
                {item.label}
              </IntlLink>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6">
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
    </>
  )
}
