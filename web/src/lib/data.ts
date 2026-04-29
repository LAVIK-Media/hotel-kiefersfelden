/**
 * Mock-Daten — Spiegelung des Phase-2-Seeds in Frontend-resolvierten Typen.
 *
 * Wird verwendet, solange das Sanity-Dataset noch nicht deployed ist.
 * Vorteil: Frontend kann komplett gegen die finalen Daten-Strukturen
 * entwickelt werden, Designer:innen sehen realistische Inhalte, und
 * sobald Phase 2 deployed ist, schaltet `lib/content.ts` automatisch
 * auf das Live-Dataset um.
 *
 * Alle Bilder verweisen auf `/images/...` aus `web/public/images/` —
 * kuratiert aus `discovery/assets/images/`. Sanity Image Pipeline
 * übernimmt sobald live.
 */

import type {
  Activity,
  Amenity,
  FaqEntry,
  Menu,
  Offer,
  Room,
  SiteSettings,
} from './types'
import { resolveLocalized } from './content-helpers'
import type { Locale } from '~/i18n/routing'

// ─────────────────────────────────────────────────────────────────
//  Site-Settings
// ─────────────────────────────────────────────────────────────────

export const mockSiteSettings = (locale: Locale): SiteSettings => ({
  siteName: 'Hotel zur Post Kiefersfelden',
  tagline: resolveLocalized(
    {
      de: 'Wo Bayerische Gastlichkeit zuhause ist.',
      en: 'Where Bavarian hospitality is at home.',
    },
    locale,
  ),
  foundingYear: 1820,
  contact: {
    companyName: 'Gasthof Hotel zur Post',
    street: 'Bahnhofstraße 22-26',
    postalCode: '83088',
    city: 'Kiefersfelden',
    country: locale === 'en' ? 'Germany' : 'Deutschland',
    phone: '+49 8033 308390',
    fax: '+49 8033 3083918',
    email: 'info@hotel-kiefersfelden.de',
    geo: { lat: 47.6155, lng: 12.1864 },
  },
  bookingUrl: 'https://v4.ibe.dirs21.de/channels/hotel-kiefersfeldende',
  bookingCtaLabel: locale === 'en' ? 'Book directly' : 'Direkt buchen',
  receptionHours: resolveLocalized(
    {
      de: 'Anreise bis 22:00 Uhr möglich. Spätere Anreise nach Absprache.',
      en: 'Check-in until 10 p.m. Later arrival on request.',
    },
    locale,
  ),
  holidayCheck: {
    recommendationRate: 96,
    reviewCount: 184,
    badges: [2024, 2025, 2026],
    profileUrl: 'https://www.holidaycheck.de/hi/hotel-zur-post-kiefersfelden',
  },
  navigation: {
    header: [
      { label: locale === 'en' ? 'Hotel' : 'Hotel', href: '/hotel' },
      { label: locale === 'en' ? 'Rooms' : 'Zimmer', href: '/zimmer' },
      { label: locale === 'en' ? 'Restaurant' : 'Restaurant', href: '/restaurant' },
      { label: locale === 'en' ? 'Experience' : 'Erleben', href: '/erleben' },
      { label: locale === 'en' ? 'Getting here' : 'Anfahrt', href: '/anfahrt' },
      { label: locale === 'en' ? 'Contact' : 'Kontakt', href: '/kontakt' },
    ],
    footer: [
      { label: locale === 'en' ? 'Menu' : 'Speisekarte', href: '/speisekarte' },
      { label: locale === 'en' ? 'Summer' : 'Sommer', href: '/sommer' },
      { label: locale === 'en' ? 'Winter' : 'Winter', href: '/winter' },
      { label: 'HolidayCheck', href: 'https://www.holidaycheck.de/hi/hotel-zur-post-kiefersfelden', external: true },
    ],
    footerLegal: [
      { label: locale === 'en' ? 'Imprint' : 'Impressum', href: '/impressum' },
      { label: locale === 'en' ? 'Privacy' : 'Datenschutz', href: '/datenschutz' },
      { label: locale === 'en' ? 'Terms' : 'AGB', href: '/agb' },
    ],
  },
})

// ─────────────────────────────────────────────────────────────────
//  Amenities (Stubs für Zimmer-Referenzen)
// ─────────────────────────────────────────────────────────────────

const A = (id: string, de: string, en: string, category: Amenity['category']): Amenity => ({
  id,
  name: '', // wird via resolve gesetzt — siehe Funktion unten
  category,
  // hier Hack: wir speichern de+en als JSON, der Resolver entscheidet
})

