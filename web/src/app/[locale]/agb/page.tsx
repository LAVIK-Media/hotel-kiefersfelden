import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '~/i18n/routing'

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <article className="container-prose py-24 md:py-32">
      <h1 className="font-serif">{locale === 'en' ? 'Terms & Cancellation' : 'AGB & Stornobedingungen'}</h1>

      <p className="mt-6 rounded border-l-2 border-[var(--color-loden)] bg-[var(--color-paper-soft)] px-5 py-4 text-sm text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? '⚠ Placeholder. To be aligned with DIRS21 cancellation policy.'
          : '⚠ Platzhalter. Mit DIRS21-Stornoregeln abzugleichen.'}
      </p>

      <h2 className="mt-12">{locale === 'en' ? '1. Booking & confirmation' : '1. Buchung & Bestätigung'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? 'A reservation becomes binding upon written confirmation by the hotel.'
          : 'Mit der schriftlichen Bestätigung durch das Hotel wird die Reservierung verbindlich.'}
      </p>

      <h2 className="mt-12">{locale === 'en' ? '2. Cancellation' : '2. Stornierung'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? 'Free cancellation up to 14 days before arrival; thereafter 80 % of the booking total. No-show: full booking total.'
          : 'Kostenfrei bis 14 Tage vor Anreise. Danach 80 % des Buchungswerts. No-Show: voller Buchungswert.'}
      </p>
    </article>
  )
}
