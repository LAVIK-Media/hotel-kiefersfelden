import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { RoomCard } from '~/components/ui/RoomCard'
import { getRooms } from '~/lib/content'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Rooms' : 'Zimmer' }
}

export default async function RoomsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [rooms, t] = await Promise.all([getRooms(locale), getTranslations({ locale, namespace: 'home' })])

  return (
    <>
      <Hero
        image={{ src: '/images/hero/zimmer.jpg', alt: 'Zimmer im Hotel zur Post', width: 2253, height: 1253 }}
        eyebrow={t('roomsEyebrow')}
        headline={locale === 'en' ? 'Rooms.\n25 of them.\nQuiet ones.' : 'Zimmer.\n25 Stück.\nIn Ruhe.'}
        sub={locale === 'en' ? '14–75 m². One lift. No fuss.' : '14–75 m². Ein Lift. Kein Trubel.'}
        size="compact"
        overlay="strong"
        imagePosition="50% 65%"
      />

      <section className="container-narrow py-24 md:py-32">
        <SectionIntro
          headline={t('roomsHeadline')}
          body={<p>{t('roomsBody')}</p>}
          className="mb-20"
        />
        <div className="flex flex-col gap-24 md:gap-32">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} flip={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  )
}
