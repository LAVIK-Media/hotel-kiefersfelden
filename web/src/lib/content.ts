/**
 * Unified Content-Layer.
 *
 * Reicht je nach Konfiguration entweder Sanity-Daten oder Mock-Daten
 * weiter. Das Frontend ruft ausschließlich diese Funktionen auf.
 *
 * Wenn `NEXT_PUBLIC_SANITY_PROJECT_ID` nicht gesetzt ist, werden die
 * Mock-Daten aus `lib/data.ts` verwendet — bewusst gleiche Form wie
 * die GROQ-Resultate.
 */

import { sanityEnabled } from './sanity'
import {
  mockActiveMenu,
  mockActivities,
  mockFaqs,
  mockOffers,
  mockRooms,
  mockSiteSettings,
} from './data'
import type { Locale } from '~/i18n/routing'

export async function getSiteSettings(locale: Locale) {
  if (!sanityEnabled) return mockSiteSettings(locale)
  // TODO Phase 3.5: GROQ-Query implementieren, sobald Sanity-Dataset deployed.
  return mockSiteSettings(locale)
}

export async function getRooms(locale: Locale) {
  if (!sanityEnabled) return mockRooms(locale)
  return mockRooms(locale)
}

export async function getRoomBySlug(locale: Locale, slug: string) {
  const rooms = await getRooms(locale)
  return rooms.find((r) => r.slug === slug)
}

export async function getActiveMenu(locale: Locale) {
  if (!sanityEnabled) return mockActiveMenu(locale)
  return mockActiveMenu(locale)
}

export async function getActivities(locale: Locale, season?: 'summer' | 'winter') {
  const all = await Promise.resolve(mockActivities(locale))
  if (!season) return all
  return all.filter((a) => a.seasons.includes(season))
}

export async function getOffers(locale: Locale) {
  if (!sanityEnabled) return mockOffers(locale)
  return mockOffers(locale)
}

export async function getFaqs(locale: Locale) {
  if (!sanityEnabled) return mockFaqs(locale)
  return mockFaqs(locale)
}