const amenitySources = [
  { id: 'wifi', de: 'WLAN kostenlos', en: 'Free Wi-Fi', cat: 'tech' as const },
  { id: 'tv', de: 'Flachbild-TV', en: 'Flat-screen TV', cat: 'tech' as const },
  { id: 'phone', de: 'Telefon', en: 'Phone', cat: 'tech' as const },
  { id: 'safe', de: 'Safe', en: 'Safe', cat: 'comfort' as const },
  { id: 'hairdryer', de: 'Föhn', en: 'Hairdryer', cat: 'bath' as const },
  { id: 'shower', de: 'Dusche', en: 'Shower', cat: 'bath' as const },
  { id: 'bathtub', de: 'Badewanne', en: 'Bathtub', cat: 'bath' as const },
  { id: 'balcony', de: 'Balkon', en: 'Balcony', cat: 'view' as const },
  { id: 'mountainview', de: 'Bergblick', en: 'Mountain view', cat: 'view' as const },
  { id: 'nonsmoking', de: 'Nichtraucherzimmer', en: 'Non-smoking', cat: 'comfort' as const },
  { id: 'lift', de: 'Personenlift', en: 'Elevator', cat: 'accessibility' as const },
  { id: 'family', de: 'Familienzimmer', en: 'Family-friendly', cat: 'family' as const },
  { id: 'parking', de: 'Parkplatz am Haus', en: 'On-site parking', cat: 'comfort' as const },
]

export const mockAmenities = (locale: Locale): Amenity[] =>
  amenitySources.map((a) => ({
    id: a.id,
    name: locale === 'en' ? a.en : a.de,
    category: a.cat,
  }))

const pickAmenities = (locale: Locale, ids: string[]): Amenity[] =>
  mockAmenities(locale).filter((a) => ids.includes(a.id))

// ─────────────────────────────────────────────────────────────────
//  Rooms
// ─────────────────────────────────────────────────────────────────

