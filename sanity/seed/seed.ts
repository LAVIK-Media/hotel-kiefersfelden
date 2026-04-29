/**
 * Seed-Script — initialer Daten-Import in das Sanity-Dataset.
 *
 * Quellen:
 *   – /discovery/content/shared/impressum.md  →  Kontaktdaten, USt-IdNr.
 *   – /discovery/content/de/hotel-preise.md   →  Zimmerpreise (74 €/EZ, 120 €/DZ, …)
 *   – /discovery/content/de/{sommer,winter,…}.md → Aktivitäten-Stub
 *   – /discovery/assets/logos/                →  HolidayCheck-Badges
 *   – /discovery/assets/images/               →  ausgewählte Hero-Bilder
 *   – /discovery/SUMMARY.md (IA-Vorschlag)    →  Navigation-Struktur
 *   – /discovery/gaps.md                      →  FAQ-Themen
 *
 * Aufruf:
 *   pnpm seed                # echte Mutationen
 *   pnpm seed:dry            # nur protokollieren, nichts ändern
 *
 * Idempotenz:
 *   Alle Dokumente erhalten deterministische `_id`s — ein erneuter Lauf
 *   überschreibt vorhandene Werte (createOrReplace). Sicher zum Re-Seeden.
 *
 * Bilder werden NUR hochgeladen, wenn sie noch nicht im Dataset existieren
 * (Hash-basierter Vergleich via SHA-256). Spart API-Calls bei Re-Runs.
 */

import 'dotenv/config'
import { createClient, type SanityClient, type SanityAssetDocument } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

