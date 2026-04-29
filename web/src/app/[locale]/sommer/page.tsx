import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { OfferCard } from '~/components/ui/OfferCard'
import { getActivities, getOffers } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

export default async function SummerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [activities, offers] = await Promise.all([
    getActivities(locale, 'summer'),
    getOffers(locale),
  ])
  const summerOffers = offers.filter((o) => o.season === 'summer' || o.season === 'allyear')

  return (
    <>
      <Hero
        image={{ src: '/images/hero/wandern.jpg', alt: 'Sommer im Kaiserreich', width: 2253, height: 1253 }}
        eyebrow={locale === 'en' ? 'Summer' : 'Sommer'}
        headline={
          locale === 'en'
            ? 'Set off hiking\nwithout touching\nthe car.'
            : 'Wandern Sie los,\nohne ins Auto\nzu steigen.'
        }
        size="compact"
        overlay="strong"
      />

      <section className="container-narrow py-24 md:py-32">
        <SectionIntro
          headline={
            locale === 'en'
              ? 'A village at the foot of the mountains, with a train station opposite the front door.'
              : 'Ein Dorf am Fuß der Berge, mit dem Bahnhof gegenüber.'
          }
          body={
            <p>
              {locale === 'en'
                ? 'From Kiefersfelden you reach the Kaiser range in twenty minutes by foot. Wendelstein, Hocheck, Innsola adventure pool – everything within an arm’s length.'
                : 'Von Kiefersfelden aus sind Sie in zwanzig Minuten am Wilden Kaiser. Wendelstein, Hocheck, Erlebnisbad Innsola – alles in Reichweite.'}
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
              {act.externalUrl && (
                <a
                  href={act.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm text-[var(--color-loden)] underline-offset-4 hover:underline"
                >
                  {locale === 'en' ? 'More info' : 'Mehr Information'} ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {summerOffers.length > 0 && (
        <section className="bg-[var(--color-paper-soft)] py-24 md:py-32">
          <div className="container-narrow">
            <SectionIntro
              eyebrow={locale === 'en' ? 'Packages' : 'Pauschalen'}
              headline={locale === 'en' ? 'Summer ideas' : 'Sommer-Vorschläge'}
              small
              className="mb-12"
            />
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              {summerOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
