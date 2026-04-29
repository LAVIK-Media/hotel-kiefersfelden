/**
 * Geteilte Domain-Typen — entsprechen den Sanity-Schemas aus Phase 2,
 * sind aber bewusst vereinfacht/locale-resolviert für die Frontend-Nutzung.
 *
 * Frontend bekommt aus `lib/content.ts` immer schon das passende Locale-
 * Feld als plain string – keine internationalizedArrays mehr.
 */

import type { Locale } from '~/i18n/routing'

export type LocalizedString = { de: string; en?: string }
export type ResolvedString = string

export type ImageRef = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type SeasonalPrice = {
  seasonName: ResolvedString
  validFrom: string
  validUntil: string
  pricePerNight: number
  minStay?: number
  includes?: ResolvedString
}

export type Amenity = {
  id: string
  name: ResolvedString
  category: 'bath' | 'comfort' | 'tech' | 'view' | 'family' | 'accessibility' | 'other'
  icon?: string
}

export type Room = {
  id: string
  slug: string
  name: ResolvedString
  shortDescription: ResolvedString
  description?: string
  roomType: 'single' | 'double' | 'triple' | 'family' | 'suite' | 'apartment'
  sizeQm?: number
  maxGuests: number
  bedConfig?: ResolvedString
  amenities: Amenity[]
  seasonalPrices: SeasonalPrice[]
  priceNote?: ResolvedString
  gallery: ImageRef[]
  bookingUrlOverride?: string
  orderRank?: number
}

export type MenuItemRef = {
  name: ResolvedString
  description?: ResolvedString
  price: number
  allergens?: string[]
  additives?: string[]
  isVegetarian?: boolean
  isVegan?: boolean
  isHouseRecommendation?: boolean
  image?: ImageRef
}

export type MenuSection = {
  name: ResolvedString
  note?: ResolvedString
  items: MenuItemRef[]
}

export type Menu = {
  id: string
  type: 'tageskarte' | 'wochenkarte' | 'standardkarte' | 'saisonkarte'
  title: ResolvedString
  date?: string
  validFrom?: string
  validUntil?: string
  introNote?: ResolvedString
  sections: MenuSection[]
  footerNote?: ResolvedString
  isPublished: boolean
}

export type Activity = {
  id: string
  slug: string
  title: ResolvedString
  shortDescription: ResolvedString
  category: string
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>
  distanceKm?: number
  duration?: ResolvedString
  difficulty?: string
  externalUrl?: string
  gallery?: ImageRef[]
  orderRank?: number
}

export type Offer = {
  id: string
  slug: string
  title: ResolvedString
  shortDescription: ResolvedString
  season: 'summer' | 'autumn' | 'winter' | 'spring' | 'allyear'
  price: number
  pricePerPerson: boolean
  minStay?: number
  bookingUrl?: string
  gallery?: ImageRef[]
}

export type FaqEntry = {
  id: string
  category: string
  question: ResolvedString
  answer: ResolvedString
}

export type NavItem = {
  label: ResolvedString
  href: string
  external?: boolean
  children?: NavItem[]
}

export type SiteSettings = {
  siteName: ResolvedString
  tagline: ResolvedString
  foundingYear: number
  contact: {
    companyName: string
    street: string
    postalCode: string
    city: string
    country: string
    phone: string
    fax?: string
    email: string
    geo?: { lat: number; lng: number }
  }
  bookingUrl: string
  bookingCtaLabel: ResolvedString
  receptionHours?: ResolvedString
  holidayCheck?: {
    score?: number
    recommendationRate?: number
    reviewCount?: number
    profileUrl?: string
    badges?: number[]
  }
  navigation: {
    header: NavItem[]
    footer: NavItem[]
    footerLegal: NavItem[]
  }
}

export type ResolveOptions = { locale: Locale }
