import { setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Impressum' }

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const settings = await getSiteSettings(locale)

  return (
    <article className="container-prose py-24 md:py-32">
      <h1 className="font-serif">Impressum</h1>

      <p className="lead mt-8">{settings.contact.companyName}</p>

      <p className="mt-6 leading-relaxed text-[var(--color-ink-mute)]">
        {locale === 'en' ? 'Owner' : 'Inh.'} Andreas Pfeiffer
        <br />
        {settings.contact.street}
        <br />
        {settings.contact.postalCode} {settings.contact.city}
        <br />
        {settings.contact.country}
      </p>

      <p className="mt-6 leading-relaxed text-[var(--color-ink-mute)]">
        Telefon: <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-ink)]">{settings.contact.phone}</a>
        <br />
        Fax: {settings.contact.fax}
        <br />
        E-Mail: <a href={`mailto:${settings.contact.email}`} className="hover:text-[var(--color-ink)]">{settings.contact.email}</a>
      </p>

      <p className="mt-6 leading-relaxed text-[var(--color-ink-mute)]">
        USt-IdNr.: DE131109627
        <br />
        Steuernummer: 156 258 10377
      </p>

      <h2 className="mt-12">Verantwortlich i.S.d. § 18 Abs. 2 MStV</h2>
      <p className="text-[var(--color-ink-mute)]">
        Andreas Pfeiffer, Anschrift wie oben.
      </p>

      <h2 className="mt-12">Verbraucherstreitbeilegung</h2>
      <p className="text-[var(--color-ink-mute)]">
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS-Plattform)
        unter <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline">https://ec.europa.eu/consumers/odr</a> bereit.
        Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren teilzunehmen.
      </p>
    </article>
  )
}