export const mockRooms = (locale: Locale): Room[] => {
  const today = new Date().toISOString().slice(0, 10)
  const yearEnd = `${new Date().getFullYear()}-12-31`
  const baseAm = ['wifi', 'tv', 'phone', 'hairdryer', 'shower', 'nonsmoking', 'lift']

  return [
    {
      id: 'room-doppelzimmer',
      slug: locale === 'en' ? 'double-room' : 'doppelzimmer',
      name: locale === 'en' ? 'Double Room' : 'Doppelzimmer',
      shortDescription:
        locale === 'en'
          ? 'A spacious double with shower or bath. Quiet, with a view across the village.'
          : 'Geräumiges Doppelzimmer mit Dusche oder Bad. Ruhig, mit Blick übers Dorf.',
      roomType: 'double',
      sizeQm: 22,
      maxGuests: 2,
      bedConfig: locale === 'en' ? '1 king bed or 2 twin beds' : '1 Doppelbett 1,80 m oder 2 Einzelbetten',
      amenities: pickAmenities(locale, [...baseAm, 'bathtub']),
      seasonalPrices: [
        {
          seasonName: locale === 'en' ? 'From 3 nights' : 'Ab 3 Nächten',
          validFrom: today,
          validUntil: yearEnd,
          pricePerNight: 112,
          minStay: 3,
          includes: locale === 'en' ? 'incl. breakfast' : 'inkl. Frühstück',
        },
        {
          seasonName: locale === 'en' ? 'Short stay 1–2 nights' : 'Kurzaufenthalt 1–2 Nächte',
          validFrom: today,
          validUntil: yearEnd,
          pricePerNight: 120,
          minStay: 1,
          includes: locale === 'en' ? 'incl. breakfast' : 'inkl. Frühstück',
        },
      ],
      priceNote: locale === 'en' ? 'Half-board surcharge €25 / person / day.' : 'Halbpensions-Zuschlag 25 € / Person / Tag.',
      gallery: [
        { src: '/images/rooms/doppelzimmer.jpg', alt: locale === 'en' ? 'Double room' : 'Doppelzimmer', width: 2230, height: 1134 },
        { src: '/images/rooms/doppelzimmer-fruehstueck.jpg', alt: locale === 'en' ? 'Double room with breakfast' : 'Doppelzimmer mit Frühstück', width: 2230, height: 1134 },
        { src: '/images/rooms/badezimmer.jpg', alt: locale === 'en' ? 'Bathroom' : 'Badezimmer', width: 1024, height: 709 },
      ],
      orderRank: 20,
    },
    {
      id: 'room-einzelzimmer',
      slug: locale === 'en' ? 'single-room' : 'einzelzimmer',
      name: locale === 'en' ? 'Single Room' : 'Einzelzimmer',
      shortDescription:
        locale === 'en'
          ? 'Compact single with shower, hairdryer and flat-screen TV.'
          : 'Komfortables Einzelzimmer mit Dusche/WC, Föhn und Flachbild-TV.',
      roomType: 'single',
      sizeQm: 14,
      maxGuests: 1,
      bedConfig: locale === 'en' ? '1 single bed' : '1 Einzelbett',
      amenities: pickAmenities(locale, baseAm),
      seasonalPrices: [
        {
          seasonName: locale === 'en' ? 'Standard rate from 3 nights' : 'Standardpreis ab 3 Nächten',
          validFrom: today,
          validUntil: yearEnd,
          pricePerNight: 74,
          minStay: 3,
          includes: locale === 'en' ? 'incl. breakfast, VAT and tourist tax' : 'inkl. Frühstücksbuffet, MwSt. und Kurtaxe',
        },
      ],
      gallery: [
        { src: '/images/rooms/zimmer-allgemein.jpg', alt: locale === 'en' ? 'Room' : 'Zimmer', width: 2230, height: 1134 },
      ],
      orderRank: 10,
    },
    {
      id: 'room-familienzimmer',
      slug: locale === 'en' ? 'family-room' : 'familienzimmer',
      name: locale === 'en' ? 'Family Room' : 'Familienzimmer',
      shortDescription:
        locale === 'en'
          ? 'Spacious family room for 3–4 guests, with optional connecting door.'
          : 'Großzügiges Familienzimmer für 3–4 Personen mit Verbindungstür-Option.',
      roomType: 'family',
      sizeQm: 32,
      maxGuests: 4,
      bedConfig: locale === 'en' ? '1 double bed + 2 single beds' : '1 Doppelbett + 2 Einzelbetten',
      amenities: pickAmenities(locale, [...baseAm, 'family']),
      seasonalPrices: [
        {
          seasonName: locale === 'en' ? 'Standard rate' : 'Standardpreis',
          validFrom: today,
          validUntil: yearEnd,
          pricePerNight: 145,
          includes: locale === 'en' ? 'incl. breakfast, VAT and tourist tax' : 'inkl. Frühstück, MwSt. und Kurtaxe',
        },
      ],
      gallery: [
        { src: '/images/rooms/dreibettzimmer.jpg', alt: locale === 'en' ? 'Family room' : 'Familienzimmer', width: 2230, height: 1134 },
      ],
      orderRank: 30,
    },
    {
      id: 'room-ferienhaus',
      slug: locale === 'en' ? 'holiday-house' : 'ferienhaus',
      name: locale === 'en' ? 'Holiday House' : 'Ferienhaus',
      shortDescription:
        locale === 'en'
          ? 'Standalone house with kitchen-living room and garden – ideal for longer stays.'
          : 'Eigenständiges Ferienhaus mit Wohnküche und Garten – ideal für längere Aufenthalte.',
      roomType: 'apartment',
      sizeQm: 75,
      maxGuests: 5,
      amenities: pickAmenities(locale, [...baseAm, 'family']),
      seasonalPrices: [
        {
          seasonName: locale === 'en' ? 'Standard rate' : 'Standardpreis',
          validFrom: today,
          validUntil: yearEnd,
          pricePerNight: 180,
          minStay: 3,
          includes: locale === 'en' ? 'incl. final cleaning' : 'inkl. Endreinigung',
        },
      ],
      gallery: [
        { src: '/images/rooms/ferienhaus-zimmer.jpg', alt: locale === 'en' ? 'Holiday house bedroom' : 'Ferienhaus, Zimmer', width: 1417, height: 720 },
        { src: '/images/rooms/ferienhaus-kueche.jpg', alt: locale === 'en' ? 'Holiday house kitchen' : 'Ferienhaus, Küche', width: 1536, height: 1436 },
      ],
      orderRank: 40,
    },
  ]
}

// ─────────────────────────────────────────────────────────────────
//  Activities
// ─────────────────────────────────────────────────────────────────

