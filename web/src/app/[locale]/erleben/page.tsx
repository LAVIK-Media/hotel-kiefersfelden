import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link as IntlLink } from '~/i18n/navigation'

import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experienceHub' })
  const title = locale === 'en' ? 'Experience' : 'Erleben'
  return { title, description: t('metaDescription') }
}

export default async function ErlebenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienceHub' })

  return (
    <>
      <Hero
        image={{
          src: '/images/hero/wandern.jpg',
          alt: locale === 'en' ? 'Hiking region around Kiefersfelden' : 'Wanderregion rund um Kiefersfelden',
          width: 2253,
          height: 1253,
        }}
        eyebrow={t('heroEyebrow')}
        headline={t('heroHeadline')}
        sub={t('heroSub')}
        size="compact"
        overlay="strong"
      />

      <section className="container-narrow py-24 md:py-28">
        <SectionIntro
          eyebrow={t('introEyebrow')}
          headline={t('introHeadline')}
          body={<p>{t('introBody')}</p>}
          className="mb-14 md:mb-20"
        />

        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <IntlLink href="/sommer" className="group surface-card surface-card-hover block overflow-hidden text-[var(--color-ink)] no-underline">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/hero/wandern.jpg"
                alt={t('summerImgAlt')}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-[var(--color-line-soft)] px-6 py-7">
              <p className="eyebrow mb-3">{locale === 'en' ? 'June – October' : 'Juni – Oktober'}</p>
              <h2 className="font-serif text-2xl tracking-tight md:text-3xl">{t('summerCardTitle')}</h2>
              <p className="mt-3 text-[var(--color-ink-mute)] leading-relaxed">{t('summerCardBody')}</p>
              <p className="mt-6 text-sm font-medium text-[var(--color-loden)]">{t('cardCta')}</p>
            </div>
          </IntlLink>

          <IntlLink href="/winter" className="group surface-card surface-card-hover block overflow-hidden text-[var(--color-ink)] no-underline">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/region/winter.jpg"
                alt={t('winterImgAlt')}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-[var(--color-line-soft)] px-6 py-7">
              <p className="eyebrow mb-3">{locale === 'en' ? 'November – Easter' : 'November – Ostern'}</p>
              <h2 className="font-serif text-2xl tracking-tight md:text-3xl">{t('winterCardTitle')}</h2>
              <p className="mt-3 text-[var(--color-ink-mute)] leading-relaxed">{t('winterCardBody')}</p>
              <p className="mt-6 text-sm font-medium text-[var(--color-loden)]">{t('cardCta')}</p>
            </div>
          </IntlLink>
        </div>
      </section>
    </>
  )
}
