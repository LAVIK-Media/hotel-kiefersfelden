import Image from 'next/image'
import { cn } from '~/lib/cn'
import type { ReactNode } from 'react'

type Props = {
  image: { src: string; alt: string; width?: number; height?: number }
  eyebrow?: string
  headline: string
  sub?: string
  children?: ReactNode
  /** „full" — Bildschirm-Höhe (Startseite). „compact" — 60vh, für Sub-Seiten. */
  size?: 'full' | 'compact'
  /** Bildposition für object-fit (z.B. wenn Hauptmotiv unten sitzt). */
  imagePosition?: string
  /** Reduziert das Overlay, falls das Bild stärker sein soll (z.B. Region-Hero). */
  overlay?: 'soft' | 'medium' | 'strong'
  align?: 'start' | 'center'
}

const overlayClasses: Record<NonNullable<Props['overlay']>, string> = {
  soft:    'from-[rgba(20,18,15,0.32)] via-[rgba(20,18,15,0.10)] to-transparent',
  medium:  'from-[rgba(20,18,15,0.55)] via-[rgba(20,18,15,0.20)] to-transparent',
  strong:  'from-[rgba(20,18,15,0.72)] via-[rgba(20,18,15,0.32)] to-[rgba(20,18,15,0.05)]',
}

export function Hero({
  image,
  eyebrow,
  headline,
  sub,
  children,
  size = 'full',
  imagePosition = 'center',
  overlay = 'medium',
  align = 'start',
}: Props) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-[var(--color-ink)]',
        size === 'full' ? 'h-[88svh] min-h-[640px] md:h-[92svh]' : 'h-[60svh] min-h-[420px]',
      )}
      aria-label="Hero"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />

      {/* Sanftes Verlauf-Overlay – kein Layer-Trick, nur Tiefe */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-t',
          overlayClasses[overlay],
        )}
      />

      <div className="container-wide relative flex h-full flex-col justify-end pb-16 md:pb-24">
        <div
          className={cn(
            'max-w-3xl text-[var(--color-paper)]',
            align === 'center' && 'mx-auto text-center',
          )}
        >
          {eyebrow && (
            <p className="reveal eyebrow mb-5 text-[var(--color-hay-soft)]">
              {eyebrow}
            </p>
          )}

          <h1 className="reveal reveal-delay-1 font-serif font-light tracking-[-0.02em] text-balance whitespace-pre-line">
            {headline}
          </h1>

          {sub && (
            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-paper)]/85 md:text-xl">
              {sub}
            </p>
          )}

          {children && <div className="reveal reveal-delay-3 mt-10">{children}</div>}
        </div>
      </div>
    </section>
  )
}
