import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { OfferCard } from '~/components/ui/OfferCard'
import { getActivities, getOffers } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

export default async function WinterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [activities, offers] = await Promise.all([
    getActivities(locale, 'winter'),
    getOffers(locale),
  ])
  const winterOffers = offers.filter((o) => o.season === 'winter' || o.season === 'allyear')

  return (
    <>
      <Hero
        image={{ src: '/images/region/winter.jpg', alt: 'Winter in Kiefersfelden', width: 2253, height: 1253 }}
        eyebrow={locale === 'en' ? 'Winter' : 'Winter'}
        headline={
          locale === 'en'
            ? 'Hocheck.\nWendelstein.\nA warm parlour.'
            : 'Hocheck.\nWendelstein.\nWarme Stube.'
        }
        size="compact"
        overlay="strong"
        imagePosition="50% 30%"
      />

      <section className="container-narrow py-24 md:py-32">
        <SectionIntro
          headline={
            locale === 'en'
              ? 'A short ski day, a long evening.'
              : 'Ein kurzer Skitag, ein langer Abend.'
          }
          body={
            <p>
              {locale === 'en'
                ? 'The Hocheck ski resort is five kilometres from the door, family-friendly, with night skiing. Cross-country trails through the valley start at the train station.'
                : 'Das Hocheck liegt fünf Kilometer vor der Tür – familienfreundlich, mit Nachtskifahren. Loipen durchs Tal beginnen am Bahnhof.'}
            </p>
          }
          className="mb-20"
        />

        <div className="grid gap-16 md:grid-cols-2">
          {activities.map((act, i) => (
            <article key={act.id} className={i % 2 === 1 ? 'md:mt-16' : ''}>
              {act.gallery?.[0] && (
                <Image
                  src={act.gallery[0].src}
                  alt={act.gallery[0].alt}
                  width={act.gallery[0].width ?? 1200}
                  height={act.gallery[0].height ?? 800}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <p className="eyebrow mt-5">{act.category}{act.distanceKm ? ` · ${act.distanceKm} km` : ''}</p>
              <h3 className="mt-2 font-serif text-2xl">{act.title}</h3>
              <p className="mt-3 text-[var(--color-ink-mute)] leading-relaxed">
                {act.shortDescription}
              </p>
            </article>
          ))}
        </div>
      </section>

      {winterOffers.length > 0 && (
        <section className="bg-[var(--color-paper-soft)] py-24 md:py-32">
          <div className="container-narrow">
            <SectionIntro
              eyebrow={locale === 'en' ? 'Packages' : 'Pauschalen'}
              headline={locale === 'en' ? 'Winter ideas' : 'Winter-Vorschläge'}
              small
              className="mb-12"
            />
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              {winterOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
