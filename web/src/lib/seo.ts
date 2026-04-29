/**
 * Schema.org JSON-LD-Helper.
 *
 * Wir liefern eine zentrale, side-wide Aussage über das Haus
 * (Hotel + Restaurant + LocalBusiness) im Locale-Layout. Detail-Seiten
 * (Speisekarte, Zimmer-Details) ergänzen seitenspezifisches LD bei Bedarf.
 */

import { getSiteSettings } from './content'
import type { Locale } from '~/i18n/routing'
import type { Menu } from './types'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hotel-kiefersfelden.de'

export async function jsonLdSiteWide(locale: Locale) {
  const s = await getSiteSettings(locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Hotel',
        '@id': `${baseUrl}/#hotel`,
        name: s.siteName,
        url: baseUrl,
        telephone: s.contact.phone,
        email: s.contact.email,
        slogan: s.tagline,
        starRating: undefined, // gegebenenfalls einsetzen, wenn Klassifizierung bekannt
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.contact.street,
          postalCode: s.contact.postalCode,
          addressLocality: s.contact.city,
          addressCountry: 'DE',
        },
        geo: s.contact.geo
          ? {
              '@type': 'GeoCoordinates',
              latitude: s.contact.geo.lat,
              longitude: s.contact.geo.lng,
            }
          : undefined,
        foundingDate: `${s.foundingYear}`,
        priceRange: '€€',
        image: [`${baseUrl}/images/hero/home.jpg`],
        sameAs: s.holidayCheck?.profileUrl ? [s.holidayCheck.profileUrl] : [],
        aggregateRating: s.holidayCheck?.recommendationRate
          ? {
              '@type': 'AggregateRating',
              ratingValue: ((s.holidayCheck.recommendationRate / 100) * 5).toFixed(1),
              bestRating: '5',
              ratingCount: s.holidayCheck.reviewCount ?? 1,
            }
          : undefined,
      },
      {
        '@type': 'Restaurant',
        '@id': `${baseUrl}/#restaurant`,
        name: `${s.siteName} – Restaurant`,
        url: `${baseUrl}${locale === 'en' ? '/en' : ''}/restaurant`,
        servesCuisine: ['Bavarian', 'Regional'],
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.contact.street,
          postalCode: s.contact.postalCode,
          addressLocality: s.contact.city,
          addressCountry: 'DE',
        },
      },
    ],
  }
}

export function jsonLdMenu(menu: Menu, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: menu.title,
    inLanguage: locale,
    hasMenuSection: menu.sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          price: item.price.toFixed(2),
          priceCurrency: 'EUR',
        },
        suitableForDiet: [
          item.isVegetarian ? 'https://schema.org/VegetarianDiet' : undefined,
          item.isVegan ? 'https://schema.org/VeganDiet' : undefined,
        ].filter(Boolean),
      })),
    })),
  }
}
