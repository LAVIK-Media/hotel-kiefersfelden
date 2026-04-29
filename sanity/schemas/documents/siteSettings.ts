import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

/**
 * Singleton — globale Site-Einstellungen.
 *
 * Pinning per fester ID `siteSettings` in der Desk-Structure
 * verhindert mehrfaches Anlegen.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site-Einstellungen',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identitaet', title: 'Identität', default: true },
    { name: 'kontakt', title: 'Kontakt' },
    { name: 'oeffnung', title: 'Öffnungszeiten' },
    { name: 'auszeichnungen', title: 'Auszeichnungen' },
    { name: 'social', title: 'Social Media' },
    { name: 'buchung', title: 'Buchung' },
    { name: 'seo', title: 'Standard-SEO' },
  ],
  fields: [
    // ── Identität ───────────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Name der Website',
      group: 'identitaet',
      type: 'internationalizedArrayString',
      initialValue: [
        { _key: 'de', value: 'Hotel zur Post Kiefersfelden' },
        { _key: 'en', value: 'Hotel zur Post Kiefersfelden' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      group: 'identitaet',
      description: 'Kurzer Slogan unter dem Logo. Aktuell: „Wo Bayerische Gastlichkeit zuhause ist."',
      type: 'internationalizedArrayString',
      initialValue: [
        { _key: 'de', value: 'Wo Bayerische Gastlichkeit zuhause ist.' },
        { _key: 'en', value: 'Where Bavarian hospitality is at home.' },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      group: 'identitaet',
      description: 'Empfohlen: SVG oder PNG mit transparentem Hintergrund, mind. 400 px breit.',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      group: 'identitaet',
      description: 'Quadratisch, mind. 256×256 px (PNG). Wird als Browser-Tab-Icon verwendet.',
      type: 'image',
    }),
    defineField({
      name: 'foundingYear',
      title: 'Gründungsjahr',
      group: 'identitaet',
      type: 'number',
      initialValue: 1820,
      description: 'Königlich Bayerische Poststation — 1820. Wird in Schema.org und Footer verwendet.',
    }),

    // ── Kontakt ─────────────────────────────────────────────────────────
    defineField({
      name: 'contactInfo',
      title: 'Kontaktdaten',
      group: 'kontakt',
      type: 'contactInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reservationsPhone',
      title: 'Telefon Reservierung (falls abweichend)',
      group: 'kontakt',
      type: 'string',
    }),
    defineField({
      name: 'reservationsEmail',
      title: 'E-Mail Reservierung (falls abweichend)',
      group: 'kontakt',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),

    // ── Öffnungszeiten Restaurant ───────────────────────────────────────
    defineField({
      name: 'restaurantHours',
      title: 'Öffnungszeiten Restaurant',
      group: 'oeffnung',
      description: 'Pro Wochentag eine Zeile. Ruhetage als „Geschlossen" markieren.',
      type: 'array',
      of: [{ type: 'openingHours' }],
      validation: (Rule) => Rule.unique().error('Jeder Wochentag darf nur einmal vorkommen.'),
    }),
    defineField({
      name: 'receptionHours',
      title: 'Rezeptionszeiten / Anreise',
      group: 'oeffnung',
      description: 'Free-Text. Aktuell auf Bestandssite: „Anreise bis 22:00 Uhr".',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'closures',
      title: 'Betriebsferien / Schließtage',
      group: 'oeffnung',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'closure',
          fields: [
            { name: 'from', title: 'Von', type: 'date', validation: (R) => R.required() },
            { name: 'to', title: 'Bis', type: 'date', validation: (R) => R.required() },
            { name: 'note', title: 'Hinweis', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { from: 'from', to: 'to', note: 'note' },
            prepare({ from, to, note }) {
              const n = (note as Array<{ _key: string; value?: string }> | undefined)?.find(
                (x) => x._key === 'de',
              )?.value
              return { title: `${from ?? '?'} – ${to ?? '?'}`, subtitle: n as string }
            },
          },
        },
      ],
    }),

    // ── Auszeichnungen ──────────────────────────────────────────────────
    defineField({
      name: 'holidayCheck',
      title: 'HolidayCheck',
      group: 'auszeichnungen',
      type: 'holidayCheckScore',
    }),
    defineField({
      name: 'starRating',
      title: 'Klassifizierung (Sterne)',
      group: 'auszeichnungen',
      description: 'DEHOGA-Klassifizierung (Hotelsterne 1–5). Leer lassen, falls nicht klassifiziert.',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'awards',
      title: 'Weitere Auszeichnungen',
      group: 'auszeichnungen',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'award',
          fields: [
            {
              name: 'name',
              title: 'Name der Auszeichnung',
              type: 'internationalizedArrayString',
              validation: (R) => R.required(),
            },
            { name: 'year', title: 'Jahr', type: 'number' },
            { name: 'logo', title: 'Logo', type: 'image' },
            { name: 'url', title: 'Link', type: 'url' },
          ],
          preview: {
            select: { name: 'name', year: 'year' },
            prepare({ name, year }) {
              const n = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
                (x) => x._key === 'de',
              )?.value
              return { title: n as string, subtitle: year ? `${year}` : undefined }
            },
          },
        },
      ],
    }),

    // ── Social ──────────────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social-Media-Profile',
      group: 'social',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),

    // ── Buchung ─────────────────────────────────────────────────────────
    defineField({
      name: 'bookingProvider',
      title: 'Buchungssystem',
      group: 'buchung',
      type: 'string',
      options: {
        list: [
          { title: 'DIRS21', value: 'dirs21' },
          { title: 'Channel-Manager (Andere)', value: 'other' },
          { title: 'Anfrage per Formular', value: 'inquiry' },
        ],
      },
      initialValue: 'dirs21',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Buchungs-URL',
      group: 'buchung',
      description:
        'DIRS21-IBE-Link (z.B. https://reservation.dirs21.de/...) oder eigene Anfrage-Seite.',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'bookingCtaLabel',
      title: 'Beschriftung Buchungs-Button',
      group: 'buchung',
      type: 'internationalizedArrayString',
      initialValue: [
        { _key: 'de', value: 'Direkt buchen' },
        { _key: 'en', value: 'Book directly' },
      ],
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({
      name: 'defaultSeo',
      title: 'Standard-SEO',
      group: 'seo',
      description: 'Wird verwendet, wenn eine Seite keine eigenen SEO-Werte hat.',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site-Einstellungen', subtitle: 'Globale Konfiguration' }
    },
  },
})
