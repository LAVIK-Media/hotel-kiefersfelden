import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitch } from './LocaleSwitch'
import { MobileNav } from './MobileNav'
import { getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'
import { Link as IntlLink } from '~/i18n/navigation'

type Props = { locale: Locale }

export async function Header({ locale }: Props) {
  const settings = await getSiteSettings(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-paper)] focus:px-4 focus:py-2 focus:text-[var(--color-ink)]">
        {t('skipToContent')}
      </a>

      <header className="sticky top-0 z-30 border-b border-[var(--color-line-soft)] bg-[var(--color-paper)]/88 backdrop-blur-md">
        <div aria-hidden="true" className="bavarian-ribbon h-[5px] w-full opacity-90" />
        <div className="container-wide flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Logo / Wortmarke */}
          <IntlLink href="/" className="group inline-flex items-baseline gap-3">
            <span className="font-serif text-xl tracking-tight md:text-2xl">
              Hotel zur Post
            </span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] md:inline">
              Kiefersfelden · 1820
            </span>
          </IntlLink>

          {/* Desktop-Nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Hauptnavigation">
            {settings.navigation.header.map((item) => (
              <IntlLink
                key={item.href}
                href={item.href}
                className="text-[0.95rem] tracking-tight text-[var(--color-ink-mute)] transition-colors hover:text-[var(--color-ink)]"
              >
                {item.label}
              </IntlLink>
            ))}
          </nav>

          {/* Right cluster: locale + booking */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:block">
              <LocaleSwitch />
            </div>

            <a
              href={settings.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full px-4 py-2 text-[0.85rem] tracking-tight text-[var(--color-paper)] shadow-[var(--shadow-soft)] transition-[box-shadow,filter,transform] duration-[var(--duration-base)] ease-[var(--ease-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-[1px] bg-[linear-gradient(135deg,var(--color-loden)_0%,var(--color-alpine)_60%,var(--color-loden-deep)_100%)] md:inline-block"
            >
              {settings.bookingCtaLabel}
            </a>

            <MobileNav
              items={settings.navigation.header}
              bookingUrl={settings.bookingUrl}
              bookingLabel={settings.bookingCtaLabel}
              labels={{
                open: t('openMenu'),
                close: t('closeMenu'),
              }}
            />
          </div>
        </div>
      </header>
    </>
  )
}
