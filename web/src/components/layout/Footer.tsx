import { getTranslations } from 'next-intl/server'
import { Link as IntlLink } from '~/i18n/navigation'
import { getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

type Props = { locale: Locale }

export async function Footer({ locale }: Props) {
  const settings = await getSiteSettings(locale)
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="mt-32 border-t border-[var(--color-line)] bg-[var(--color-paper-soft)]">
      <div aria-hidden="true" className="bavarian-ribbon h-[6px] w-full opacity-35" />
      <div className="container-wide grid gap-12 py-16 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <p className="font-serif text-2xl leading-tight">
            Hotel zur Post
            <br />
            <span className="text-[var(--color-ink-mute)]">Kiefersfelden</span>
          </p>
          <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-[var(--color-ink-mute)]">
            {settings.tagline}
          </p>
        </div>

        {/* Address */}
        <div className="md:col-span-3">
          <p className="eyebrow">{t('addressTitle')}</p>
          <address className="mt-3 not-italic text-sm leading-relaxed text-[var(--color-ink-mute)]">
            {settings.contact.companyName}
            <br />
            {settings.contact.street}
            <br />
            {settings.contact.postalCode} {settings.contact.city}
            <br />
            {settings.contact.country}
            <br />
            <br />
            <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-ink)]">
              {settings.contact.phone}
            </a>
            <br />
            <a href={`mailto:${settings.contact.email}`} className="hover:text-[var(--color-ink)]">
              {settings.contact.email}
            </a>
          </address>
        </div>

        {/* Site links */}
        <div className="md:col-span-2">
          <p className="eyebrow">{tNav('home')}</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {settings.navigation.footer.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <IntlLink
                    href={item.href}
                    className="text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </IntlLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter / News */}
        <div className="md:col-span-3">
          <p className="eyebrow">{t('newsletterTitle')}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-mute)]">
            {t('newsletterText')}
          </p>
        </div>
      </div>

      {/* Legal stripe */}
      <div className="border-t border-[var(--color-line)]">
        <div className="container-wide flex flex-col gap-4 py-6 text-xs text-[var(--color-ink-soft)] md:flex-row md:items-center md:justify-between">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <ul className="flex gap-6">
            {settings.navigation.footerLegal.map((item) => (
              <li key={item.href}>
                <IntlLink href={item.href} className="hover:text-[var(--color-ink)]">
                  {item.label}
                </IntlLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
