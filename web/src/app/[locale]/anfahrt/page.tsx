import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { MapEmbed } from '~/components/widgets/MapEmbed'
import { WeatherWidget } from '~/components/widgets/WeatherWidget'
import { getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

export default async function DirectionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [settings, t] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'directions' }),
  ])
  const geo = settings.contact.geo ?? { lat: 47.6155, lng: 12.1864 }

  return (
    <>
      <Hero
        image={{ src: '/images/hero/anfahrt.jpg', alt: 'Anfahrt nach Kiefersfelden', width: 2253, height: 1253 }}
        eyebrow={locale === 'en' ? 'Getting here' : 'Anfahrt'}
        headline={
          locale === 'en'
            ? 'Five minutes\nfrom the train,\nninety from Munich.'
            : 'Fünf Minuten\nvom Zug, neunzig\nvon München.'
        }
        size="compact"
        overlay="strong"
      />

      <section className="container-narrow py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-5">
            <SectionIntro
              headline={`${settings.contact.street}, ${settings.contact.postalCode} ${settings.contact.city}`}
              small
              body={
                <p>
                  {locale === 'en'
                    ? 'Right at Kiefersfelden train station, five minutes by foot to the Tyrolean border. Free parking on site.'
                    : 'Direkt am Bahnhof Kiefersfelden, fünf Gehminuten zur Tiroler Grenze. Parkplätze kostenlos am Haus.'}
                </p>
              }
            />

            <dl className="mt-12 space-y-10">
              <div>
                <dt className="eyebrow mb-2">{t('byCar')}</dt>
                <dd className="text-[var(--color-ink-mute)] leading-relaxed">
                  {t('byCarText')}
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">{t('byTrain')}</dt>
                <dd className="text-[var(--color-ink-mute)] leading-relaxed">
                  {t('byTrainText')}
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">{t('byPlane')}</dt>
                <dd className="text-[var(--color-ink-mute)] leading-relaxed">
                  {t('byPlaneText')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-7">
            <MapEmbed
              lat={geo.lat}
              lng={geo.lng}
              label={`${settings.contact.companyName}, ${settings.contact.street}, ${settings.contact.city}`}
            />
            <div className="mt-8">
              <WeatherWidget locale={locale} lat={geo.lat} lng={geo.lng} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