export const mockActivities = (locale: Locale): Activity[] => [
  {
    id: 'kutschenfahrt',
    slug: 'kutschenfahrt',
    title: locale === 'en' ? 'Carriage ride with the innkeeper' : 'Kutschenfahrt mit dem Hotelwirt',
    shortDescription:
      locale === 'en'
        ? 'Andi Pfeiffer himself harnesses the horse and takes you through Kaiserreich.'
        : 'Andi Pfeiffer spannt persönlich das Pferd ein und chauffiert Sie durchs Kaiserreich.',
    category: 'carriage',
    seasons: ['spring', 'summer', 'autumn'],
    gallery: [{ src: '/images/region/kutschenfahrt.jpg', alt: locale === 'en' ? 'Carriage ride' : 'Kutschenfahrt', width: 1134, height: 493 }],
    orderRank: 5,
  },
  {
    id: 'bergwandern',
    slug: 'bergwandern',
    title: locale === 'en' ? 'Mountain hiking in Kaiserreich' : 'Bergwandern im Kaiserreich',
    shortDescription:
      locale === 'en'
        ? 'Direct access from the hotel to trails on the Kaiser and Wendelstein ranges.'
        : 'Vom Hotel aus direkt in die Wandergebiete am Kaiser- und Wendelsteinmassiv.',
    category: 'hiking',
    seasons: ['spring', 'summer', 'autumn'],
    gallery: [{ src: '/images/region/wandern.jpg', alt: locale === 'en' ? 'Hiking' : 'Wandern', width: 1134, height: 493 }],
    orderRank: 10,
  },
  {
    id: 'hocheck-skigebiet',
    slug: 'hocheck-skigebiet',
    title: locale === 'en' ? 'Hocheck ski resort' : 'Skigebiet Hocheck Oberaudorf',
    shortDescription:
      locale === 'en'
        ? 'Family-friendly ski area with night skiing — 5 km from the hotel.'
        : 'Familienfreundliches Skigebiet mit Nachtskifahren — 5 km vom Hotel entfernt.',
    category: 'ski',
    seasons: ['winter'],
    distanceKm: 5,
    externalUrl: 'https://www.hocheck.com/',
    gallery: [{ src: '/images/region/winter.jpg', alt: 'Skigebiet Hocheck', width: 1134, height: 493 }],
    orderRank: 20,
  },
]

// ─────────────────────────────────────────────────────────────────
//  Menu — eine Demo-Standardkarte
// ─────────────────────────────────────────────────────────────────

export const mockActiveMenu = (locale: Locale): Menu => ({
  id: 'menu-standard',
  type: 'standardkarte',
  title: locale === 'en' ? 'Main menu' : 'Hauskarte',
  introNote:
    locale === 'en'
      ? 'A small selection from our daily kitchen — sausages from our own butchery, classics from grandma’s cookbook, and what the season offers.'
      : 'Eine kleine Auswahl aus unserer Küche — Würstl aus eigener Metzgerei, Klassiker aus Omas Kochbuch und was die Saison gibt.',
  sections: [
    {
      name: locale === 'en' ? 'Starters' : 'Vorspeisen',
      items: [
        {
          name: locale === 'en' ? 'Beef broth with pancake strips' : 'Rinderbrühe mit Frittaten',
          description: locale === 'en' ? 'with chives' : 'mit Schnittlauch',
          price: 6.5,
          allergens: ['1', '3', '7', '9'],
        },
        {
          name: locale === 'en' ? 'House charcuterie board' : 'Brotzeitteller aus dem Haus',
          description:
            locale === 'en'
              ? 'sausages and ham from our butchery, with horseradish and farmer’s bread'
              : 'Wurst und Schinken aus eigener Metzgerei, mit Kren und Bauernbrot',
          price: 14.5,
          allergens: ['1', '7'],
          isHouseRecommendation: true,
        },
      ],
    },
    {
      name: locale === 'en' ? 'Main courses' : 'Hauptspeisen',
      items: [
        {
          name: locale === 'en' ? 'Veal Wiener Schnitzel' : 'Wiener Schnitzel vom Kalb',
          description:
            locale === 'en'
              ? 'with French fries and lingonberries'
              : 'mit Pommes Frites und Preiselbeeren',
          price: 24.5,
          allergens: ['1', '3', '7'],
          isHouseRecommendation: true,
        },
        {
          name: locale === 'en' ? 'Sausages from our butchery' : 'Würstl aus eigener Metzgerei',
          description:
            locale === 'en'
              ? 'with homemade sauerkraut and farmer’s bread'
              : 'mit Hausmacher-Sauerkraut und Bauernbrot',
          price: 13.9,
          allergens: ['1', '7'],
        },
        {
          name: locale === 'en' ? 'Roast venison from local hunt' : 'Hirschbraten aus heimischer Jagd',
          description:
            locale === 'en'
              ? 'with potato dumpling and red cabbage'
              : 'mit Kartoffelknödel und Blaukraut',
          price: 26.5,
          allergens: ['1', '7', '9'],
        },
        {
          name: locale === 'en' ? 'Cheese spaetzle' : 'Käsespätzle',
          description:
            locale === 'en'
              ? 'with roasted onions and a small green salad'
              : 'mit Röstzwiebeln und kleinem Salat',
          price: 14.5,
          allergens: ['1', '3', '7'],
          isVegetarian: true,
        },
      ],
    },
    {
      name: locale === 'en' ? 'Desserts' : 'Süße Schmankerl',
      items: [
        {
          name: locale === 'en' ? 'Homemade Kaiserschmarrn' : 'Hausgemachter Kaiserschmarrn',
          description:
            locale === 'en'
              ? 'with apple sauce or plum compote'
              : 'mit Apfelmus oder Zwetschgenröster',
          price: 12.5,
          allergens: ['1', '3', '7'],
          isVegetarian: true,
          isHouseRecommendation: true,
        },
      ],
    },
  ],
  footerNote:
    locale === 'en'
      ? 'All prices in EUR incl. VAT. Full allergen list on request.'
      : 'Alle Preise in EUR inkl. gesetzlicher MwSt. Vollständige Allergenliste auf Anfrage.',
  isPublished: true,
})

