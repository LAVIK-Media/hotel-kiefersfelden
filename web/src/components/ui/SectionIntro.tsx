import type { ReactNode } from 'react'
import { GasthofRule } from '~/components/ui/GasthofRule'
import { cn } from '~/lib/cn'

type Props = {
  eyebrow?: string
  headline: string
  body?: ReactNode
  align?: 'start' | 'center'
  className?: string
  /** Wenn `true`, wird die Headline kleiner gerendert (für Sub-Sektionen). */
  small?: boolean
  /** Dekorative Stammtisch-Linie zwischen Eyebrow und Headline */
  ornament?: boolean
}

/**
 * Editorialer Sektions-Auftakt: Vorzeichen, große Serif-Headline, optionaler Lead.
 * Ruhig, mit echtem Whitespace.
 */
export function SectionIntro({
  eyebrow,
  headline,
  body,
  align = 'start',
  className,
  small,
  ornament = true,
}: Props) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <>
          <p className={cn('eyebrow gasthof-eyebrow-kicker mb-5', align === 'center' && 'text-center')}>
            {eyebrow}
          </p>
          {ornament && (
            <GasthofRule
              className={cn(
                'mb-6',
                align === 'center'
                  ? 'mx-auto justify-center [&_.gasthof-rule-line]:w-14 [&_.gasthof-rule-line]:max-w-none [&_.gasthof-rule-line]:flex-none'
                  : 'max-w-xs',
              )}
            />
          )}
        </>
      )}
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
