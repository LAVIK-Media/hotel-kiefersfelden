import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link as IntlLink } from '~/i18n/navigation'

import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { RoomCard } from '~/components/ui/RoomCard'
import { MenuToday } from '~/components/ui/MenuToday'
import { OfferCard } from '~/components/ui/OfferCard'
import { HolidayCheckBadge } from '~/components/widgets/HolidayCheckBadge'

import { getActiveMenu, getOffers, getRooms, getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tA, settings, menu, rooms, offers] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'actions' }),
    getSiteSettings(locale),
    getActiveMenu(locale),
    getRooms(locale),
    getOffers(locale),
  ])

  // ─────────────────────────────────────────────────────────────────
  //  HERO – Vollbild, ruhige Lede, dezenter Outline-CTA
  //  PHOTO TODO: das stärkste Bild der Site. Wenn ein professionelles
  //  Hero-Shooting möglich ist, ist hier der größte Hebel.
  // ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Hero
        image={{ src: '/images/hero/home.jpg', alt: 'Hotel zur Post Kiefersfelden im Sommerlicht', width: 2253, height: 1253 }}
        eyebrow={t('heroEyebrow')}
        headline={t('heroHeadline')}
        sub={t('heroSub')}
        overlay="strong"
        imagePosition="50% 60%"
      >
        <div className="flex flex-wrap items-center gap-6">
          <a
            href={settings.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[0.95rem] tracking-tight text-[var(--color-paper)] shadow-[var(--shadow-soft)] transition-[box-shadow,filter,transform] duration-[var(--duration-base)] ease-[var(--ease-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-[1px] bg-[linear-gradient(135deg,var(--color-loden)_0%,var(--color-alpine)_60%,var(--color-loden-deep)_100%)]"
          >
            {settings.bookingCtaLabel}
          </a>
          <IntlLink
            href="/zimmer"
            className="inline-flex items-center gap-2 text-[var(--color-paper)]/85 underline-offset-4 hover:underline"
          >
            {tA('viewRoom')} <span aria-hidden="true">→</span>
          </IntlLink>
        </div>
      </Hero>

      {/* ─── LEAD: ein einziger ruhiger Editorial-Absatz ─── */}
      <section className="bg-alpine-wash border-y border-[var(--color-line-soft)] py-28 md:py-36">
        <div className="container-narrow">
          <SectionIntro
            eyebrow={t('leadEyebrow')}
            headline={t('leadHeadline')}
            body={<p>{t('leadBody')}</p>}
          />
        </div>
      </section>

      {/* ─── DOPPELBILD: Wirtin-Portrait + Außenansicht ─── */}
      <section className="py-14 md:py-20">
        <div className="container-wide grid gap-6 md:grid-cols-12 md:gap-10">
          <figure className="surface-card surface-card-hover relative aspect-[3/4] overflow-hidden md:col-span-5">
            <Image
              src="/images/hotel/wirtin.jpg"
              alt={locale === 'en' ? 'Christine Pfeiffer, the innkeeper' : 'Christine Pfeiffer, die Wirtin'}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover scale-[1.06]"
              style={{ objectPosition: '50% 42%' }}
            />
          </figure>
          <figure className="surface-card surface-card-hover relative aspect-[16/10] overflow-hidden md:col-span-7 md:mt-24">
            <Image
              src="/images/hotel/aussenansicht.jpg"
              alt={locale === 'en' ? 'Hotel zur Post – exterior' : 'Hotel zur Post – Außenansicht'}
              fill
              sizes="(min-width: 768px) 56vw, 100vw"
              className="object-cover scale-[1.12]"
              style={{ objectPosition: '50% 72%' }}
            />
          </figure>
        </div>
      </section>

      {/* ─── HEUTE AUF DER KARTE ─── */}
      <section className="bg-[var(--color-paper-soft)] py-28 md:py-36">
        <div className="container-narrow grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionIntro
              eyebrow={t('menuEyebrow')}
              headline={menu?.type === 'tageskarte' ? t('menuEyebrow') : (menu?.title ?? '')}
              small
              body={
                <p>
                  {menu
                    ? menu.introNote ?? ''
                    : t('menuFallback')}
                </p>
              }
            />
            <IntlLink
              href="/speisekarte"
              className="mt-8 inline-flex items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-ink)_45%,transparent)] pb-1 text-sm tracking-tight text-[var(--color-ink)] hover:border-[var(--color-loden)] hover:text-[var(--color-loden)]"
            >
              {tA('viewMenu')} <span aria-hidden="true">→</span>
            </IntlLink>
          </div>
          <div className="md:col-span-8">
            <div className="surface-card surface-card-hover p-6 md:p-10">
              <MenuToday menu={menu} variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ZIMMER ─── */}
      <section className="container-narrow py-28 md:py-36">
        <SectionIntro
          eyebrow={t('roomsEyebrow')}
          headline={t('roomsHeadline')}
          body={<p>{t('roomsBody')}</p>}
          className="mb-20"
        />
        <div className="flex flex-col gap-24 md:gap-32">
          {rooms.slice(0, 3).map((room, i) => (
            <RoomCard key={room.id} room={room} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ─── REGION-VOLLBILD ─── */}
      <section className="relative h-[80svh] min-h-[480px] overflow-hidden">
        <Image
          src="/images/region/kutschenfahrt.jpg"
          alt={locale === 'en' ? 'Carriage ride through Kiefersfelden' : 'Kutschenfahrt durch Kiefersfelden'}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,15,0.5)] via-[rgba(20,18,15,0.15)] to-transparent" />
        <div className="container-wide relative flex h-full items-end pb-16 md:pb-24">
          <div className="max-w-2xl text-[var(--color-paper)]">
            <p className="eyebrow text-[var(--color-hay-soft)]">{t('regionEyebrow')}</p>
            <h2 className="mt-4 font-serif text-balance text-4xl leading-tight md:text-6xl">
              {t('regionHeadline')}
            </h2>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-paper)]/85">
              {t('regionBody')}
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <IntlLink
                href="/sommer"
                className="inline-flex items-center gap-2 border-b border-[var(--color-paper)] pb-1 text-[var(--color-paper)] hover:opacity-80"
              >
                {locale === 'en' ? 'Summer' : 'Sommer'} →
              </IntlLink>
              <IntlLink
                href="/winter"
                className="inline-flex items-center gap-2 border-b border-[var(--color-paper)] pb-1 text-[var(--color-paper)] hover:opacity-80"
              >
                Winter →
              </IntlLink>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANGEBOTE / PAUSCHALEN ─── */}
      {offers.length > 0 && (
        <section className="container-narrow py-28 md:py-36">
          <SectionIntro
            eyebrow={locale === 'en' ? 'Packages' : 'Pauschalen'}
            headline={
              locale === 'en'
                ? 'Two ways to plan a stay – or call us, we’ll find a third.'
                : 'Zwei Vorschläge für Ihren Aufenthalt – oder rufen Sie an, wir finden einen dritten.'
            }
            className="mb-16"
          />
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* ─── HOLIDAYCHECK – ruhig als Trustleiste ─── */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-paper-soft)]">
        <div aria-hidden="true" className="bavarian-ribbon h-[6px] w-full opacity-35" />
        <div className="container-narrow py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="eyebrow">{t('trustEyebrow')}</p>
              <p className="mt-3 max-w-md font-serif text-2xl tracking-tight md:text-3xl">
                {t('trustBody')}
              </p>
            </div>
            <div className="md:col-span-5">
              <HolidayCheckBadge
                recommendationRate={settings.holidayCheck?.recommendationRate}
                reviewCount={settings.holidayCheck?.reviewCount}
                badges={settings.holidayCheck?.badges}
                profileUrl={settings.holidayCheck?.profileUrl}
                variant="inline"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
