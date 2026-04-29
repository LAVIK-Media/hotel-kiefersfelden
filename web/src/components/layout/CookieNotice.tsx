'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const KEY = 'hzp.cookieAck'

export function CookieNotice() {
  const t = useTranslations('cookie')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(KEY) !== 'ack') {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-30 max-w-md rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-lift)] md:left-auto md:right-6 md:bottom-6"
    >
      <p className="font-serif text-base text-[var(--color-ink)]">{t('title')}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-mute)]">
        {t('body')}
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(KEY, 'ack')
          setShow(false)
        }}
        className="mt-4 inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-2 text-sm text-[var(--color-paper)] hover:bg-[var(--color-loden)]"
      >
        {t('ok')}
      </button>
    </div>
  )
}
