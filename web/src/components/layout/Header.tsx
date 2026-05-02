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

      <header className="sticky top-0 z-30 border-b-[3px] border-[color-mix(in_srgb,var(--color-wirtshausholz-deep)_72%,var(--color-copper-deep))] bg-[color-mix(in_srgb,var(--color-paper)_94%,var(--color-paper-warm))]/96 backdrop-blur-md shadow-[0_2px_0_rgba(255,252,246,0.55)]">
        <div aria-hidden="true" className="bavarian-ribbon h-[6px] w-full opacity-[0.98]" />
        <div className="container-wide flex h-[4.25rem] items-center justify-between gap-4 md:h-[5.25rem]">
          {/* Wortmarke: Hotelgasthof, nicht Startup-Landingpage */}
          <IntlLink href="/" className="group flex max-w-[16rem] flex-col gap-0.5 sm:max-w-none">
            <span className="font-serif text-xl leading-[1.1] tracking-tight text-[color-mix(in_srgb,var(--color-ink)_90%,var(--color-wirtshausholz-deep))] transition-colors md:text-[1.62rem]">
              Hotel zur Post
            </span>
            <span className="text-[0.55rem] font-medium uppercase leading-tight tracking-[0.2em] text-[color-mix(in_srgb,var(--color-stube-ruby)_58%,var(--color-loden))] md:text-[0.61rem] md:tracking-[0.24em]">
              {t('brandBadge')}
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
              className="hidden rounded-full px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.04em] text-[var(--color-paper)] shadow-[var(--shadow-soft)] ring-2 ring-[color-mix(in_srgb,var(--color-loewengold)_45%,transparent)] transition-[box-shadow,filter,transform] duration-[var(--duration-base)] ease-[var(--ease-soft)] hover:-translate-y-px hover:shadow-[var(--shadow-lift)] gasthof-btn-header md:inline-block"
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
