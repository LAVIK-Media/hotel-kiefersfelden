import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

type Props = {
  eyebrow?: string
  headline: string
  body?: ReactNode
  align?: 'start' | 'center'
  className?: string
  /** Wenn `true`, wird die Headline kleiner gerendert (für Sub-Sektionen). */
  small?: boolean
}

/**
 * Editorialer Sektions-Auftakt: Vorzeichen, große Serif-Headline, optionaler Lead.
 * Ruhig, mit echtem Whitespace.
 */
export function SectionIntro({ eyebrow, headline, body, align = 'start', className, small }: Props) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2
        className={cn(
          'font-serif tracking-tight text-balance',
          small ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl',
        )}
      >
        {headline}
      </h2>
      {body && (
        <div className="mt-6 text-[var(--color-ink-mute)] text-lg leading-relaxed text-pretty md:text-[1.2rem]">
          {body}
        </div>
      )}
    </div>
  )
}
