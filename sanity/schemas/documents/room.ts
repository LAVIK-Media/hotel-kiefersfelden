import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const room = defineType({
  name: 'room',
  title: 'Zimmer',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'beschreibung', title: 'Beschreibung', default: true },
    { name: 'fakten', title: 'Fakten' },
    { name: 'preise', title: 'Preise' },
    { name: 'medien', title: 'Bilder' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Zimmer-Bezeichnung',
      group: 'beschreibung',
      description: 'z.B. „Doppelzimmer Komfort", „Familienzimmer Wendelstein", „Ferienhaus".',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Name (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Pfad',
      group: 'beschreibung',
      type: 'localizedSlug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kurzbeschreibung',
      group: 'beschreibung',
      description: '1–2 Sätze, erscheint in Übersichten.',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Ausführliche Beschreibung',
      group: 'beschreibung',
      type: 'localizedPortableText',
    }),
    defineField({
      name: 'roomType',
      title: 'Zimmertyp',
      group: 'fakten',
      type: 'string',
      options: {
        list: [
          { title: 'Einzelzimmer', value: 'single' },
          { title: 'Doppelzimmer', value: 'double' },
          { title: 'Dreibettzimmer', value: 'triple' },
          { title: 'Familienzimmer', value: 'family' },
          { title: 'Suite', value: 'suite' },
          { title: 'Ferienhaus', value: 'apartment' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizeQm',
      title: 'Größe (m²)',
      group: 'fakten',
      type: 'number',
      validation: (Rule) => Rule.min(5).max(500),
    }),
    defineField({
      name: 'maxGuests',
      title: 'Maximale Personenzahl',
      group: 'fakten',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'bedConfig',
      title: 'Bett-Konfiguration',
      group: 'fakten',
      description: 'z.B. „1 Doppelbett 1,80 m" oder „2 Einzelbetten + Zustellbett".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'amenities',
      title: 'Ausstattung',
      group: 'fakten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'amenity' }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'seasonalPrices',
      title: 'Saison-Preise',
      group: 'preise',
      description:
        'Mindestens ein Preis pro Saison. Das Frontend zeigt automatisch den aktuell gültigen Preis sowie „ab X €".',
      type: 'array',
      of: [{ type: 'seasonalPrice' }],
      validation: (Rule) => Rule.required().min(1).error('Mindestens 1 Saisonpreis angeben.'),
    }),
    defineField({
      name: 'priceNote',
      title: 'Preis-Hinweis',
      group: 'preise',
      description: 'z.B. „Halbpensions-Zuschlag 25 €/Person/Tag" oder „MwSt. und Kurtaxe inkl.".',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'gallery',
      title: 'Bildergalerie',
      group: 'medien',
      description: 'Erstes Bild dient als Hero-Bild auf der Detailseite.',
      type: 'array',
      of: [{ type: 'richImage' }],
      validation: (Rule) =>
        Rule.required().min(1).error('Mindestens 1 Bild pro Zimmer benötigt.'),
    }),
    defineField({
      name: 'bookingUrlOverride',
      title: 'Eigener Buchungs-Link (optional)',
      group: 'beschreibung',
      description:
        'Wenn dieses Zimmer nicht über DIRS21 gebucht wird (z.B. Ferienhaus über Airbnb), eigene URL eintragen.',
      type: 'url',
    }),
    defineField({
      name: 'orderRank',
      title: 'Sortier-Reihenfolge',
      group: 'beschreibung',
      description: 'Niedrigere Zahl = weiter oben in der Übersicht.',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      group: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'roomType',
      qm: 'sizeQm',
      guests: 'maxGuests',
      gallery: 'gallery',
    },
    prepare({ name, type, qm, guests, gallery }) {
      const de = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const first = Array.isArray(gallery) ? gallery[0] : undefined
      return {
        title: de || '(Ohne Name)',
        subtitle: `${type ?? '—'}  ·  ${qm ? `${qm} m²` : '—'}  ·  ${guests ?? '?'} Personen`,
        media: first as never,
      }
    },
  },
  orderings: [
    {
      title: 'Reihenfolge',
      name: 'orderRank',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