// ─────────────────────────────────────────────────────────────────
//  Offers (Pauschalen)
// ─────────────────────────────────────────────────────────────────

export const mockOffers = (locale: Locale): Offer[] => [
  {
    id: 'offer-sommer',
    slug: 'sommer-im-kaiserreich',
    title: locale === 'en' ? 'Summer in the Kaiserreich' : 'Sommer im Kaiserreich',
    shortDescription:
      locale === 'en'
        ? 'Three nights with breakfast, one carriage ride and a Wendelstein day-pass.'
        : 'Drei Nächte mit Frühstück, eine Kutschenfahrt und ein Wendelstein-Tagesticket.',
    season: 'summer',
    price: 295,
    pricePerPerson: true,
    minStay: 3,
    gallery: [{ src: '/images/region/sommer.jpg', alt: 'Sommer', width: 1134, height: 493 }],
  },
  {
    id: 'offer-wintertraum',
    slug: 'wintertraum',
    title: locale === 'en' ? 'Winter dreams' : 'Wintertraum',
    shortDescription:
      locale === 'en'
        ? 'Two nights with half board, one ski day at Hocheck included.'
        : 'Zwei Nächte mit Halbpension, ein Skitag am Hocheck inklusive.',
    season: 'winter',
    price: 219,
    pricePerPerson: true,
    minStay: 2,
    gallery: [{ src: '/images/region/winter.jpg', alt: 'Winter', width: 1134, height: 493 }],
  },
]

// ─────────────────────────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────────────────────────

export const mockFaqs = (locale: Locale): FaqEntry[] => [
  {
    id: 'checkin-time',
    category: 'arrival',
    question: locale === 'en' ? 'Until what time can I check in?' : 'Bis wann ist eine Anreise möglich?',
    answer:
      locale === 'en'
        ? 'Check-in is possible until 10:00 p.m. Later arrival on request.'
        : 'Anreise ist bis 22:00 Uhr möglich. Spätere Anreise nach Absprache.',
  },
  {
    id: 'parking',
    category: 'parking',
    question: locale === 'en' ? 'Is there parking on site?' : 'Gibt es Parkplätze am Hotel?',
    answer:
      locale === 'en'
        ? 'Yes, free parking is available on site.'
        : 'Ja, Parkplätze stehen kostenfrei am Haus zur Verfügung.',
  },
  {
    id: 'lift',
    category: 'accessibility',
    question: locale === 'en' ? 'Does the hotel have an elevator?' : 'Hat das Hotel einen Aufzug?',
    answer:
      locale === 'en'
        ? 'Yes, all 25 rooms are accessible by elevator.'
        : 'Ja, alle 25 Zimmer sind bequem über einen Personenlift erreichbar.',
  },
]
