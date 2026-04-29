import type { MetadataRoute } from 'next'
import { routing } from '~/i18n/routing'
import { getRooms } from '~/lib/content'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hotel-kiefersfelden.de'

const STATIC_PATHS = [
  '',
  '/hotel',
  '/zimmer',
  '/restaurant',
  '/speisekarte',
  '/sommer',
  '/winter',
  '/anfahrt',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`

    // Statische Seiten
    for (const p of STATIC_PATHS) {
      out.push({
        url: `${baseUrl}${prefix}${p}`,
        lastModified: new Date(),
        changeFrequency: p === '' ? 'weekly' : 'monthly',
        priority: p === '' ? 1.0 : 0.7,
      })
    }

    // Zimmer-Detail-Seiten
    const rooms = await getRooms(locale)
    for (const r of rooms) {
      out.push({
        url: `${baseUrl}${prefix}/zimmer/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return out
}
