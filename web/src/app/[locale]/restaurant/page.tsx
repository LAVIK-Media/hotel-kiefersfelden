import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link as IntlLink } from '~/i18n/navigation'

import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { MenuToday } from '~/components/ui/MenuToday'
import { getActiveMenu } from '~/lib/content'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: 'Restaurant', description: locale === 'en' ? 'Bavarian cuisine, our own butchery, beer garden.' : 'Bayerische Küche, eigene Metzgerei, Biergarten.' }
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [menu, tA] = await Promise.all([
    getActiveMenu(locale),
    getTranslations({ locale, namespace: 'actions' }),
  ])

  return (
    <>
      <Hero
        image={{ src: '/images/hero/restaurant.jpg', alt: 'Restaurant Hotel zur Post', width: 2253, height: 1253 }}
        eyebrow={locale === 'en' ? 'Restaurant' : 'Restaurant'}
        headline={
          locale === 'en'
            ? 'A kitchen that\nstarted at the\nbutcher this morning.'
            : 'Eine Küche, die\nheute Morgen beim\nMetzger anfing.'
        }
        sub={
          locale === 'en'
            ? 'Bavarian classics, game from local hunt, sausages from our own butchery one floor below. A beer garden when the sun is out.'
            : 'Bayerische Klassiker, Wild aus heimischer Jagd, Würstl aus eigener Metzgerei einen Stock tiefer. Biergarten, wenn die Sonne mitspielt.'
        }
        size="compact"
        overlay="strong"
      />

      {/* USP – wie andere Unterseiten (extra Top-Padding erzeugte schlechteres „Hochscrollen“) */}
      <section className="container-narrow py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <figure className="surface-card surface-card-hover overflow-hidden md:col-span-6">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/region/biergarten.jpg"
                alt={locale === 'en' ? 'Beer garden, Hotel zur Post' : 'Biergarten, Hotel zur Post'}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
          <div className="md:col-span-6">
            <SectionIntro
              eyebrow={locale === 'en' ? 'Our butchery' : 'Eigene Metzgerei'}
              small
              headline={
                locale === 'en'
                  ? 'Sausages, hams and the Sunday roast – from our own butchery, one floor down.'
                  : 'Wurst, Schinken und der Sonntagsbraten – aus der eigenen Metzgerei einen Stock tiefer.'
              }
              body={
                <p>
                  {locale === 'en'
                    ? 'Buying meat we don’t know is harder than buying meat we do. So we don’t.'
                    : 'Fleisch zu kaufen, das wir nicht kennen, ist schwerer, als Fleisch zu kaufen, das wir kennen. Also tun wir es nicht.'}
                </p>
              }
            />
          </div>
        </div>
      </section>

      {/* Speisekarte heute */}
      <section className="bg-[var(--color-paper-soft)] py-24 md:py-32">
        <div className="container-narrow">
          <div className="surface-card surface-card-hover p-6 md:p-10">
            <MenuToday menu={menu} variant="full" />
          </div>
          <div className="mt-12 flex justify-center">
            <IntlLink
              href="/speisekarte"
              className="gasthof-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide text-[var(--color-paper)] shadow-[var(--shadow-soft)] ring-2 ring-[color-mix(in_srgb,var(--color-loewengold)_38%,transparent)]"
            >
              {tA('viewMenu')}
            </IntlLink>
          </div>
        </div>
      </section>
    </>
  )
}
