import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link as IntlLink } from '~/i18n/navigation'
import Image from 'next/image'

import { ImageGallery } from '~/components/ui/ImageGallery'
import { getRoomBySlug, getRooms, getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  // Beide Locales generieren
  const [de, en] = await Promise.all([getRooms('de'), getRooms('en')])
  return [
    ...de.map((r) => ({ locale: 'de', slug: r.slug })),
    ...en.map((r) => ({ locale: 'en', slug: r.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const room = await getRoomBySlug(locale, slug)
  if (!room) return {}
  return { title: room.name, description: room.shortDescription }
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const room = await getRoomBySlug(locale, slug)
  if (!room) notFound()

  const [t, tA, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'rooms' }),
    getTranslations({ locale, namespace: 'actions' }),
    getSiteSettings(locale),
  ])

  const minPrice = Math.min(...room.seasonalPrices.map((p) => p.pricePerNight))

  return (
    <>
      {/* Hero-Bild */}
      <section className="relative h-[70svh] min-h-[480px] overflow-hidden">
        {room.gallery[0] && (
          <Image
            src={room.gallery[0].src}
            alt={room.gallery[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,18,15,0.55)] via-[rgba(20,18,15,0.15)] to-transparent" />
        <div className="container-wide relative flex h-full items-end pb-12 md:pb-16">
          <div className="text-[var(--color-paper)]">
            <p className="eyebrow text-[var(--color-hay-soft)]">
              {room.sizeQm && `${room.sizeQm} m²`}
              {room.sizeQm && '  ·  '}
              {t('guests', { count: room.maxGuests })}
            </p>
            <h1 className="mt-3 font-serif text-balance">{room.name}</h1>
          </div>
        </div>
      </section>

      <section className="container-narrow py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="lead text-balance">{room.shortDescription}</p>

            {room.bedConfig && (
              <p className="mt-10 text-sm text-[var(--color-ink-mute)]">
                <span className="eyebrow mr-3 inline-block">Bett</span>
                {room.bedConfig}
              </p>
            )}

            {room.amenities.length > 0 && (
              <div className="mt-12">
                <p className="eyebrow mb-5">{t('amenitiesTitle')}</p>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-[var(--color-ink-mute)]">
                  {room.amenities.map((a) => (
                    <li key={a.id} className="flex items-center gap-2">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--color-loden)]" />
                      {a.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preise / CTA */}
          <aside className="md:col-span-5">
            <div className="border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-7">
              <p className="text-sm text-[var(--color-ink-mute)]">
                {t('from')}{' '}
                <span className="font-serif text-3xl text-[var(--color-ink)]">
                  {Math.round(minPrice)} €
                </span>{' '}
                {t('perNight')}
              </p>

              <ul className="mt-6 flex flex-col gap-3 border-t border-[var(--color-line)] pt-6 text-sm">
                {room.seasonalPrices.map((p, i) => (
                  <li key={i} className="grid grid-cols-[1fr_auto] gap-4">
                    <span className="text-[var(--color-ink-mute)]">
                      {p.seasonName}
                      {p.minStay ? ` · ${p.minStay}+ ${locale === 'en' ? 'n.' : 'Nächte'}` : ''}
                    </span>
                    <span className="font-serif tabular-nums">
                      {p.pricePerNight} €
                    </span>
                  </li>
                ))}
              </ul>

              {room.priceNote && (
                <p className="mt-5 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                  {room.priceNote}
                </p>
              )}

              <a
                href={room.bookingUrlOverride ?? settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-loden)] py-3 text-[var(--color-paper)] hover:bg-[var(--color-loden-deep)]"
              >
                {settings.bookingCtaLabel}
              </a>
            </div>

            <IntlLink
              href="/zimmer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
            >
              ← {tA('back')}
            </IntlLink>
          </aside>
        </div>

        {/* Galerie */}
        {room.gallery.length > 1 && (
          <div className="mt-24">
            <ImageGallery images={room.gallery.slice(1)} variant="editorial" />
          </div>
        )}
      </section>
    </>
  )
}
