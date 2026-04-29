'use client'

import { usePathname, useRouter } from '~/i18n/navigation'
import { useLocale } from 'next-intl'
import { routing } from '~/i18n/routing'

export function LocaleSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <div
      role="group"
      aria-label="Sprache wählen"
      className="inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]"
    >
      {routing.locales.map((l, idx) => {
        const isActive = l === locale
        return (
          <span key={l} className="flex items-center gap-3">
            <button
              onClick={() => router.replace(pathname, { locale: l })}
              aria-current={isActive ? 'true' : undefined}
              className={
                isActive
                  ? 'text-[var(--color-ink)] font-medium'
                  : 'hover:text-[var(--color-ink)] transition-colors'
              }
            >
              {l.toUpperCase()}
            </button>
            {idx < routing.locales.length - 1 && (
              <span aria-hidden="true" className="text-[var(--color-line)]">·</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
