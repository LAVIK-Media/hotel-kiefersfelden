'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState } from 'react'

type Props = {
  recommendationRate?: number
  reviewCount?: number
  badges?: number[]
  profileUrl?: string
  /** „inline" — als Trustleiste; „stacked" — als eigenständige Sektion. */
  variant?: 'inline' | 'stacked'
}

export function HolidayCheckBadge({
  recommendationRate,
  reviewCount,
  badges = [],
  profileUrl,
  variant = 'inline',
}: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const titleId = useId()

  const images = useMemo(
    () =>
      badges.map((year) => ({
        year,
        src: `/images/logos/holidaycheck-badge-${year}.jpg`,
        alt: `HolidayCheck-Auszeichnung ${year}`,
      })),
    [badges],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') setActive((i) => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setActive((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  const content = (
    <>
      {recommendationRate !== undefined && (
        <p className="font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
          {recommendationRate}<span className="text-[var(--color-ink-soft)]">%</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          HolidayCheck{reviewCount ? ` · ${reviewCount} Bewertungen` : ''}
        </p>
      </div>

      {badges.length > 0 && (
        <div className="flex items-center gap-3 opacity-95">
          {images.map((img, idx) => (
            <button
              key={img.year}
              type="button"
              onClick={() => {
                setActive(idx)
                setOpen(true)
              }}
              className="group relative rounded-full"
              aria-label={`HolidayCheck-Badge ${img.year} groß anzeigen`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={64}
                height={64}
                loading="eager"
                priority={idx === 0}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--color-line)] transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-soft)] group-hover:-translate-y-[1px] group-hover:shadow-[var(--shadow-soft)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color-mix(in_srgb,var(--color-copper)_45%,transparent)] opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      )}
    </>
  )

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {content}
        {open && images[active] && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,18,15,0.7)] px-4 py-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div className="surface-card w-full max-w-3xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line-soft)] px-5 py-4">
                <p id={titleId} className="text-sm uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
                  HolidayCheck · {images[active].year}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.6)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.85)]"
                >
                  Schließen
                </button>
              </div>

              <div className="relative aspect-square w-full bg-[var(--color-paper)]">
                <Image
                  src={images[active].src}
                  alt={images[active].alt}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-contain p-8"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line-soft)] px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setActive((i) => Math.max(i - 1, 0))}
                    disabled={active === 0}
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:opacity-40"
                  >
                    ← Vorheriges
                  </button>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                    {active + 1} / {images.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActive((i) => Math.min(i + 1, images.length - 1))}
                    disabled={active === images.length - 1}
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:opacity-40"
                  >
                    Nächstes →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {content}
      {open && images[active] && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,18,15,0.7)] px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="surface-card w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line-soft)] px-5 py-4">
              <p id={titleId} className="text-sm uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
                HolidayCheck · {images[active].year}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.6)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.85)]"
              >
                Schließen
              </button>
            </div>

            <div className="relative aspect-square w-full bg-[var(--color-paper)]">
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain p-8"
                priority
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line-soft)] px-5 py-4">
                <button
                  type="button"
                  onClick={() => setActive((i) => Math.max(i - 1, 0))}
                  disabled={active === 0}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:opacity-40"
                >
                  ← Vorheriges
                </button>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                  {active + 1} / {images.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActive((i) => Math.min(i + 1, images.length - 1))}
                  disabled={active === images.length - 1}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:opacity-40"
                >
                  Nächstes →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
