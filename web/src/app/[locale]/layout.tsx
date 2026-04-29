import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { routing } from '~/i18n/routing'
import { Header } from '~/components/layout/Header'
import { Footer } from '~/components/layout/Footer'
import { BookingBar } from '~/components/layout/BookingBar'
import { CookieNotice } from '~/components/layout/CookieNotice'
import { getSiteSettings } from '~/lib/content'
import { jsonLdSiteWide } from '~/lib/seo'

// Cloudflare Pages / Edge Runtime (required by next-on-pages)
export const runtime = 'edge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale as 'de' | 'en')
  const isEn = locale === 'en'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hotel-kiefersfelden.de'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.siteName,
      template: `%s — ${settings.siteName}`,
    },
    description: isEn
      ? 'Family-run inn at the Tyrolean border. 25 rooms, in-house butchery, Bavarian cuisine since 1820.'
      : 'Familiengeführter Gasthof an der Tiroler Grenze. 25 Zimmer, eigene Metzgerei, bayerische Küche seit 1820.',
    alternates: {
      canonical: '/',
      languages: {
        de: '/',
        en: '/en',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_GB' : 'de_DE',
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.tagline,
      images: [
        { url: '/images/hero/home.jpg', width: 2253, height: 1253, alt: settings.siteName },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.tagline,
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()
  const ldJson = await jsonLdSiteWide(locale as 'de' | 'en')

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header locale={locale as 'de' | 'en'} />
      <main id="main" className="pb-32 md:pb-0">
        {children}
      </main>
      <Footer locale={locale as 'de' | 'en'} />
      <BookingBar locale={locale as 'de' | 'en'} />
      <CookieNotice />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </NextIntlClientProvider>
  )
}
