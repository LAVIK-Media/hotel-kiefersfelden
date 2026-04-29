import type { Locale } from '~/i18n/routing'
import { getSiteSettings } from '~/lib/content'

type Props = { locale: Locale }

/**
 * Sticky-Bottom-Bar nur auf Mobile.
 * Auf Desktop sitzt der Buchungs-CTA bereits im Header.
 */
export async function BookingBar({ locale }: Props) {
  const settings = await getSiteSettings(locale)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--color-line)] bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-4">
        <a
          href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
          aria-label={settings.contact.phone}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)]"
        >
          {/* phone glyph */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a13.5 13.5 0 0 1-5.872-5.872l1.293-.97a1.125 1.125 0 0 0 .417-1.173L8.064 3.102A1.125 1.125 0 0 0 6.973 2.25H5.601A2.25 2.25 0 0 0 3.351 4.5L2.25 6.75Z" />
          </svg>
        </a>
        <a
          href={settings.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full py-3 text-center text-[0.95rem] text-[var(--color-paper)] shadow-[var(--shadow-soft)] bg-[linear-gradient(135deg,var(--color-loden)_0%,var(--color-alpine)_60%,var(--color-loden-deep)_100%)]"
        >
          {settings.bookingCtaLabel}
        </a>
      </div>
    </div>
  )
}
