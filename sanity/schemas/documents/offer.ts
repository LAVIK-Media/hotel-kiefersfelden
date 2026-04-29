import { defineField, defineType } from 'sanity'
import { TagsIcon } from '@sanity/icons'

export const offer = defineType({
  name: 'offer',
  title: 'Angebot / Pauschale',
  type: 'document',
  icon: TagsIcon,
  description:
    'Pauschalen wie „Sommer-Wochenende", „Wintertraum", „Kutschenfahrt-Paket". Wird im Kontaktformular und auf der Angebote-Seite angezeigt.',
  groups: [
    { name: 'beschreibung', title: 'Beschreibung', default: true },
    { name: 'leistung', title: 'Leistungen & Preis' },
    { name: 'medien', title: 'Bilder' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      group: 'beschreibung',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Titel (DE) ist Pflicht.'
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
      name: 'season',
      title: 'Saison',
      group: 'beschreibung',
      type: 'string',
      options: {
        list: [
          { title: 'Sommer', value: 'summer' },
          { title: 'Herbst', value: 'autumn' },
          { title: 'Winter', value: 'winter' },
          { title: 'Frühling', value: 'spring' },
          { title: 'Ganzjährig', value: 'allyear' },
        ],
        layout: 'radio',
      },
      initialValue: 'allyear',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kurzbeschreibung',
      group: 'beschreibung',
      description: 'Erscheint in Pauschalen-Kacheln. 1–2 Sätze.',
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
      name: 'includedServices',
      title: 'Enthaltene Leistungen',
      group: 'leistung',
      description: 'Liste der inkludierten Leistungen, z.B. „2 Übernachtungen", „Begrüßungscocktail", „Kutschenfahrt".',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    }),
    defineField({
      name: 'price',
      title: 'Preis (EUR)',
      group: 'leistung',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(5000),
    }),
    defineField({
      name: 'pricePerPerson',
      title: 'Preis pro Person (sonst pro Zimmer/Pauschale)',
      group: 'leistung',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'minStay',
      title: 'Mindestaufenthalt (Nächte)',
      group: 'leistung',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(30),
    }),
    defineField({
      name: 'validFrom',
      title: 'Buchbar ab',
      group: 'leistung',
      type: 'date',
    }),
    defineField({
      name: 'validUntil',
      title: 'Buchbar bis',
      group: 'leistung',
      type: 'date',
      validation: (Rule) =>
        Rule.custom((value, { document }) => {
          if (
            value &&
            document?.validFrom &&
            new Date(value as string) < new Date(document.validFrom as string)
          ) {
            return '„Buchbar bis" muss nach „Buchbar ab" liegen.'
          }
          return true
        }),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Buchungs-Link',
      group: 'leistung',
      description:
        'Optional. Wenn leer, verwendet das Frontend den Standard-Buchungslink aus den Site-Einstellungen.',
      type: 'url',
    }),
    defineField({
      name: 'gallery',
      title: 'Bildergalerie',
      group: 'medien',
      type: 'array',
      of: [{ type: 'richImage' }],
      validation: (Rule) => Rule.min(1).error('Mindestens 1 Bild benötigt.'),
    }),
    defineField({
      name: 'isPublished',
      title: 'Veröffentlicht?',
      group: 'beschreibung',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Sortier-Reihenfolge',
      group: 'beschreibung',
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
      title: 'title',
      season: 'season',
      price: 'price',
      perPerson: 'pricePerPerson',
      published: 'isPublished',
      gallery: 'gallery',
    },
    prepare({ title, season, price, perPerson, published, gallery }) {
      const de = (title as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const first = Array.isArray(gallery) ? gallery[0] : undefined
      const status = published ? '✓' : '⏳'
      return {
        title: de || '(Ohne Titel)',
        subtitle: `${status}  ·  ${season ?? '—'}  ·  ${price ? `${price} €${perPerson ? '/Person' : ''}` : '— €'}`,
        media: first as never,
      }
    },
  },
})
