import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Datenschutz' }

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <article className="container-prose py-24 md:py-32">
      <h1 className="font-serif">{locale === 'en' ? 'Privacy' : 'Datenschutzerklärung'}</h1>

      <p className="mt-6 rounded border-l-2 border-[var(--color-loden)] bg-[var(--color-paper-soft)] px-5 py-4 text-sm text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? '⚠ Placeholder. Final wording to be drafted with the data-protection officer before launch.'
          : '⚠ Platzhalter. Endgültiger Text vor Live-Gang mit Datenschutzbeauftragtem abstimmen.'}
      </p>

      <h2 className="mt-12">{locale === 'en' ? '1. Controller' : '1. Verantwortlicher'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        Gasthof Hotel zur Post, Andreas Pfeiffer, Bahnhofstraße 22-26, 83088 Kiefersfelden.
      </p>

      <h2 className="mt-12">{locale === 'en' ? '2. Hosting' : '2. Hosting'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? 'This site is hosted on Vercel (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA), with EU/Frankfurt edge nodes. Vercel processes server logs (IP, user agent, request URL) for 30 days for security purposes — no further analytics.'
          : 'Diese Seite wird bei Vercel (Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet, mit EU/Frankfurt-Edge-Knoten. Vercel verarbeitet Server-Logs (IP, User-Agent, Request-URL) für 30 Tage zu Sicherheitszwecken – keine darüber hinausgehende Analyse.'}
      </p>

      <h2 className="mt-12">{locale === 'en' ? '3. Cookies & Storage' : '3. Cookies & Speicher'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? 'We only use technically necessary local storage (e.g. cookie-banner acknowledgement). No tracking cookies, no analytics, no advertising tags.'
          : 'Wir nutzen ausschließlich technisch notwendigen Speicher (z.B. Bestätigung des Hinweisbanners). Keine Tracking-Cookies, keine Analyse, keine Werbe-Tags.'}
      </p>

      <h2 className="mt-12">{locale === 'en' ? '4. External services' : '4. Externe Dienste'}</h2>
      <ul className="list-disc pl-5 leading-relaxed text-[var(--color-ink-mute)]">
        <li>{locale === 'en' ? 'Google Maps – loaded only after user click.' : 'Google Maps – wird nur nach Klick geladen.'}</li>
        <li>{locale === 'en' ? 'DIRS21 booking engine – opens in a new tab on click.' : 'DIRS21 Buchungssystem – öffnet sich auf Klick im neuen Tab.'}</li>
        <li>{locale === 'en' ? 'Open-Meteo (DWD) for weather widget – server-side fetch, no client identifiers.' : 'Open-Meteo (DWD) für das Wetter-Widget – serverseitiger Abruf, keine Client-Kennungen.'}</li>
      </ul>

      <h2 className="mt-12">{locale === 'en' ? '5. Your rights' : '5. Ihre Rechte'}</h2>
      <p className="text-[var(--color-ink-mute)]">
        {locale === 'en'
          ? 'Right to information, rectification, deletion, restriction of processing, data portability, and to lodge a complaint with the supervisory authority. Contact: info@hotel-kiefersfelden.de.'
          : 'Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Beschwerde bei der Aufsichtsbehörde. Kontakt: info@hotel-kiefersfelden.de.'}
      </p>
    </article>
  )
}
