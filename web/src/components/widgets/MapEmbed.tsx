'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  /** Geokoordinaten — Hotel zur Post Kiefersfelden (Bahnhofstraße 22-26). */
  lat: number
  lng: number
  zoom?: number
  /** Sprechende Adresse für aria-label. */
  label: string
}

/**
 * DSGVO-konforme Map-Einbettung: zeigt nur einen statischen Platzhalter,
 * Google-Maps wird erst nach dem ersten Klick geladen.
 */
export function MapEmbed({ lat, lng, zoom = 16, label }: Props) {
  const [loaded, setLoaded] = useState(false)
  const t = useTranslations('actions')

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-[var(--color-paper-warm)] text-center transition-colors hover:bg-[var(--color-paper-soft)]"
        aria-label={`${t('loadMap')}: ${label}`}
      >
        {/* Stilisierter „Karten-Platzhalter" – kein Stockphoto */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 800 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 200 L120 180 L260 220 L400 170 L540 240 L680 180 L800 220" stroke="var(--color-loden-soft)" strokeWidth="1" />
          <path d="M0 280 L160 260 L320 300 L480 250 L640 320 L800 280" stroke="var(--color-loden-soft)" strokeWidth="1" />
          <path d="M0 360 L120 380 L300 340 L460 400 L620 360 L800 390" stroke="var(--color-hay)" strokeWidth="1" />
          <circle cx="400" cy="225" r="8" fill="var(--color-loden)" />
          <circle cx="400" cy="225" r="20" fill="var(--color-loden)" fillOpacity="0.15" />
        </svg>

        <div className="relative z-10 max-w-md px-6">
          <p className="font-serif text-2xl tracking-tight text-[var(--color-ink)]">
            {t('loadMap')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-mute)]">
            {t('loadMapHint')}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-5 py-2 text-sm transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-paper)]">
            {t('loadMap')} →
          </span>
        </div>
      </button>
    )
  }

  // Lazy-loaded iframe nach Konsens
  const url = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

  return (
    <div className="aspect-[16/9] w-full overflow-hidden">
      <iframe
        title={label}
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  )
}
