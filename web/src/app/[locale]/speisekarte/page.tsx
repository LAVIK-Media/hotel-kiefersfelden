import { setRequestLocale, getTranslations } from 'next-intl/server'
import { MenuToday } from '~/components/ui/MenuToday'
import { getActiveMenu } from '~/lib/content'
import { jsonLdMenu } from '~/lib/seo'
import type { Locale } from '~/i18n/routing'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Menu' : 'Speisekarte' }
}

export default async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [menu, t] = await Promise.all([
    getActiveMenu(locale),
    getTranslations({ locale, namespace: 'menuToday' }),
  ])

  return (
    <article className="bg-alpine-wash border-y border-[var(--color-line-soft)] py-24 md:py-32">
      <div className="container-narrow">
      <p className="eyebrow text-center">{locale === 'en' ? 'Menu' : 'Speisekarte'}</p>
      <h1 className="mt-3 text-center font-serif text-balance">
        {menu?.title ?? t('standardTitle')}
      </h1>

      <div className="mt-16">
        <div className="surface-card surface-card-hover p-6 md:p-10">
          <MenuToday menu={menu} variant="full" />
        </div>
      </div>

      {menu && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMenu(menu, locale)) }}
        />
      )}
      </div>
    </article>
  )
}