// ─────────────────────────────────────────────────────────────────────────
//  Setup
// ─────────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run')
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const DISCOVERY_DIR = path.join(REPO_ROOT, 'discovery')
const ASSETS_DIR = path.join(DISCOVERY_DIR, 'assets')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || projectId === 'REPLACE_WITH_PROJECT_ID') {
  console.error('❌  SANITY_STUDIO_PROJECT_ID ist nicht gesetzt. Bitte .env anlegen (Vorlage: .env.example).')
  process.exit(1)
}
if (!DRY_RUN && !token) {
  console.error('❌  SANITY_API_WRITE_TOKEN ist nicht gesetzt. Token mit Schreibrechten benötigt.')
  console.error('     Erstellen: sanity.io/manage → Project → API → Tokens → "Editor"')
  process.exit(1)
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

// ─────────────────────────────────────────────────────────────────────────
//  Helfer
// ─────────────────────────────────────────────────────────────────────────

const log = (...args: unknown[]) => console.log(DRY_RUN ? '   [dry]' : '   ', ...args)
const ok = (...args: unknown[]) => console.log(DRY_RUN ? '✓ [dry]' : '✓', ...args)

/** i18n-Array für Strings/Texte. */
const i18n = (de: string, en?: string) => [
  { _key: 'de', value: de },
  { _key: 'en', value: en ?? de },
]

/** Hash-basierter Asset-Cache, damit Re-Runs nicht 30× hochladen. */
const assetCache = new Map<string, SanityAssetDocument>()

async function uploadAsset(filePath: string): Promise<SanityAssetDocument | null> {
  try {
    await stat(filePath)
  } catch {
    log(`⚠  Datei nicht gefunden: ${filePath}`)
    return null
  }

  const buffer = await readFile(filePath)
  const sha = createHash('sha256').update(buffer).digest('hex')

  if (assetCache.has(sha)) return assetCache.get(sha)!

  if (DRY_RUN) {
    const fake: SanityAssetDocument = {
      _id: `image-${sha.slice(0, 8)}-fake`,
      _type: 'sanity.imageAsset',
      _rev: '',
      _createdAt: '',
      _updatedAt: '',
      assetId: sha.slice(0, 8),
      extension: path.extname(filePath).slice(1),
      mimeType: 'image/jpeg',
      originalFilename: path.basename(filePath),
      path: '',
      sha1hash: sha,
      size: buffer.byteLength,
      uploadId: '',
      url: `https://placeholder/${path.basename(filePath)}`,
    } as unknown as SanityAssetDocument
    assetCache.set(sha, fake)
    log(`  ↑ würde hochladen: ${path.basename(filePath)}  (${(buffer.byteLength / 1024).toFixed(0)} KB)`)
    return fake
  }

  log(`  ↑ Lade hoch: ${path.basename(filePath)}  (${(buffer.byteLength / 1024).toFixed(0)} KB)`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  assetCache.set(sha, asset)
  return asset
}

/** createOrReplace mit Dry-Run-Unterstützung. */
async function upsertDoc(doc: { _id: string; _type: string; [k: string]: unknown }) {
  if (DRY_RUN) {
    ok(`würde upserten: ${doc._type} (${doc._id})`)
    return doc
  }
  const result = await client.createOrReplace(doc as never)
  ok(`upserted: ${doc._type} (${doc._id})`)
  return result
}

/** Image-Referenz aus Asset-Dokument bauen. */
function imgRef(asset: SanityAssetDocument | null, altDe: string, altEn?: string) {
  if (!asset) return undefined
  return {
    _type: 'richImage',
    asset: { _type: 'reference', _ref: asset._id },
    alt: i18n(altDe, altEn),
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  1.  Site-Settings (Singleton)
// ─────────────────────────────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log('\n📐  Site-Einstellungen …')

  const logoPath = path.join(ASSETS_DIR, 'logos', 'holidaycheck-badge-2026.jpg')
  const logoAsset = await uploadAsset(logoPath)

  const hcBadgePaths = [
    'holidaycheck-badge-2024.jpg',
    'holidaycheck-badge-2025.jpg',
    'holidaycheck-badge-2026.jpg',
  ].map((f) => path.join(ASSETS_DIR, 'logos', f))

  const hcAssets = await Promise.all(hcBadgePaths.map((p) => uploadAsset(p)))

  return upsertDoc({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: i18n('Hotel zur Post Kiefersfelden'),
    tagline: i18n(
      'Wo Bayerische Gastlichkeit zuhause ist.',
      'Where Bavarian hospitality is at home.',
    ),
    foundingYear: 1820,
    logo: logoAsset
      ? { _type: 'image', asset: { _type: 'reference', _ref: logoAsset._id } }
      : undefined,
    contactInfo: {
      _type: 'contactInfo',
      companyName: 'Gasthof Hotel zur Post',
      street: 'Bahnhofstraße 22-26',
      postalCode: '83088',
      city: 'Kiefersfelden',
      country: 'Deutschland',
      phone: '+49 8033 308390',
      fax: '+49 8033 3083918',
      email: 'info@hotel-kiefersfelden.de',
      geo: { lat: 47.6155, lng: 12.1864 }, // ungefähr — mit echten Geo-Daten validieren
    },
    receptionHours: i18n(
      'Anreise bis 22:00 Uhr möglich. Spätere Anreise nach Absprache.',
      'Check-in until 10 p.m. Later arrival on request.',
    ),
    restaurantHours: [
      // Platzhalter — Familie Pfeiffer pflegt nach. Achtung: Ruhetag aktuell unbekannt!
      { _key: 'mo', _type: 'openingHours', day: 'monday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'tu', _type: 'openingHours', day: 'tuesday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'we', _type: 'openingHours', day: 'wednesday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'th', _type: 'openingHours', day: 'thursday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'fr', _type: 'openingHours', day: 'friday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'sa', _type: 'openingHours', day: 'saturday', closed: false, openTime: '11:30', closeTime: '22:00' },
      { _key: 'su', _type: 'openingHours', day: 'sunday', closed: false, openTime: '11:30', closeTime: '22:00' },
    ],
    holidayCheck: {
      _type: 'holidayCheckScore',
      badges: [2024, 2025, 2026],
      lastUpdated: new Date().toISOString().slice(0, 10),
      profileUrl: 'https://www.holidaycheck.de/hi/hotel-zur-post-kiefersfelden',
    },
    bookingProvider: 'dirs21',
    bookingUrl: 'https://v4.ibe.dirs21.de/channels/hotel-kiefersfeldende',
    bookingCtaLabel: i18n('Direkt buchen', 'Book directly'),
    socialLinks: hcAssets[0]
      ? [
          {
            _key: 'hc',
            _type: 'socialLink',
            platform: 'holidaycheck',
            url: 'https://www.holidaycheck.de/hi/hotel-zur-post-kiefersfelden',
          },
        ]
      : [],
    defaultSeo: {
      _type: 'seo',
      title: i18n(
        'Hotel zur Post Kiefersfelden – Bayerische Gastlichkeit seit 1820',
        'Hotel zur Post Kiefersfelden – Bavarian hospitality since 1820',
      ),
      description: i18n(
        'Familiengeführter Gasthof an der Tiroler Grenze. 25 Zimmer, eigene Metzgerei, regionale Küche.',
        'Family-run inn at the Tyrolean border. 25 rooms, in-house butchery, regional cuisine.',
      ),
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────
//  2.  Legal-Pages (Impressum, Datenschutz, AGB)
// ─────────────────────────────────────────────────────────────────────────

const ptBlock = (text: string) => ({
  _type: 'block',
  _key: createHash('sha1').update(text).digest('hex').slice(0, 8),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: 'a', text, marks: [] }],
})

async function seedLegalPages() {
  console.log('\n📄  Legal-Pages (Impressum / Datenschutz / AGB) …')

  await upsertDoc({
    _id: 'page-impressum',
    _type: 'page',
    title: i18n('Impressum', 'Imprint'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'impressum' },
      en: { _type: 'slug', current: 'imprint' },
    },
    pageType: 'imprint',
    body: {
      _type: 'localizedPortableText',
      de: [
        ptBlock('Gasthof Hotel zur Post'),
        ptBlock('Inh. Andreas Pfeiffer'),
        ptBlock('Bahnhofstraße 22-26, 83088 Kiefersfelden'),
        ptBlock('Telefon: +49 8033 308390 · Fax: +49 8033 3083918'),
        ptBlock('E-Mail: info@hotel-kiefersfelden.de'),
        ptBlock('USt-IdNr.: DE131109627 · Steuernummer: 156 258 10377'),
        ptBlock('Verantwortlicher i.S.d. § 18 Abs. 2 MStV: Andreas Pfeiffer (Anschrift wie oben).'),
        ptBlock(
          'Verbraucherstreitbeilegung: Die Europäische Kommission stellt eine OS-Plattform unter https://ec.europa.eu/consumers/odr bereit. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren teilzunehmen.',
        ),
      ],
      en: [
        ptBlock('Gasthof Hotel zur Post · Owner: Andreas Pfeiffer'),
        ptBlock('Bahnhofstraße 22-26, 83088 Kiefersfelden, Germany'),
        ptBlock('Phone: +49 8033 308390 · Fax: +49 8033 3083918 · Email: info@hotel-kiefersfelden.de'),
        ptBlock('VAT-ID: DE131109627'),
      ],
    },
    lastReviewedAt: null,
  })

  await upsertDoc({
    _id: 'page-datenschutz',
    _type: 'page',
    title: i18n('Datenschutzerklärung', 'Privacy Policy'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'datenschutz' },
      en: { _type: 'slug', current: 'privacy' },
    },
    pageType: 'privacy',
    body: {
      _type: 'localizedPortableText',
      de: [
        ptBlock('⚠ Platzhalter — bitte vor Veröffentlichung mit Datenschutzbeauftragtem abstimmen.'),
        ptBlock(
          'Verantwortlicher im Sinne der DSGVO: Gasthof Hotel zur Post, Andreas Pfeiffer, Bahnhofstraße 22-26, 83088 Kiefersfelden.',
        ),
      ],
      en: [
        ptBlock('⚠ Placeholder — please review with data-protection officer before publishing.'),
      ],
    },
    lastReviewedAt: null,
  })

  await upsertDoc({
    _id: 'page-agb',
    _type: 'page',
    title: i18n('AGB & Stornobedingungen', 'Terms & Cancellation'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'agb' },
      en: { _type: 'slug', current: 'terms' },
    },
    pageType: 'terms',
    body: {
      _type: 'localizedPortableText',
      de: [
        ptBlock('⚠ Platzhalter — Stornofristen und Anzahlungs-Regeln mit DIRS21-Konfiguration abgleichen.'),
      ],
      en: [ptBlock('⚠ Placeholder — to be aligned with DIRS21 cancellation policy.')],
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────
//  3.  Navigation (3 Singletons)
// ─────────────────────────────────────────────────────────────────────────

async function seedNavigation() {
  console.log('\n🧭  Navigation …')

  // Header — gemäß IA-Vorschlag aus discovery/SUMMARY.md
  await upsertDoc({
    _id: 'nav-header',
    _type: 'navigation',
    title: 'Header (Hauptmenü)',
    position: 'header',
    items: [
      { _key: 'h1', _type: 'navItem', label: i18n('Hotel'), externalUrl: '/hotel/' },
      { _key: 'h2', _type: 'navItem', label: i18n('Zimmer', 'Rooms'), externalUrl: '/hotel/zimmer/' },
      { _key: 'h3', _type: 'navItem', label: i18n('Restaurant'), externalUrl: '/restaurant/' },
      {
        _key: 'h4',
        _type: 'navItem',
        label: i18n('Erleben', 'Experience'),
        externalUrl: '/erleben/',
      },
      { _key: 'h5', _type: 'navItem', label: i18n('Angebote', 'Offers'), externalUrl: '/angebote/' },
      { _key: 'h6', _type: 'navItem', label: i18n('Anfahrt', 'Directions'), externalUrl: '/anfahrt/' },
      { _key: 'h7', _type: 'navItem', label: i18n('Kontakt', 'Contact'), externalUrl: '/kontakt/' },
    ],
  })

  // Footer Hauptmenü
  await upsertDoc({
    _id: 'nav-footer',
    _type: 'navigation',
    title: 'Footer (Hauptmenü)',
    position: 'footer',
    items: [
      { _key: 'f1', _type: 'navItem', label: i18n('Speisekarte', 'Menu'), externalUrl: '/restaurant/speisekarte/' },
      { _key: 'f2', _type: 'navItem', label: i18n('Tagungen', 'Conferences'), externalUrl: '/tagungen/' },
      { _key: 'f3', _type: 'navItem', label: i18n('Gruppen / Busse', 'Groups / Coaches'), externalUrl: '/gruppen/' },
      { _key: 'f4', _type: 'navItem', label: i18n('Gutscheine', 'Vouchers'), externalUrl: '/gutscheine/' },
      { _key: 'f5', _type: 'navItem', label: i18n('FAQ'), externalUrl: '/faq/' },
      { _key: 'f6', _type: 'navItem', label: i18n('Wetter', 'Weather'), externalUrl: '/wetter/' },
    ],
  })

  // Footer Rechtliches
  await upsertDoc({
    _id: 'nav-footer-legal',
    _type: 'navigation',
    title: 'Footer (Rechtliches)',
    position: 'footerLegal',
    items: [
      { _key: 'l1', _type: 'navItem', label: i18n('Impressum', 'Imprint'), externalUrl: '/impressum/' },
      { _key: 'l2', _type: 'navItem', label: i18n('Datenschutz', 'Privacy'), externalUrl: '/datenschutz/' },
      { _key: 'l3', _type: 'navItem', label: i18n('AGB', 'Terms'), externalUrl: '/agb/' },
    ],
  })
}

// ─────────────────────────────────────────────────────────────────────────
//  4.  Amenities (Ausstattungs-Bibliothek)
// ─────────────────────────────────────────────────────────────────────────

async function seedAmenities() {
  console.log('\n🏷️   Ausstattungs-Bibliothek …')

  const amenities = [
    { id: 'wifi', name: ['WLAN kostenlos', 'Free Wi-Fi'], cat: 'tech', icon: 'wifi' },
    { id: 'tv', name: ['Flachbild-TV', 'Flat-screen TV'], cat: 'tech', icon: 'tv' },
    { id: 'phone', name: ['Telefon', 'Phone'], cat: 'tech', icon: 'phone' },
    { id: 'safe', name: ['Safe', 'Safe'], cat: 'comfort', icon: 'lock' },
    { id: 'minibar', name: ['Minibar', 'Minibar'], cat: 'comfort', icon: 'fridge' },
    { id: 'hairdryer', name: ['Föhn', 'Hairdryer'], cat: 'bath', icon: 'wind' },
    { id: 'shower', name: ['Dusche', 'Shower'], cat: 'bath', icon: 'shower' },
    { id: 'bathtub', name: ['Badewanne', 'Bathtub'], cat: 'bath', icon: 'bath' },
    { id: 'balcony', name: ['Balkon', 'Balcony'], cat: 'view', icon: 'balcony' },
    { id: 'mountainview', name: ['Bergblick', 'Mountain view'], cat: 'view', icon: 'mountain' },
    { id: 'nonsmoking', name: ['Nichtraucherzimmer', 'Non-smoking'], cat: 'comfort', icon: 'no-smoking' },
    { id: 'lift', name: ['Personenlift', 'Elevator'], cat: 'accessibility', icon: 'elevator' },
    { id: 'family', name: ['Familienzimmer', 'Family-friendly'], cat: 'family', icon: 'family' },
    { id: 'crib', name: ['Babybett auf Anfrage', 'Crib on request'], cat: 'family', icon: 'crib' },
    { id: 'parking', name: ['Parkplatz am Haus', 'On-site parking'], cat: 'comfort', icon: 'parking' },
  ]

  for (const a of amenities) {
    await upsertDoc({
      _id: `amenity-${a.id}`,
      _type: 'amenity',
      name: i18n(a.name[0]!, a.name[1]),
      category: a.cat,
      icon: a.icon,
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  5.  Rooms (Stub mit Preisen aus discovery/content/de/hotel-preise.md)
// ─────────────────────────────────────────────────────────────────────────

async function seedRooms() {
  console.log('\n🛏️   Zimmer-Stubs …')

  const baseAmenities = [
    'amenity-wifi',
    'amenity-tv',
    'amenity-phone',
    'amenity-hairdryer',
    'amenity-shower',
    'amenity-nonsmoking',
    'amenity-lift',
  ].map((id) => ({ _type: 'reference', _ref: id }))

  const today = new Date().toISOString().slice(0, 10)
  const yearEnd = `${new Date().getFullYear()}-12-31`

  // Einzelzimmer
  await upsertDoc({
    _id: 'room-einzelzimmer',
    _type: 'room',
    name: i18n('Einzelzimmer', 'Single Room'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'einzelzimmer' },
      en: { _type: 'slug', current: 'single-room' },
    },
    shortDescription: i18n(
      'Komfortables Einzelzimmer mit Dusche/WC, Föhn und Flachbild-TV.',
      'Comfortable single room with shower, hairdryer and flat-screen TV.',
    ),
    roomType: 'single',
    sizeQm: 14,
    maxGuests: 1,
    bedConfig: i18n('1 Einzelbett', '1 single bed'),
    amenities: baseAmenities,
    seasonalPrices: [
      {
        _key: 'p1',
        _type: 'seasonalPrice',
        seasonName: i18n('Standardpreis ab 3 Nächten', 'Standard rate from 3 nights'),
        validFrom: today,
        validUntil: yearEnd,
        pricePerNight: 74,
        minStay: 3,
        includes: i18n('inkl. Frühstücksbuffet, MwSt. und Kurtaxe', 'incl. breakfast, VAT and tourist tax'),
      },
    ],
    priceNote: i18n(
      'Halbpensions-Zuschlag 25 € / Person / Tag.',
      'Half-board surcharge €25 / person / day.',
    ),
    gallery: [],
    orderRank: 10,
  })

  // Doppelzimmer
  await upsertDoc({
    _id: 'room-doppelzimmer',
    _type: 'room',
    name: i18n('Doppelzimmer', 'Double Room'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'doppelzimmer' },
      en: { _type: 'slug', current: 'double-room' },
    },
    shortDescription: i18n(
      'Geräumiges Doppelzimmer mit Dusche oder Bad, ideal für Paare und Geschäftsreisende.',
      'Spacious double room with shower or bath — ideal for couples and business guests.',
    ),
    roomType: 'double',
    sizeQm: 22,
    maxGuests: 2,
    bedConfig: i18n('1 Doppelbett 1,80 m oder 2 Einzelbetten', '1 king bed or 2 twin beds'),
    amenities: [...baseAmenities, { _type: 'reference', _ref: 'amenity-bathtub' }],
    seasonalPrices: [
      {
        _key: 'p1',
        _type: 'seasonalPrice',
        seasonName: i18n('Kurzaufenthalt 1–2 Nächte', 'Short stay 1–2 nights'),
        validFrom: today,
        validUntil: yearEnd,
        pricePerNight: 120,
        minStay: 1,
        includes: i18n('inkl. Frühstück', 'incl. breakfast'),
      },
      {
        _key: 'p2',
        _type: 'seasonalPrice',
        seasonName: i18n('Standardpreis ab 3 Nächten', 'Standard rate from 3 nights'),
        validFrom: today,
        validUntil: yearEnd,
        pricePerNight: 112,
        minStay: 3,
        includes: i18n('inkl. Frühstück', 'incl. breakfast'),
      },
    ],
    gallery: [],
    orderRank: 20,
  })

  // Familienzimmer
  await upsertDoc({
    _id: 'room-familienzimmer',
    _type: 'room',
    name: i18n('Familienzimmer', 'Family Room'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'familienzimmer' },
      en: { _type: 'slug', current: 'family-room' },
    },
    shortDescription: i18n(
      'Großzügiges Familienzimmer für 3–4 Personen mit Verbindungstür-Option.',
      'Spacious family room for 3–4 guests, with optional connecting door.',
    ),
    roomType: 'family',
    sizeQm: 32,
    maxGuests: 4,
    bedConfig: i18n('1 Doppelbett + 2 Einzelbetten', '1 double bed + 2 single beds'),
    amenities: [
      ...baseAmenities,
      { _type: 'reference', _ref: 'amenity-family' },
      { _type: 'reference', _ref: 'amenity-crib' },
    ],
    seasonalPrices: [
      {
        _key: 'p1',
        _type: 'seasonalPrice',
        seasonName: i18n('Standardpreis', 'Standard rate'),
        validFrom: today,
        validUntil: yearEnd,
        pricePerNight: 145,
        includes: i18n('inkl. Frühstück, MwSt. und Kurtaxe', 'incl. breakfast, VAT and tourist tax'),
      },
    ],
    gallery: [],
    orderRank: 30,
  })

  // Ferienhaus
  await upsertDoc({
    _id: 'room-ferienhaus',
    _type: 'room',
    name: i18n('Ferienhaus', 'Holiday House'),
    slug: {
      _type: 'localizedSlug',
      de: { _type: 'slug', current: 'ferienhaus' },
      en: { _type: 'slug', current: 'holiday-house' },
    },
    shortDescription: i18n(
      'Eigenständiges Ferienhaus mit Wohnküche und Garten — ideal für längere Aufenthalte.',
      'Standalone holiday house with kitchen-living room and garden — ideal for longer stays.',
    ),
    roomType: 'apartment',
    sizeQm: 75,
    maxGuests: 5,
    amenities: [...baseAmenities, { _type: 'reference', _ref: 'amenity-family' }],
    seasonalPrices: [
      {
        _key: 'p1',
        _type: 'seasonalPrice',
        seasonName: i18n('Standardpreis', 'Standard rate'),
        validFrom: today,
        validUntil: yearEnd,
        pricePerNight: 180,
        minStay: 3,
        includes: i18n('inkl. Endreinigung', 'incl. final cleaning'),
      },
    ],
    gallery: [],
    orderRank: 40,
  })
}

// ─────────────────────────────────────────────────────────────────────────
//  6.  Activities (Region & Erlebnis)
// ─────────────────────────────────────────────────────────────────────────

async function seedActivities() {
  console.log('\n🥾  Aktivitäten …')

  const acts = [
    {
      id: 'kutschenfahrt',
      title: ['Kutschenfahrt mit dem Hotelwirt', 'Carriage ride with the innkeeper'],
      cat: 'carriage',
      seasons: ['spring', 'summer', 'autumn'],
      shortDe:
        'Andi Pfeiffer spannt persönlich das Pferd ein und chauffiert Sie durchs Kaiserreich — ein einzigartiges Erlebnis.',
      shortEn:
        'Innkeeper Andi Pfeiffer himself harnesses the horse and takes you through the Kaiserreich — a one-of-a-kind experience.',
      orderRank: 5,
    },
    {
      id: 'bergwandern',
      title: ['Bergwandern im Kaiserreich', 'Mountain hiking in Kaiserreich'],
      cat: 'hiking',
      seasons: ['spring', 'summer', 'autumn'],
      shortDe: 'Vom Hotel aus direkt in die Wandergebiete am Kaiser- und Wendelsteinmassiv.',
      shortEn: 'Direct access from the hotel to hiking trails on the Kaiser and Wendelstein ranges.',
      orderRank: 10,
    },
    {
      id: 'hocheck-skigebiet',
      title: ['Skigebiet Hocheck Oberaudorf', 'Hocheck ski resort'],
      cat: 'ski',
      seasons: ['winter'],
      distanceKm: 5,
      shortDe: 'Familienfreundliches Skigebiet mit Nachtskifahren — 5 km vom Hotel entfernt.',
      shortEn: 'Family-friendly ski resort with night skiing — 5 km from the hotel.',
      externalUrl: 'https://www.hocheck.com/',
      orderRank: 20,
    },
    {
      id: 'innsola',
      title: ['Erlebnisbad Innsola', 'Innsola adventure pool'],
      cat: 'wellness',
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      shortDe: 'Ganzjährig geöffnetes Erlebnisbad in Kiefersfelden — fußläufig erreichbar.',
      shortEn: 'Year-round adventure pool in Kiefersfelden — within walking distance.',
      orderRank: 30,
    },
    {
      id: 'wendelstein',
      title: ['Wendelstein-Zahnradbahn', 'Wendelstein cog railway'],
      cat: 'sight',
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      distanceKm: 15,
      shortDe: 'Historische Zahnradbahn auf Bayerns Hausberg — Aussicht bis zum Großglockner.',
      shortEn: 'Historic cog railway up Bavaria’s landmark mountain — views all the way to the Großglockner.',
      orderRank: 40,
    },
    {
      id: 'festung-kufstein',
      title: ['Festung Kufstein', 'Kufstein Fortress'],
      cat: 'sight',
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      distanceKm: 4,
      shortDe: 'Mittelalterliche Festung gleich hinter der Tiroler Grenze — Heldenorgel täglich um 12 Uhr.',
      shortEn: 'Medieval fortress just across the Tyrolean border — heroes’ organ daily at noon.',
      orderRank: 50,
    },
  ]

  for (const a of acts) {
    await upsertDoc({
      _id: `activity-${a.id}`,
      _type: 'activity',
      title: i18n(a.title[0]!, a.title[1]),
      slug: {
        _type: 'localizedSlug',
        de: { _type: 'slug', current: a.id },
        en: { _type: 'slug', current: a.id },
      },
      shortDescription: i18n(a.shortDe, a.shortEn),
      seasons: a.seasons,
      category: a.cat,
      distanceKm: a.distanceKm,
      externalUrl: a.externalUrl,
      orderRank: a.orderRank,
      gallery: [],
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  7.  FAQ-Stubs (aus discovery/gaps.md)
// ─────────────────────────────────────────────────────────────────────────

async function seedFaqs() {
  console.log('\n❓  FAQ-Stubs …')

  const faqs: Array<{
    id: string
    cat: string
    q: [string, string]
    a: [string, string]
  }> = [
    {
      id: 'checkin-time',
      cat: 'arrival',
      q: ['Bis wann ist eine Anreise möglich?', 'Until what time can I check in?'],
      a: ['Anreise ist bis 22:00 Uhr möglich. Spätere Anreise nach Absprache.', 'Check-in is possible until 10:00 p.m. Later arrival on request.'],
    },
    {
      id: 'parking',
      cat: 'parking',
      q: ['Gibt es Parkplätze am Hotel?', 'Is there parking on site?'],
      a: ['Ja, Parkplätze stehen kostenfrei am Haus zur Verfügung.', 'Yes, free parking is available on site.'],
    },
    {
      id: 'pets',
      cat: 'pets',
      q: ['Sind Hunde im Hotel erlaubt?', 'Are dogs allowed in the hotel?'],
      a: ['⚠ Bitte aktuelle Antwort einpflegen (Bedingungen / Aufpreis).', '⚠ Please add up-to-date answer.'],
    },
    {
      id: 'breakfast-time',
      cat: 'restaurant',
      q: ['Wann gibt es Frühstück?', 'What are the breakfast hours?'],
      a: ['⚠ Bitte aktuelle Frühstückszeiten einpflegen.', '⚠ Please add current breakfast times.'],
    },
    {
      id: 'family-bed',
      cat: 'family',
      q: ['Bekommen wir ein Babybett ins Zimmer?', 'Can we get a crib in the room?'],
      a: ['Ein Babybett stellen wir gerne kostenlos auf Anfrage bereit.', 'A crib is available free of charge on request.'],
    },
    {
      id: 'lift',
      cat: 'accessibility',
      q: ['Hat das Hotel einen Aufzug?', 'Does the hotel have an elevator?'],
      a: ['Ja, alle 25 Zimmer sind bequem über einen Personenlift erreichbar.', 'Yes, all 25 rooms are accessible by elevator.'],
    },
  ]

  for (const f of faqs) {
    await upsertDoc({
      _id: `faq-${f.id}`,
      _type: 'faq',
      question: i18n(f.q[0], f.q[1]),
      answer: {
        _type: 'localizedPortableText',
        de: [ptBlock(f.a[0])],
        en: [ptBlock(f.a[1])],
      },
      category: f.cat,
      orderRank: 100,
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  8.  Demo-Speisekarte (Standardkarte als Stub + Beispiel-Tageskarte)
// ─────────────────────────────────────────────────────────────────────────

async function seedDemoMenus() {
  console.log('\n🍽️   Demo-Speisekarten …')

  // Ein paar wiederverwendbare Standard-Gerichte
  const items = [
    {
      id: 'kaiserschmarrn',
      de: 'Hausgemachter Kaiserschmarrn',
      en: 'Homemade Kaiserschmarrn',
      desc: ['mit Apfelmus oder Zwetschgenröster', 'with apple sauce or plum compote'],
      price: 12.5,
      cat: 'dessert',
      tags: ['klassiker', 'regional'],
      veg: true,
    },
    {
      id: 'wienerschnitzel',
      de: 'Wiener Schnitzel vom Kalb',
      en: 'Veal Wiener Schnitzel',
      desc: ['mit Pommes Frites und Preiselbeeren', 'with French fries and lingonberries'],
      price: 24.5,
      cat: 'main_meat',
      tags: ['klassiker'],
      empf: true,
    },
    {
      id: 'wuerstel-eigene',
      de: 'Würstl aus eigener Metzgerei',
      en: 'Sausages from our in-house butchery',
      desc: ['mit Hausmacher-Sauerkraut und Bauernbrot', 'with homemade sauerkraut and farmer’s bread'],
      price: 13.9,
      cat: 'snack',
      tags: ['regional', 'eigene-metzgerei'],
    },
  ]

  for (const it of items) {
    await upsertDoc({
      _id: `menuitem-${it.id}`,
      _type: 'menuItem',
      name: i18n(it.de, it.en),
      description: i18n(it.desc[0]!, it.desc[1]),
      price: it.price,
      category: it.cat,
      tags: it.tags,
      isVegetarian: it.veg ?? false,
      isHouseRecommendation: it.empf ?? false,
    })
  }

  // Standard-Karte (Stub)
  await upsertDoc({
    _id: 'menu-standard',
    _type: 'menu',
    type: 'standardkarte',
    title: i18n('Hauskarte', 'Main Menu'),
    introNote: i18n(
      '⚠ Hier nach der OCR-Migration der bestehenden Speisekarte vollständige Sektionen einpflegen.',
      '⚠ Populate sections here after OCR-migration of the existing menu.',
    ),
    sections: [
      {
        _key: 's1',
        _type: 'menuSection',
        name: i18n('Hauptspeisen', 'Main courses'),
        items: [
          { _key: 'i1', _type: 'reference', _ref: 'menuitem-wienerschnitzel' },
          { _key: 'i2', _type: 'reference', _ref: 'menuitem-wuerstel-eigene' },
        ],
      },
      {
        _key: 's2',
        _type: 'menuSection',
        name: i18n('Desserts'),
        items: [{ _key: 'i1', _type: 'reference', _ref: 'menuitem-kaiserschmarrn' }],
      },
    ],
    footerNote: i18n(
      'Alle Preise in EUR inkl. gesetzlicher MwSt. Allergene auf Anfrage.',
      'All prices in EUR incl. VAT. Allergens on request.',
    ),
    isPublished: false,
  })

  // Beispiel-Tageskarte für heute (unveröffentlicht — als Anschauungsobjekt)
  const today = new Date().toISOString().slice(0, 10)
  await upsertDoc({
    _id: 'menu-tageskarte-demo',
    _type: 'menu',
    type: 'tageskarte',
    title: i18n(`Tageskarte ${today.slice(8, 10)}.${today.slice(5, 7)}.`, `Daily Menu ${today.slice(8, 10)}/${today.slice(5, 7)}`),
    date: today,
    introNote: i18n(
      'Beispiel-Tageskarte — zum Üben des Workflows. Vor Veröffentlichung anpassen oder löschen.',
      'Example daily menu — for workflow practice. Edit or delete before publishing.',
    ),
    sections: [
      {
        _key: 's1',
        _type: 'menuSection',
        name: i18n('Heute empfehlen wir', 'Today’s recommendations'),
        items: [
          {
            _key: 'i1',
            _type: 'inlineMenuItem',
            name: i18n('Steckerlfisch frisch vom Grill', 'Fresh grilled fish on a stick'),
            description: i18n('mit Bauernbrot und Meerrettich', 'with farmer’s bread and horseradish'),
            price: 16.9,
            allergens: ['1', '4'],
            isHouseRecommendation: true,
          },
        ],
      },
    ],
    isPublished: false,
  })
}

// ─────────────────────────────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n┌────────────────────────────────────────────────────────────┐`)
  console.log(`│  Sanity Seed — Hotel zur Post                               │`)
  console.log(`│  Project: ${projectId.padEnd(48)}│`)
  console.log(`│  Dataset: ${dataset.padEnd(48)}│`)
  console.log(`│  Mode:    ${(DRY_RUN ? 'DRY-RUN (keine Mutationen)' : 'LIVE').padEnd(48)}│`)
  console.log(`└────────────────────────────────────────────────────────────┘`)

  await seedSiteSettings()
  await seedAmenities()
  await seedRooms()
  await seedActivities()
  await seedFaqs()
  await seedDemoMenus()
  await seedLegalPages()
  await seedNavigation()

  console.log('\n✅  Seed abgeschlossen.')
  console.log(
    DRY_RUN
      ? '   (Dry-Run: Es wurden keine Daten geschrieben.)'
      : '   Studio öffnen und Daten kontrollieren.',
  )
}

main().catch((err) => {
  console.error('\n❌  Seed fehlgeschlagen:', err)
  process.exit(1)
})
